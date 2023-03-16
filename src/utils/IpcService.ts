import { IpcRenderer,ipcRenderer } from 'electron';
import { IpcRequest } from "types/IpcRequest";
import { getChannelResponse,getErrorChannelResponse } from 'shared/Response'

export class IpcService {
  private ipcRenderer?: IpcRenderer;

  public send<T>(channel: string, request: IpcRequest = {}): Promise<T> {
    // If the ipcRenderer is not available try to initialize it
    if (!this.ipcRenderer) {
      this.initializeIpcRenderer();
    }
    // If there's no responseChannel let's auto-generate it
    if (!request.responseChannel) {
      request.responseChannel = getChannelResponse(channel);
    }
    if(!request.responseErrorChannel){
      request.responseErrorChannel = getErrorChannelResponse(channel)
    }

    this.ipcRenderer?.send(channel, request);

    // This method returns a promise which will be resolved when the response has arrived.
    return new Promise((resolve,reject) => {
      this.ipcRenderer?.once(request.responseChannel as string, (event, response) => resolve(response));
      this.ipcRenderer?.once(request.responseErrorChannel as string, (event, err) => reject(err));
    });
  }

  private initializeIpcRenderer() {
    this.ipcRenderer = ipcRenderer;
  }
}
