import { ipcRenderer } from 'electron';
import BaseService from './base-service';

const Channel = window.Channel;
/**
 * Ipfs process management
 * default open channels => ['startService', 'stopService', 'status', 'resolve']
 * channels => ['manager', 'startService', 'stopService', 'status', 'resolve']
 */
class IpfsService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.ipfs.manager;
        this.clientManager = Channel.client.ipfs.manager;
    }
    /**
     * Send start IPFS service command to main process.
     * @param {object} options
     * @return promise
     */
    start = ({ options = {}, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.ipfs.startService;
        const clientChannel = Channel.client.ipfs.startService;
        const ipfsOptions = {};
        Object.keys(options).forEach((key) => {
            if (key !== 'name' && options[key] !== '') {
                ipfsOptions[key] = options[key];
            }
        });
        this.registerListener(clientChannel, this.createListener(onError, onSuccess));
        serverChannel.send(ipfsOptions);
    }
    /**
     * Stop ipfs service
     */
    stop = ({ options = {}, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.ipfs.stopService;
        const clientChannel = Channel.client.ipfs.stopService;
        this.registerListener(clientChannel, this.createListener(onError, onSuccess));
        serverChannel.send(options);
    }
    /**
     * get ipfs status
     * @response data = {
     *      downloading?: boolean;
     *      api: boolean;
     *      spawned: boolean;
     *      started?: boolean;
     *      stopped?: boolean;
     * }
     */
    getStatus = ({ options = {}, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.ipfs.status;
        const clientChannel = Channel.client.ipfs.status;
        this.registerListener(clientChannel, this.createListener(onError, onSuccess));
        serverChannel.send(options);
    }
    resolve = ({ options = {}, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.ipfs.resolve;
        const clientChannel = Channel.client.ipfs.resolve;
        this.registerListener(clientChannel, this.createListener(onError, onSuccess));
        serverChannel.send(options);
    }
}

export { IpfsService };
