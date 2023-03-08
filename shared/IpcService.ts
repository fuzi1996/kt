import {ipcRenderer,IpcRenderer} from 'electron';
import {IpcRequest} from "types/IpcRequest";

export const getChannelResponse = (channel: string): string => {
  return `${channel}_response_${new Date().getTime()}`
}

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

    this.ipcRenderer?.send(channel, request);

    // This method returns a promise which will be resolved when the response has arrived.
    return new Promise(resolve => {
      this.ipcRenderer?.once(request.responseChannel as string, (event, response) => resolve(response));
    });
  }

  private initializeIpcRenderer() {
    if (!window || !window.process || !window.require) {
      throw new Error(`Unable to require renderer process`);
    }
    this.ipcRenderer = ipcRenderer;
  }
}
