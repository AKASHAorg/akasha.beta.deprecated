import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';

class GethService {
    /**
     * sends start Geth command to main process w/o options
     * @param {null | object} options
     * @return promise
     */
    startGeth = (options) =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.geth.startService, options);
            ipcRenderer.once(EVENTS.client.geth.startService,
                (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                    if (!data) {
                        return reject('OMG! Main process doesn`t respond to us!');
                    }
                    // return reject({ status: false });
                    return resolve(data);
                });
        });

    stopGeth = () =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.geth.stopService);
            ipcRenderer.once(EVENTS.client.geth.stopService, (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                if (!data) {
                    return reject('OMG! Main process doesn`t respond to us!');
                }
                return resolve(data);
            });
        });
}

export { GethService };
