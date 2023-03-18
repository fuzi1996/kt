import { ipcMain,clipboard } from 'electron';
import { CLIPBOARD_EVENT } from 'shared/Events'

ipcMain.handle(CLIPBOARD_EVENT.COPY, (event, text: string) => {
	clipboard.writeText(text)
})