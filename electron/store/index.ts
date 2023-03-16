import { ipcMain } from 'electron';
import ElectronStore, { Schema } from 'electron-store'
import { STORE_EVENT } from 'shared/Events'
import { STORE_KEY } from 'shared/Store'

// https://json-schema.org/understanding-json-schema/reference/object.html#properties
const schema:Schema<Record<string, any>> = {
	setting: {
		type: 'object',
		properties: {
			defaultNamespace: { 
				type: "string",
				default: "default"
			}
		}
	}
};

const store = new ElectronStore({schema});

export const getNamespace = () => {
	return store.get(STORE_KEY.SETTING_DEFAULT_NAMESPACE)
}

ipcMain.handle(STORE_EVENT.GET, (event, key) => {
	return store.get(key);
});

ipcMain.handle(STORE_EVENT.CLEAR, (event, key) => {
	return store.clear();
});

ipcMain.handle(STORE_EVENT.STORE, (event, key) => {
	return store.store;
});

ipcMain.handle(STORE_EVENT.SET, (event, key, value) => {
	if(value){
		return store.set(key, value);
	}else{
		return store.set(key)
	}
})