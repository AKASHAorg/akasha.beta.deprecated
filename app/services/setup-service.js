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
export function stopGethService () {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.geth.stopService);
        ipcRenderer.on(EVENTS.client.geth.stopService, (event, data) => {
            console.info('Client:SetupService:stopGethService ', data);
            if (!data.success) {
                return reject(data);
            }
            return resolve(data);
        });
    });
}
export function startIPFSService (options) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.ipfs.startService, options);
        ipcRenderer.on(EVENTS.client.ipfs.startService, (event, data) => {
            if (!data.success) {
                return reject(data.status);
            }
            return resolve(data);
        });
    });
}
export function stopIPFSService () {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.ipfs.stopService);
        ipcRenderer.on(EVENTS.client.ipfs.stopService, (event, data) => {
            if (!data.success) {
                return reject(data);
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

export function removeUpdateSync (listener, cb) {
    ipcRenderer.removeListener(EVENTS.client.geth.syncUpdate, listener);
    if (cb) return cb();
}

// startIPFS () {
//     return new Promise((resolve, reject) => {
//         ipcRenderer.send('');
//         ipcRenderer.on('', (event, data) => {

//         });
//     });
// }
