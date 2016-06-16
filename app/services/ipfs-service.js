import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';


class IpfsService {
    /**
     * Send start IPFS service command to main process. Optionally can pass options
     * @param {null | object} options
     * @return promise
     */
    startIPFS = (options) =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.ipfs.startService, options);
            ipcRenderer.once(EVENTS.client.ipfs.startService, (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                if (!data) {
                    return reject('OMG! Main process doesn`t respond to us!');
                }
                return resolve(data);
            });
        });
    configureIpfs = (config) =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.ipfs.configureService, config);
            ipcRenderer.once(EVENTS.client.ipfs.configureService, (event, data) => {
                if (!data) {
                    return reject('Main process failure!');
                }
                return resolve(data);
            });
        });
    stopIPFS = () =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.ipfs.stopService);
            ipcRenderer.once(EVENTS.client.ipfs.stopService, (event, data) => {
                // no data means that something very bad happened
                // like losing the main process
                if (!data) {
                    return reject('OMG! Main process doesn`t respond to us!');
                }
                return resolve(data);
            });
        });
}

export { IpfsService };
