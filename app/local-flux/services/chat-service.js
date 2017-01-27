import BaseService from './base-service';
import chatDB from './db/chat';

class ChatService extends BaseService {

    joinChannels = ({ channels, onSuccess = () => {}, onError = () => {} }) =>
        this.openChannel({
            clientManager: Channel.client.chat.manager,
            serverChannel: Channel.server.chat.join,
            clientChannel: Channel.client.chat.join,
            listenerCb: this.createListener(onError, onSuccess)
        }, () =>
            Channel.server.chat.join.send({ channels })
        );

    leaveChannels = ({ channels, onSuccess = () => {}, onError = () => {} }) =>
        this.openChannel({
            clientManager: Channel.client.chat.manager,
            serverChannel: Channel.server.chat.leave,
            clientChannel: Channel.client.chat.leave,
            listenerCb: this.createListener(onError, onSuccess)
        }, () =>
            Channel.server.chat.leave.send({ channels })
        );

    getCurrentChannels = ({ onSuccess, onError }) =>
        this.openChannel({
            clientManager: Channel.client.chat.manager,
            serverChannel: Channel.server.chat.getCurrentChannels,
            clientChannel: Channel.client.chat.getCurrentChannels,
            listenerCb: this.createListener(onError, onSuccess)
        }, () =>
            Channel.server.chat.getCurrentChannels.send()
        );

    getJoinedChannels = ({ akashaId, onSuccess, onError }) =>
        chatDB.channels
            .where('akashaId')
            .equals(akashaId)
            .toArray()
            .then(data => onSuccess(data[0] ? data[0].joinedChannels : []))
            .catch(reason => onError(reason));

    getRecentChannels = ({ akashaId, onSuccess, onError }) =>
        chatDB.channels
            .where('akashaId')
            .equals(akashaId)
            .toArray()
            .then(data => onSuccess(data[0] ? data[0].recentChannels : []))
            .catch(reason => onError(reason));

    saveChannel = ({ loggedAkashaId, channel, onSuccess, onError }) => {
        chatDB.channels
            .where('akashaId')
            .equals(loggedAkashaId)
            .toArray()
            .then((data) => {
                if (!data[0]) {
                    chatDB.channels
                        .put({ akashaId: loggedAkashaId, joinedChannels: [channel] })
                        .then(updated => updated ? onSuccess(channel) : onError(''))
                        .catch(error => onError(error));
                    return;
                }
                const joinedChannels = data[0].joinedChannels || [];
                const index = joinedChannels.indexOf(channel);
                if (index !== -1) {
                    onError();
                } else {
                    const newChannels = [...joinedChannels, channel];
                    chatDB.channels
                        .update(loggedAkashaId, { joinedChannels: newChannels })
                        .then(updated => updated ? onSuccess(channel) : onError())
                        .catch(reason => onError(reason));
                }
            })
            .catch(reason => onError(reason));
    };

    deleteChannel = ({ loggedAkashaId, channel, onSuccess, onError }) => {
        chatDB.channels
            .where('akashaId')
            .equals(loggedAkashaId)
            .toArray()
            .then((data) => {
                if (!data[0] || !data[0].joinedChannels) {
                    return onError();
                }
                const joinedChannels = data[0].joinedChannels || [];
                const index = joinedChannels.indexOf(channel);
                if (index === -1) {
                    onError();
                } else {
                    joinedChannels.splice(index, 1);
                    chatDB.channels
                        .update(loggedAkashaId, { joinedChannels })
                        .then(updated => updated ? onSuccess(channel) : onError())
                        .catch(reason => onError(reason));
                }
            })
            .catch(reason => onError(reason));
    };

    saveRecentChannel = ({ loggedAkashaId, channel, onSuccess, onError }) => {
        chatDB.channels
            .where('akashaId')
            .equals(loggedAkashaId)
            .toArray()
            .then((data) => {
                if (!data[0]) {
                    chatDB.channels
                        .put({ akashaId: loggedAkashaId, recentChannels: [channel] })
                        .then(updated => updated ? onSuccess([channel]) : onError(''))
                        .catch(error => onError(error));
                    return;
                }
                const channels = data[0].recentChannels || [];
                const index = channels.indexOf(channel);
                let newChannels;
                if (index !== -1) {
                    newChannels = [...channels.slice(0, index), ...channels.slice(index + 1)];
                    newChannels.unshift(channel);
                } else if (channels.length >= 10) {
                    newChannels = [...channels];
                    newChannels.pop();
                    newChannels.unshift(channel);
                } else {
                    newChannels = [channel, ...channels];
                }
                chatDB.channels
                    .update(loggedAkashaId, { recentChannels: newChannels })
                    .then(updated => updated ? onSuccess(newChannels) : onError())
                    .catch(reason => onError(reason));
            })
            .catch(reason => onError(reason));
    };

    deleteRecentChannel = ({ loggedAkashaId, channel, onSuccess, onError }) => {
        chatDB.channels
            .where('akashaId')
            .equals(loggedAkashaId)
            .toArray()
            .then((data) => {
                if (!data[0] || !data[0].recentChannels) {
                    return onError();
                }
                const recentChannels = data[0].recentChannels || [];
                const index = recentChannels.indexOf(channel);
                if (index === -1) {
                    onError();
                } else {
                    recentChannels.splice(index, 1);
                    chatDB.channels
                        .update(loggedAkashaId, { recentChannels })
                        .then(updated => updated ? onSuccess(channel) : onError())
                        .catch(reason => onError(reason));
                }
            })
            .catch(reason => onError(reason));
    };
}

export { ChatService };
