import { IPCInitialization } from 'backend/ipc'
import { SystemInfoChannel } from 'backend/ipc/SystemInfoChannel'
import { PodListChannel } from 'backend/ipc/PodListChannel'
import "backend/k8s"
import "backend/store"
import "backend/clipboard"

const ipcInitialization = new IPCInitialization([
  new SystemInfoChannel(),
  new PodListChannel()
]);
ipcInitialization.init()