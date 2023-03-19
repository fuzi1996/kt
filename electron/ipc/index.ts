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
  }

  private registerIpcChannels() {
    this.ipcChannels.forEach(channel => {
      ipcMain.on(channel.getName(), (event, request) => {
        channel.handle(event, request)
      })
    });
  }
}