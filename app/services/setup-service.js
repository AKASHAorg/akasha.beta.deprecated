const { ipcRenderer } = require('electron');
import { EVENTS } from '../../electron-api/modules/settings';

export function startGethService () {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.geth.startService);
        ipcRenderer.on(EVENTS.client.geth.startService, (event, data) => {
            console.info('Client:SetupService:Received event ', event, ' with data ', data);
            if (!data.success) {
                return reject('Service Unavailable');
            }
            return resolve(data);
        });
    });
}
// startIPFS () {
//     return new Promise((resolve, reject) => {
//         ipcRenderer.send('');
//         ipcRenderer.on('', (event, data) => {

//         });
//     });
// }
