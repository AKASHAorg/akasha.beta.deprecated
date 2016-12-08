import BaseService from './base-service';

const Channel = window.Channel;


class CommentService extends BaseService {
    getEntryComments = ({ entryId, start, limit, onSuccess, onError }) =>
        this.openChannel({
            clientManager: Channel.client.comments.manager,
            serverChannel: Channel.server.comments.commentsIterator,
            clientChannel: Channel.client.comments.commentsIterator,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            const payload = {
                entryId, limit
            };
            if (start) {
                payload.start = start;
            }
            Channel.server.comments.commentsIterator.send(payload);
        });

    publishComment = ({ onSuccess, onError, ...payload }) => {
        this.registerListener(
            Channel.client.comments.comment,
            this.createListener(onError, onSuccess)
        );
        console.log(payload, 'creating comment!!');
        Channel.server.comments.comment.send(payload);
    }
}
export { CommentService };
