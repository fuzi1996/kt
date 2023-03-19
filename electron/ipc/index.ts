import { ipcMain } from "electron";
import { Initializer } from "types/Initializer";
import { IpcChannelInterface } from "types/IpcChannelInterface";

export class IPCInitialization implements Initializer{

  private ipcChannels: IpcChannelInterface[]

  constructor(ipcChannels: IpcChannelInterface[]){
    this.ipcChannels = ipcChannels
  }

  public init(): void {
    this.registerIpcChannels()
  }

  private registerIpcChannels() {
    this.ipcChannels.forEach(channel => {
      ipcMain.on(channel.getName(), (event, request) => {
        channel.handle(event, request)
      })
    });
  }
}