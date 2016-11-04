import Dexie from 'dexie';
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
    // getTags = (startingIndex = 0) => {
    //     const serverChannel = Channel.server.entry.getTags;
    //     const clientChannel = Channel.client.entry.getTags;

    //     return new Promise((resolve, reject) => {
    //         if (this._listeners.has(clientChannel)) {
    //             return this._listeners.has(clientChannel);
    //         }
    //         this._listeners[clientChannel] = (ev, response) => {
    //             if (!response) {
    //                 const error = new Error('Main Process Crashed!');
    //                 return reject(error);
    //             }
    //             if (!response.success) {
    //                 const error = new Error(response.status.message);
    //                 return reject(error);
    //             }
    //             this.saveTagToDB(response.data.tags).then(() => {
    //                 return resolve(response.data);
    //             }).catch(reason => {
    //                 console.error(reason);
    //             });
    //         };
    //         ipcRenderer.on(clientChannel, this._listeners[clientChannel]);
    //         ipcRenderer.send(serverChannel, startingIndex);
    //     });
    // };

    getLocalTagsCount = () =>
        tagsDB.transaction('rw', tagsDB.blockTags, () =>
            tagsDB.blockTags.count()
        );

    getPendingTags = ({ onSuccess, onError }) =>
        tagsDB.transaction('r', tagsDB.pendingTags, () =>
            tagsDB.pendingTags.toArray()
        )
          .then(results => onSuccess(results))
          .catch(reason => onError(reason));

    savePendingTag = ({ tagObj, onSuccess, onError }) =>
        tagsDB.transaction('rw', tagsDB.pendingTags, () => {
            tagsDB.pendingTags.put(tagObj);
            return tagsDB.pendingTags
                .where('tag')
                .equals(tagObj.tag)
                .toArray()
                .then(results => results[0]);
        }).then((result) => {
            onSuccess(result);
        })
        .catch(reason => onError(reason));

    registerTag = ({ tagName, token, gas, onSuccess, onError }) => {
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.tags.create,
            clientChannel: Channel.client.tags.create,
            listenerCb: this.createListener(
                onError,
                onSuccess,
            )
        }, () => {
            Channel.server.tags.create.send({ tagName, token, gas });
        });
    }

    saveTagToDB = tags =>
        tagsDB.transaction('rw', tagsDB.blockTags, () => {
            tags.forEach((tag) => {
                tagsDB.blockTags.put({ tag });
            });
        });

    checkExistingTags = (tag, cb) => {
        Channel.client.tags.exists.on(cb);
        Channel.server.tags.exists.send({ tagName: tag });
    }
}

export { TagService };
