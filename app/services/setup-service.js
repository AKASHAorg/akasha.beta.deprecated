const { ipcRenderer } = require('electron');
import { EVENTS } from '../../electron-api/modules/settings';

export function startGethService (options) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.geth.startService, options);
        ipcRenderer.on(EVENTS.client.geth.startService, (event, data) => {
            console.info('Client:SetupService:Received event ', event, ' with data ', data);
            if (!data.success) {
                return reject('Service Unavailable');
            }
            return resolve(data);
        });
    });
}

export function updateSync (cb) {
    ipcRenderer.on(EVENTS.client.geth.syncUpdate, (event, data) => {
        if (!data.success) {
            return cb(data.status);
        }
        return cb(null, data);
    });
}

export function removeUpdateSync (cb) {
    ipcRenderer.removeAllListeners(EVENTS.client.geth.syncUpdate);
    cb();
}
// startIPFS () {
//     return new Promise((resolve, reject) => {
//         ipcRenderer.send('');
//         ipcRenderer.on('', (event, data) => {

//         });
//     });
// }
