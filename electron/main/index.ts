import { BrowserWindow,ipcMain } from 'electron'
import { join } from 'node:path'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { WebContentsInitialization } from 'backend/webcontents'
import { AppInitialization } from 'backend/app'
import { WINDOW_EVENT } from 'shared/Events'
import qs from 'qs'
import { LogParam } from 'types/Log'
import { LOG_MENU_ROUTE } from 'shared/Menu'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

const WINDOW_CACHE = {}
let win: BrowserWindow | null = null

export const getWin = (): BrowserWindow | null => {
  return win
}

export const preload = join(__dirname, '../preload/index.js')
export const url = process.env.VITE_DEV_SERVER_URL
export const entryUrl = `${url}entry.html`
export const indexHtml = join(process.env.DIST, 'index.html')
export const entryHtml = join(process.env.DIST, 'entry.html')
export const isDevelopment = process.env.NODE_ENV !== 'production'

const alphabeticalSort = (a: string, b: string):number => {
  return a.localeCompare(b);
}

const stringifyInOrder = (param:any) => {
  return qs.stringify(param,{ sort: alphabeticalSort})
}

const getWindow = (id:number): BrowserWindow => {
  return BrowserWindow.fromId(id)
}

export const getLogWindow = (param:LogParam): BrowserWindow | null => {
  const logWindowRouteStr = stringifyInOrder(param as any)
  const key = `${LOG_MENU_ROUTE}${logWindowRouteStr}`
  if (WINDOW_CACHE[key]) {
    return getWindow(WINDOW_CACHE[key])
  }else{
    console.warn(`pod ${param.podName} 窗口没有缓存`)
    return null;
  }
}

ipcMain.handle(WINDOW_EVENT.OPEN, (event,route) =>{
  const routeStr = stringifyInOrder(route.param)
  let key = `${route.route}${routeStr}`
  const appendPath = `#${route.route}?${routeStr}`
  let childId = WINDOW_CACHE[key]
  if(!childId){
    const child = new BrowserWindow({ 
      // parent: getWin(),
      title: 'Sub window',
      icon: join(process.env.PUBLIC, 'favicon.ico'),
      webPreferences: {
        preload: preload,
        // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
        // Consider using contextBridge.exposeInMainWorld
        // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
        nodeIntegration: true,
        contextIsolation: false,
      },
      width: 800, 
      height: 600
    })

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
      const url = `${entryUrl}${appendPath}`
      child.loadURL(url)
    } else {
      const url = `${entryHtml}${appendPath}`
      child.loadFile(url)
    }
    

    child.once("ready-to-show", () => {
      child.show();
    });

    childId = child.id
    WINDOW_CACHE[key] = child.id

    child.on('closed', () => {
      delete WINDOW_CACHE[key]
      getWin().show()
    })

    if (process.env.VITE_DEV_SERVER_URL) {
      child.webContents.openDevTools()
    }
  }else{
    const child = getWindow(childId)
    child.focus()
  }
  return childId
})

class Main{
  // Here, you can also use other preload
  
  public constructor() {
    
    const that = this
    const initialization = new AppInitialization(that.createWindow,that.onAppReady)
    initialization.init()
    initialization.bindEvents()
  }

  private createWindow(afterCreateHook?: (win:BrowserWindow) => void):BrowserWindow {
    win = new BrowserWindow({
      title: 'Main window',
      icon: join(process.env.PUBLIC, 'favicon.ico'),
      webPreferences: {
        preload: preload,
        // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
        // Consider using contextBridge.exposeInMainWorld
        // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
        nodeIntegration: true,
        contextIsolation: false,
      },
      width: 800, 
      height: 600
    })
  
    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
      win.loadURL(url)
      // Open devTool if the app is not packaged
      win.webContents.openDevTools()
    } else {
      win.loadFile(indexHtml)
    }

    const initialization = new WebContentsInitialization(win)
    initialization.init()

    afterCreateHook && afterCreateHook(win)
    return win
  }

  private async onAppReady(afterCreateHook?: (win:BrowserWindow) => void) {
    
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      // Devtools extensions are broken in Electron 6.0.0 and greater
      // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
      // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
      // If you are not using Windows 10 dark mode, you may uncomment these lines
      // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
      try {
        await installExtension(VUEJS_DEVTOOLS)
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }

    win = this.createWindow(afterCreateHook)
  }
}

export const main = new Main()
