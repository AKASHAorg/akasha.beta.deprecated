import BaseService from './base-service';

const Channel = global.Channel;


class CommentService extends BaseService {
    getEntryComments = ({ entryId, start, limit, reverse, onSuccess, onError }) =>
        this.openChannel({
            clientManager: Channel.client.comments.manager,
            serverChannel: Channel.server.comments.commentsIterator,
            clientChannel: Channel.client.comments.commentsIterator,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            const payload = {
                entryId, limit, reverse
            };
            if (start) {
                payload.start = start;
            }
            Channel.server.comments.commentsIterator.send(payload);
        });
    // a separate listener should be used here!
    getNewEntryComments = ({ entryId, start, limit, reverse, onSuccess, onError }) => {
        this.openChannel({
            clientManager: Channel.client.comments.manager,
            serverChannel: Channel.server.comments.commentsIterator,
            clientChannel: Channel.client.comments.commentsIterator,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.comments.commentsIterator.send({ entryId, start, limit, reverse });
        });
        // Channel.client.comments.manager.once((ev, res) => {
        //     // if (res.error) return onError(res.error);
        //     Channel.client.comments.commentsIterator.once((evnt, resp) => {
        //         if (resp.error) return onError(resp.error);
        //         return onSuccess(resp.data);
        //     });
        //     const payload = {
        //         entryId, limit, reverse
        //     };
        //     if (start) {
        //         payload.start = start;
        //     }
        //     Channel.server.comments.commentsIterator.send(payload);
        // });
        // Channel.server.comments.commentsIterator.enable();
    }

    getCommentsCount = ({ entryId, onSuccess, onError }) =>
        this.openChannel({
            clientManager: Channel.client.comments.manager,
            serverChannel: Channel.server.comments.commentsCount,
            clientChannel: Channel.client.comments.commentsCount,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.comments.commentsCount.send({ entryId });
        });

    publishComment = ({ onSuccess, onError, ...payload }) => {
        this.registerListener(
            Channel.client.comments.comment,
            this.createListener(onError, onSuccess)
        );
        Channel.server.comments.comment.send(payload);
    }
}
export { CommentService };
