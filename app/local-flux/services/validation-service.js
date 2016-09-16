import { ipcRenderer } from 'electron';
import BaseService from './base-service';

const Channel = window.Channel;

class ValidationService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.registry.manager;
        this.clientManager = Channel.client.registry.manager;
    }
    /**
     * Validate username on blockchain
     * Request:
     * @param username <String>
     * Response:
     * @param data = { username: string, exists: Boolean }
     */
    validateUsername = (username) => {
        const serverChannel = Channel.server.registry.profileExists;
        const clientChannel = Channel.client.registry.profileExists;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () => ipcRenderer.send(serverChannel, { username }));
        });
    };
}
export { ValidationService };
