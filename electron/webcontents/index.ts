import { BrowserWindow, shell } from "electron";
import { Initializer } from 'types/Initializer'
import { EventBinder } from 'types/EventBinder'

export class WebContentsInitialization implements Initializer,EventBinder{

  private win: BrowserWindow | null = null

  constructor(win: BrowserWindow){
    this.win = win
  }

  public init() {
    this.bindEvents()
    this.setWebContents()
  }

  private setWebContents(){
    // Make all links open with the browser, not with the application
    this.win?.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url)
      return { action: 'deny' }
    })
  }

  public bindEvents(){
    // Test actively push message to the Electron-Renderer
    this.win?.webContents.on('did-finish-load', () => {
      this.win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // win.webContents.on('will-navigate', (event, url) => { }) #344
  }
}