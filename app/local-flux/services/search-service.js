import BaseService from './base-service';

const Channel = window.Channel;

class SearchService extends BaseService {
    handshake = ({ onError, onSuccess }) => {
        this.registerListener(
            Channel.client.search.handshake,
            this.createListener(onError, onSuccess)
        );
        Channel.server.search.handshake.send({});
    };

    query = ({ text, offset = 0, pageSize = 5, onError, onSuccess }) => {
        this.registerListener(
            Channel.client.search.query,
            this.createListener(onError, onSuccess)
        );
        Channel.server.search.query.send({ text, offset, pageSize });
    };
}

export { SearchService };
