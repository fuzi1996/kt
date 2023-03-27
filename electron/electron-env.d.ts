/// <reference types="vite-plugin-electron/electron-env" />
/// <reference types="electron-log/src" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    /** /dist/ or /public/ */
    PUBLIC: string
  }
}
