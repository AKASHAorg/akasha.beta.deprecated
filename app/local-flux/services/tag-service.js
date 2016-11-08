import Dexie from 'dexie';
import BaseService from './base-service';
import tagsDB from './db/tags';

const { Channel } = window;
/** Tag Service */
class TagService extends BaseService {
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
            tagsDB.pendingTags.add(tagObj);
            return tagsDB.pendingTags
                .where('tag')
                .equals(tagObj.tag)
                .toArray()
                .then(results => results[0]);
        }).then((result) => {
            console.log('saved to db', result);
            onSuccess(result);
        })
        .catch(reason => onError(reason));
    // registerTags = (tags) => {
    //     const serverChannel = Channel.server.entry.addTags;
    //     const clientChannel = Channel.client.entry.addTags;
    //     return new Promise((resolve, reject) => {
    //         ipcRenderer.on(clientChannel, (ev, data) => {
    //             if (!data) {
    //                 const error = new Error('Main Process Crashed');
    //                 return reject(error);
    //             }
    //             if (!data.success) {
    //                 return reject(data.status.message);
    //             }
    //             return resolve(data);
    //         });
    //         ipcRenderer.send(serverChannel, tags);
    //     });
    // };
    registerTag = ({ tagName, token, gas, onSuccess, onError }) => {
        // const successCb = ({ data }) => {
        //     tagsDB.transaction('rw', tagsDB.pendingTags, () => {
        //         tagsDB.pendingTags.add({ tagName, tx: data.tx });
        //         return tagsDB.pendingTags
        //                 .where('tagName')
        //                 .equals(tagName)
        //                 .toArray();
        //     }).then(results => onSuccess(results[0]));
        // };

        this.registerListener(
            Channel.client.tags.create,
            this.createListener(onError, onSuccess)
        );
        console.log('sending', {}, 'to Main');
        Channel.server.tags.create.send({ tagName, token, gas });
    }

    saveTagToDB = tags =>
        tagsDB.transaction('rw', tagsDB.blockTags, () => {
            tags.forEach((tag) => {
                tagsDB.blockTags.put({ tag });
            });
        });

    checkExistingTags = (tag, cb) => {
        this.registerListener(
            Channel.client.tags.exists,
            cb
        );
        Channel.server.tags.exists.send({ tagName: tag });
    }
}

export { TagService };
