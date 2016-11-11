import BaseService from './base-service';
import tagsDB from './db/tags';

const { Channel } = window;
/** Tag Service */
class TagService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.tags.manager;
        this.clientManager = Channel.client.tags.manager;
    }

    getLocalTagsCount = () =>
        tagsDB.transaction('rw', tagsDB.blockTags, () =>
            tagsDB.blockTags.count()
        );

    createPendingTag = ({ tagObj, onSuccess, onError }) =>
        tagsDB.transaction('rw', tagsDB.pendingTags, () => {
            tagsDB.pendingTags.add(tagObj);
            return tagsDB.pendingTags.where('tag').equals(tagObj.tag).toArray();
        })
        .then(savedTag => onSuccess(savedTag[0]))
        .catch(reason => onError(reason));

    updatePendingTag = ({ tagObj, onSuccess, onError }) =>
        tagsDB.transaction('rw', tagsDB.pendingTags, () => {
            tagsDB.pendingTags.update(tagObj.tag, tagObj);
            return tagsDB.pendingTags.where('tag').equals(tagObj.tag).toArray();
        })
        .then(results => onSuccess(results[0]))
        .catch(error => onError(error));

    deletePendingTag = ({ tagObj, onSuccess, onError }) =>
        tagsDB.transaction('rw', tagsDB.pendingTags, () =>
            tagsDB.pendingTags.delete(tagObj.tag)
        )
        .then(() => onSuccess(tagObj))
        .catch(error => onError(error));

    getPendingTags = ({ profile, onSuccess, onError }) =>
        tagsDB.transaction('r', tagsDB.pendingTags, () =>
            tagsDB.pendingTags.where('profile').equals(profile).toArray()
        )
          .then(results => onSuccess(results))
          .catch(reason => onError(reason));

    registerTag = ({ tagName, token, gas, onSuccess, onError }) => {
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.tags.create,
            clientChannel: Channel.client.tags.create,
            listenerCb: this.createListener(
                onError,
                data => onSuccess({ tag: tagName, tx: data.tx }),
            )
        }, () => {
            Channel.server.tags.create.send({ tagName, token, gas });
        });
    }

    checkExistingTags = (tag, cb) => {
        Channel.client.tags.exists.on(cb);
        Channel.server.tags.exists.send({ tagName: tag });
    }

    removeExistsListeners = () => {
        Channel.client.tags.exists.removeAllListeners();
    }
}

export { TagService };
