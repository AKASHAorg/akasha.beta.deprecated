import BaseService from './base-service';

const Channel = window.Channel;

class NotificationsService extends BaseService {
    constructor () {
        super();
        this.clientManager = Channel.client.notifications.manager;
    }

    // set profiles< address > to push notifications
    setFilter ({
        profiles = [],
        blockNr = 0,
        exclude = [],
        onError = () => { },
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
            Channel.server.notifications.setFilter.send({ profiles, blockNr, exclude });
        });
    }

    listenFeed ({ onError = () => {}, onSuccess, stop = false, newerThan = null }) {
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
            Channel.server.notifications.feed.send({ stop, newerThan });
        });
    }

    includeFilter ({ profiles, onError = () => {}, onSuccess = () => {} }) {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.notifications.includeFilter,
            clientChannel: Channel.client.notifications.includeFilter,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                Channel.client.notifications.includeFilter.channelName
            )
        }, () => {
            Channel.server.notifications.includeFilter.send({ profiles });
        });
    }

    excludeFilter ({ profiles, onError = () => {}, onSuccess = () => {} }) {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.notifications.excludeFilter,
            clientChannel: Channel.client.notifications.excludeFilter,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                Channel.client.notifications.excludeFilter.channelName
            )
        }, () => {
            Channel.server.notifications.excludeFilter.send({ profiles });
        });
    }

    mention = ({ mention, entryId, commentId, onSuccess = () => {}, onError = () => {} }) => {
        const clientChannel = Channel.client.notifications.mention;
        const serverChannel = Channel.server.notifications.mention;
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
            serverChannel.send({ mention, entryId, commentId });
        });
    };

}
export { NotificationsService };
