import { ipcMain } from 'electron'

class Ipc {
  static setupIpcMessageHandler(onIpcMessage: (elmIpc: ElmIpc) => any) {
    ipcMain.on('elm-electron-ipc', (event: any, payload: any) => {
      onIpcMessage(payload)
    })
  }
}

export { Ipc, ElmIpc }

type ElmIpc = Quit | GreetingDialog

interface Quit {
  message: 'Quit'
}

interface GreetingDialog {
  message: 'GreetingDialog'
}
