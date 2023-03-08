import { ipcMain } from 'electron';
import ElectronStore from 'electron-store'
import { STORE_EVENT } from 'shared/Events'
const store = new ElectronStore();

ipcMain.handle(STORE_EVENT.GET, (event, key) => {
	return store.get(key);
});

ipcMain.handle(STORE_EVENT.SET, (event, key, value) => {
 return store.set(key, value);
})