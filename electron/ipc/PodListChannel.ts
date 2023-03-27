import { IpcChannelInterface } from "types/IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest } from "types/IpcRequest";
import { getChannelResponse,getErrorChannelResponse } from 'shared/Response'
import { K8S_EVENT } from 'shared/Events'
import { getK8sApi } from 'backend/k8s'
import { getNamespace } from 'backend/store'
import log from 'electron-log'

export class PodListChannel implements IpcChannelInterface {
  getName(): string {
    return K8S_EVENT.LIST_POD
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = getChannelResponse(this.getName())
    }
    if (!request.responseErrorChannel){
      request.responseErrorChannel = getErrorChannelResponse(this.getName());
    }

    const namespace = getNamespace()

    // issues/4
    getK8sApi().listNamespacedPod(namespace).then((res) => {
      event.sender.send(request.responseChannel as string, res.body)
    }).catch(err => {
      log.error(`list namespace [${namespace}] pod errr:`,err)
      event.sender.send(request.responseErrorChannel as string, new Error(err.message))
    })
  }
}
