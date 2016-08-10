import { ipcRenderer } from 'electron';
import { EVENTS } from '../../../electron-api/modules/settings';
import debug from 'debug';
const dbg = debug('App:GethService:');

class GethService {
    /**
     * sends start Geth command to main process w/o options
     * @param {null | object} options
     * @return promise
     */
    startGeth = (options) =>
        new Promise((resolve, reject) => {
            dbg('Starting Geth service on channel:', EVENTS.client.geth.startService);
            ipcRenderer.once(EVENTS.client.geth.startService,
                (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                    if (!data) {
                        return reject('OMG! Main process doesn`t respond to us!');
                    }
                    return resolve(data);
                });
            ipcRenderer.send(EVENTS.server.geth.startService, options);
        });

    stopGeth = () =>
        new Promise((resolve, reject) => {
            dbg('Stopping Geth service on channel:', EVENTS.client.geth.stopService);
            ipcRenderer.once(EVENTS.client.geth.stopService, (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                if (!data) {
                    return reject('OMG! Main process doesn`t respond to us!');
                }
                return resolve(data);
            });
            ipcRenderer.send(EVENTS.server.geth.stopService);
        });
    getStatus = () =>
        new Promise((resolve, reject) => {
            dbg('Retrieving Geth status');
            resolve({
                isRunning: false,
                network: 'main'
            });
        })
}

export { GethService };
