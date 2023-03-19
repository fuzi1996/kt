import { BrowserWindow, app } from "electron";
import { EventBinder } from "types/EventBinder";
import { Initializer } from "types/Initializer";

export class AppInitialization implements Initializer,EventBinder{
  private win: BrowserWindow|null = null;
  private createWindow: () => BrowserWindow
  private onAppReady: ((afterCreateHook?: (win:BrowserWindow)=>void) => void)|null = null

  constructor(createWindow: () => BrowserWindow,onAppReady?: () => void){
    this.createWindow = createWindow
    if(onAppReady){
      this.onAppReady = onAppReady
    }
  }

  public init() {
  }

  public bindEvents(){
    app.on('ready', ()=>{
      this.onAppReady && this.onAppReady((win)=>{
        this.win = win
      })
    })
    app.on('window-all-closed', this.onWindowAllClosed)
    app.on('second-instance', this.onSecondInstance)
    app.on('activate', this.onActivate)
  }

  private onWindowAllClosed() {
    this.win = null
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  private onSecondInstance(){
    if (this.win) {
      // Focus on the main window if the user tried to open another
      if (this.win.isMinimized()){
        this.win.restore()
      }
      this.win.focus()
    }
  }

  private onActivate(){
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
      allWindows[0].focus()
    } else {
      this.createWindow()
    }
  }
}