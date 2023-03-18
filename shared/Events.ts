import { LogParam } from 'types/Log'
export const SYSTEM_EVENT:Record<string,string> = {
  SYSTEM_INFO: 'system_info'
}

export const STORE_EVENT:Record<string,string> = {
  GET: 'getStoreValue',
  SET: 'setStoreValue',
  STORE: 'store',
  CLEAR: 'clear'
}

export const getCloseFlowLogEvent = (param:LogParam):string => {
  return `CLOSE_${param.podName}_${param.namespace}_${param.containerName}_FLOW_LOG`
}

export const getFlowLogEvent = (param:LogParam):string => {
  return `HANDLE_${param.podName}_${param.namespace}_${param.containerName}_FLOW_LOG`
}

export const K8S_EVENT:Record<string,string> = {
  LIST_POD: 'list_pod',
  OPEN_FLOW_LOG: 'open_flow_log'
}

export const CLIPBOARD_EVENT:Record<string,string> = {
  COPY: 'copy'
}

export const WINDOW_EVENT:Record<string,string> = {
  OPEN: 'open'
}