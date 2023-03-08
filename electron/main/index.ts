import { BrowserWindow } from 'electron'
import { join } from 'node:path'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { WebContentsInitialization } from 'backend/webcontents'
import { AppInitialization } from 'backend/app'
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

let win: BrowserWindow | null = null

export const getWin = (): BrowserWindow | null => {
  return win
}

export const preload = join(__dirname, '../preload/index.js')
export const url = process.env.VITE_DEV_SERVER_URL
export const indexHtml = join(process.env.DIST, 'index.html')
export const isDevelopment = process.env.NODE_ENV !== 'production'
    

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
