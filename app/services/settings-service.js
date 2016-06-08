import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import settingsDB from './db/settings';

export function saveSettings (table, settings) {
    return new Promise((resolve, reject) => {
        console.log(settings);
        settingsDB.transaction('rw', settingsDB.geth, async() => {
            resolve(await settingsDB[table].add({ settings }));
        }).catch(err => {
            console.log(err, 'db error');
            return reject(err);
        });
    });
}

export function getSettings (table, query) {}
