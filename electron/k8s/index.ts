import k8s, { KubeConfig, Log } from '@kubernetes/client-node'
import { ipcMain } from 'electron'
import { K8S_EVENT, getCloseFlowLogEvent, getFlowLogEvent } from 'shared/Events'
import { LogParam } from 'types/Log'
import stream from 'stream'
import request from 'request'
import { getLogWindow } from 'backend/main'


let kc:KubeConfig|null = null

const initKubeConfig = () => {
  kc = new k8s.KubeConfig();
  kc.loadFromDefault();
}

const getKubeConfig = ():KubeConfig => {
  if(kc === null){
    initKubeConfig()
  }
  return kc as KubeConfig
}

let log: Log|null = null

const initLog = ():void => {
  log = new k8s.Log(getKubeConfig());
}

const getLog = ():Log => {
  if(log === null){
    initLog()
  }
  return log as Log
}

ipcMain.on(K8S_EVENT.OPEN_FLOW_LOG, (_,param:LogParam)=>{
  const logStream = new stream.PassThrough();

  logStream.on('data', (chunk) => {
    // use write rather than console.log to prevent double line feed
    const logWin = getLogWindow(param)
    if (logWin) {
      logWin.webContents.send(getFlowLogEvent(param), chunk);
    }
  });

  getLog().log(param.namespace, param.podName, param.containerName, logStream, {
    follow: true, 
    tailLines: 50, 
    pretty: false, 
    timestamps: false
  }).catch(err => {
    console.log(err);
  }).then((req) => {
    const request = req as request.Request
    // disconnects after 5 seconds
    ipcMain.once(getCloseFlowLogEvent(param), () => {
      if(request){
        console.log(`${param.podName} 滚动日志已终止`)
        request.abort();
      }
    })
  });
})

let k8sApi:k8s.CoreV1Api|null = null

export const getK8sApi = ():k8s.CoreV1Api =>{
  if(k8sApi === null){
    k8sApi = getKubeConfig().makeApiClient(k8s.CoreV1Api)
  }
  return k8sApi
}