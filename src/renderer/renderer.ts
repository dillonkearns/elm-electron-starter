const Elm = require('./Main.elm')
import { ipcRenderer } from 'electron'

let app = Elm.Main.fullscreen()

app.ports.sendIpc.subscribe(function([message, data]: any) {
  console.log('sendIpc', message, data)
  ipcRenderer.send('elm-electron-ipc', { message, data })
})
