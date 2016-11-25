import BaseService from './base-service';

class NotificationsService extends BaseService {
    constructor () {
        super();
        this.clientManager = Channel.client.notifications.manager;
    }

    // set profiles< address > to push notifications
    setFilter ({
        profiles = [],
        blockNr = 0,
        onError = () => {
        },
        onSuccess
    }) {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.notifications.setFilter,
            clientChannel: Channel.client.notifications.setFilter,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                Channel.client.notifications.setFilter.channelName
            )
        }, () => {
            Channel.client.notifications.setFilter.send({ profiles, blockNr });
        });
    }

    listenFeed({onError = () => {}, onSuccess, stop = false}) {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.notifications.feed,
            clientChannel: Channel.client.notifications.feed,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                Channel.client.notifications.setFilter.feed
            )
        }, () => {
            Channel.client.notifications.feed.send({stop});
        });
    }

}
export { NotificationsService };
