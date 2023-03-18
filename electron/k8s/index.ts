import k8s from '@kubernetes/client-node'
import { ipcMain } from 'electron'
import { K8S_EVENT, getCloseFlowLogEvent, getFlowLogEvent } from 'shared/Events'
import { LogParam } from 'types/Log'
import stream from 'stream'
import request from 'request'
import { getLogWindow } from 'backend/main'

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const log = new k8s.Log(kc);

ipcMain.on(K8S_EVENT.OPEN_FLOW_LOG, (_,param:LogParam)=>{
  const logStream = new stream.PassThrough();

  logStream.on('data', (chunk) => {
    // use write rather than console.log to prevent double line feed
    const logWin = getLogWindow(param)
    if (logWin) {
      logWin.webContents.send(getFlowLogEvent(param), chunk);
    }
  });

  log.log(param.namespace, param.podName, param.containerName, logStream, {
    follow: true, 
    tailLines: 50, 
    pretty: false, 
    timestamps: false
  }).catch(err => {
    console.log(err);
  }).then((req:request.Request) => {
    // disconnects after 5 seconds
    ipcMain.once(getCloseFlowLogEvent(param), () => {
      if(req){
        console.log(`${param.podName} 滚动日志已终止`)
        req.abort();
      }
      
    })

    if (req) {
      setTimeout(function(){
        req.abort();
        console.log(`${param.podName} 滚动日志超时自动终止`)
      }, 50000);
    }
  });
})

export const k8sApi = kc.makeApiClient(k8s.CoreV1Api);