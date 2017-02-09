import BaseService from './base-service';

const Channel = window.Channel;

class UtilsService extends BaseService {
    constructor () {
        super();
        this.clientManager = Channel.client.utils.manager;
    }

    backupKeys = ({ target, onSuccess, onError }) => {
        const clientChannel = Channel.client.utils.backupKeys;
        const serverChannel = Channel.server.utils.backupKeys;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ target });
        });
    };
}

export { UtilsService };
