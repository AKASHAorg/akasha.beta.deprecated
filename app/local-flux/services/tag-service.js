import BaseService from './base-service';
import tagsDB from './db/tags';

const { Channel } = window;
/** Tag Service */
class TagService extends BaseService {
    constructor () {
        super();
        this.clientManager = Channel.client.tags.manager;
    }

    getLocalTagsCount = () =>
        tagsDB.blockTags.count();

    createPendingTag = ({ tagObj, onSuccess, onError }) =>
        tagsDB.pendingTags.put(tagObj)
            .then(() => onSuccess(tagObj))
            .catch(reason => onError(reason));

    updatePendingTag = ({ tagObj, onSuccess, onError }) =>
        tagsDB.pendingTags.update(tagObj.tag, tagObj)
            .then(() => onSuccess(tagObj))
            .catch(error => onError(error));

    deletePendingTag = ({ tagObj, onSuccess, onError }) =>
        tagsDB.pendingTags.delete(tagObj.tag)
            .then(() => onSuccess(tagObj))
            .catch(error => onError(error));

    getPendingTags = ({ profile, onSuccess, onError }) =>
        tagsDB.pendingTags.where('profile').equals(profile).toArray()
            .then(results => onSuccess(results))
            .catch(reason => onError(reason));

    registerTag = ({ tagName, token, gas, onSuccess, onError }) => {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.tags.create,
            clientChannel: Channel.client.tags.create,
            listenerCb: this.createListener(
                onError,
                (data) => {
                    onSuccess({ tag: tagName, tx: data.tx });
                },
            )
        }, () => {
            Channel.server.tags.create.send({ tagName, token, gas });
        });
    };

    checkExistingTags = (tag, cb) => {
        Channel.client.tags.exists.on(cb);
        Channel.server.tags.exists.send({ tagName: tag });
    };

    removeExistsListeners = () => {
        Channel.client.tags.exists.removeAllListeners();
    };

    getSelectedTag = ({
        akashaId,
        onError = () => {
        },
        onSuccess
    }) =>
        tagsDB.selectedTag.where('akashaId').equals(akashaId).toArray()
            .then(results => onSuccess(results[0]))
            .catch(reason => onError(reason));

    saveTag = ({
        akashaId,
        tagName,
        onError = () => {
        },
        onSuccess
    }) => {
        tagsDB.selectedTag.put({ akashaId, tagName });
        return tagsDB.selectedTag
            .where('akashaId')
            .equals(akashaId)
            .toArray()
            .then(results => onSuccess(results[0]))
            .catch(reason => onError(reason));
    };

    tagIterator = ({
        start,
        limit,
        onError = () => {
        },
        onSuccess
    }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.tags.tagIterator,
            clientChannel: Channel.client.tags.tagIterator,
            listenerCb: this.createListener(
                onError,
                onSuccess,
            )
        }, () => {
            Channel.server.tags.tagIterator.send({ start, limit });
        });

    subscribeTag = ({
        token,
        tagName,
        gas = 2000000,
        onError = () => {
        },
        onSuccess
    }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.tags.subscribe,
            clientChannel: Channel.client.tags.subscribe,
            listenerCb: this.createListener(
                onError,
                onSuccess,
            )
        }, () => {
            Channel.server.tags.subscribe.send({ token, tagName, gas });
        });

    unsubscribeTag = ({
        token,
        tagName,
        gas = 2000000,
        onError = () => {
        },
        onSuccess
    }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.tags.unSubscribe,
            clientChannel: Channel.client.tags.unSubscribe,
            listenerCb: this.createListener(
                onError,
                onSuccess,
            )
        }, () => {
            Channel.server.tags.unSubscribe.send({ token, tagName, gas });
        });
}

export { TagService };
