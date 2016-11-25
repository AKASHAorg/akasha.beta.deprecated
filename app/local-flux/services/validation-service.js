import BaseService from './base-service';

const Channel = window.Channel;

class ValidationService extends BaseService {
    constructor () {
        super();
        this.clientManager = Channel.client.registry.manager;
    }

    /**
     * Validate akashaId on blockchain
     * Request:
     * @param akashaId <String>
     * Response:
     * @param data = { akashaId: string, exists: Boolean }
     */
    validateakashaId = (akashaId, { onError, onSuccess }) => {
        const serverChannel = Channel.server.registry.profileExists;
        const clientChannel = Channel.client.registry.profileExists;

        return this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(onError, onSuccess, clientChannel.channelName)
        }, () => serverChannel.send({ akashaId }));
    };
}
export { ValidationService };
