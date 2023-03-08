import { IPCInitialization } from 'backend/ipc'
import { SystemInfoChannel } from 'backend/ipc/SystemInfoChannel';
import "backend/k8s"
import "backend/store"

const ipcInitialization = new IPCInitialization([
  new SystemInfoChannel()
]);
ipcInitialization.init()