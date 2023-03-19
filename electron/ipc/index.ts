import { BrowserWindow, app, ipcMain } from "electron";
import { Initializer } from "types/Initializer";
import { IpcChannelInterface } from "types/IpcChannelInterface";
import { getWin,preload,url,indexHtml } from "backend/main"

export class IPCInitialization implements Initializer{

  private ipcChannels: IpcChannelInterface[]
  private win: BrowserWindow|null

  constructor(ipcChannels: IpcChannelInterface[]){
    this.win = getWin()
    this.ipcChannels = ipcChannels
  }

  public init(): void {
    this.registerIpcChannels()
    ipcMain.on('read-user-path', () => {
      this.win?.webContents.send('on-read-user-path',app.getPath('userData')) 
    });
    
    // New window example arg: new windows url
    ipcMain.handle('open-win', (_, arg) => {
      const childWindow = new BrowserWindow({
        webPreferences: {
          preload: preload,
          nodeIntegration: true,
          contextIsolation: false,
        },
      })
    
      if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
      } else {
        childWindow.loadFile(indexHtml, { hash: arg })
      }
    })
  }

  private registerIpcChannels() {
    this.ipcChannels.forEach(channel => {
      ipcMain.on(channel.getName(), (event, request) => {
        channel.handle(event, request)
      })
    });
  }
}