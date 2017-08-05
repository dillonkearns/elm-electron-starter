/*
This is the main Electron NodeJS process, used to control global application state
like windows, global shortcuts, the tray, etc.
See the "Main Process" section in the docs: https://electron.atom.io/docs/
*/
import { ipcMain, app, Tray, BrowserWindow, screen } from 'electron'
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
const log = require('electron-log')
const assetsDirectory = path.join(__dirname, 'assets')
const { version } = require('./package.json')
log.info(`Running version ${version}`)

let checkForUpdates = true

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'src/renderer/index.html'),
      protocol: 'file:',
      slashes: true
    })
  )
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
