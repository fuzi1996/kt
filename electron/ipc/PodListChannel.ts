import { IpcChannelInterface } from "types/IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest } from "types/IpcRequest";
import { getChannelResponse,getErrorChannelResponse } from 'shared/Response'
import { K8S_EVENT } from 'shared/Events'
import { k8sApi } from 'backend/k8s'
import { getNamespace } from 'backend/store'

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

    k8sApi.listNamespacedPod(namespace).then((res) => {
      event.sender.send(request.responseChannel, res.body)
    }).catch(err => {
      event.sender.send(request.responseErrorChannel, new Error(err.message))
    })
  }
}
