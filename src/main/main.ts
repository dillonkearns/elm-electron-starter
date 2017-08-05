/*
This is the main Electron NodeJS process, used to control global application state
like windows, global shortcuts, the tray, etc.
See the "Main Process" section in the docs: https://electron.atom.io/docs/
*/
import { ipcMain, app, Tray, BrowserWindow, screen, dialog } from 'electron'
import * as fs from 'fs'
const isLocal = require('electron-is-dev')
// import { Ipc, ElmIpc } from './typescript/ipc'

const transparencyDisabled = fs.existsSync(
  `${app.getPath('userData')}/NO_TRANSPARENCY`
)
const autoUpdater = require('electron-updater').autoUpdater
autoUpdater.requestHeaders = { 'Cache-Control': 'no-cache' }
require('electron-debug')({
  enabled: true // enable chrome debug shortcuts in prod build
})

import * as path from 'path'
import * as url from 'url'

import { Ipc, ElmIpc } from './ipc'

const log = require('electron-log')
const assetsDirectory = path.join(__dirname, 'assets')
const { version } = require('./package.json')
log.info(`Running version ${version}`)

let checkForUpdates = true

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  let isDevEnv = process.env.NODE_ENV === 'dev'
  let prodUrl = url.format({
    pathname: path.join(__dirname, 'src/renderer/index.html'),
    protocol: 'file:'
  })
  let devUrl = url.format({
    hostname: 'localhost',
    pathname: path.join('src/renderer/index.html'),
    port: '8080',
    protocol: 'http',
    slashes: true
  })
  mainWindow.loadURL(isDevEnv ? devUrl : prodUrl)
}

const focusMainWindow = () => {
  if (mainWindow) {
    mainWindow.focus()
  }
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  focusMainWindow()
})
if (shouldQuit) {
  app.quit()
}

const onMac = /^darwin/.test(process.platform)
const onWindows = /^win/.test(process.platform)

function onReady() {
  createMainWindow()
  setupAutoUpdater()
  Ipc.setupIpcMessageHandler((ipc: ElmIpc) => {
    if (ipc.message === 'Quit') {
      app.quit()
    } else if (ipc.message === 'GreetingDialog') {
      dialog.showMessageBox(mainWindow, { message: 'Hello!' })
    } else {
      /*
      the exhaustive check assignment
      ensures that you handle every possible message
      see: https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html
      Note: there is currently a typescript bug that will give a compiler error
      if there is only one type in the union so you need at least two messages in renderer/Ipc.elm.
      */
      const _exhaustiveCheck: never = ipc
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', onReady)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.show()
  }
})

const setupAutoUpdater = () => {
  autoUpdater.logger = log
  autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update')
  })

  autoUpdater.on('error', (ev: any, err: any) => {
    log.info('error checking for updates')
    checkForUpdates = true
  })

  autoUpdater.on('update-available', () => {
    log.info('update-available')
    checkForUpdates = false
  })

  autoUpdater.on('update-downloaded', (versionInfo: any) => {
    log.info('update-downloaded: ', versionInfo)
  })

  autoUpdater.on('update-not-available', () => {
    log.info('update-not-available')
  })

  if (!isLocal) {
    autoUpdater.checkForUpdates()
    let myCheckForUpdates = () => {
      if (checkForUpdates) {
        autoUpdater.checkForUpdates()
      }
    }
    const updateIntervalSeconds = 120
    setInterval(myCheckForUpdates, updateIntervalSeconds * 1000)
  }
}
