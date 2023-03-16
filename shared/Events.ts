export const SYSTEM_EVENT:Record<string,string> = {
  SYSTEM_INFO: 'system_info'
}

export const STORE_EVENT:Record<string,string> = {
  GET: 'getStoreValue',
  SET: 'setStoreValue',
  STORE: 'store',
  CLEAR: 'clear'
}

export const K8S_EVENT:Record<string,string> = {
  LIST_POD: 'list_pod'
}

export const CLIPBOARD_EVENT:Record<string,string> = {
  COPY: 'copy'
}