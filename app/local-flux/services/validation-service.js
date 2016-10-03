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
    validateUsername = (username, { onError, onSuccess }) => {
        const serverChannel = Channel.server.registry.profileExists;
        const clientChannel = Channel.client.registry.profileExists;

        return this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => ipcRenderer.send(serverChannel, { username }));
    };
}
export { ValidationService };
