import Dexie from 'dexie';
import BaseService from './base-service';
import tagsDB from './db/tags';

const { Channel } = window;
/** Tag Service */
class TagService extends BaseService {
    getTags = (startingIndex = 0) => {
        const serverChannel = Channel.server.entry.getTags;
        const clientChannel = Channel.client.entry.getTags;

        return new Promise((resolve, reject) => {
            if (this._listeners.has(clientChannel)) {
                return this._listeners.has(clientChannel);
            }
            this._listeners[clientChannel] = (ev, response) => {
                if (!response) {
                    const error = new Error('Main Process Crashed!');
                    return reject(error);
                }
                if (!response.success) {
                    const error = new Error(response.status.message);
                    return reject(error);
                }
                this.saveTagToDB(response.data.tags).then(() => {
                    return resolve(response.data);
                }).catch(reason => {
                    console.error(reason);
                });
            };
            ipcRenderer.on(clientChannel, this._listeners[clientChannel]);
            ipcRenderer.send(serverChannel, startingIndex);
        });
    };

    getLocalTagsCount = () =>
        tagsDB.transaction('rw', tagsDB.blockTags, () =>
            tagsDB.blockTags.count()
        );

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
    saveTagToDB = tags =>
        tagsDB.transaction('rw', tagsDB.blockTags, () => {
            tags.forEach((tag) => {
                tagsDB.blockTags.put({ tag });
            });
        });

    checkExistingTags = (tag, cb) => {
        this.registerListener(Channel.client.tags.exists, (ev, res) => cb(res));
        console.log('sending tag', tag);
        Channel.server.tags.exists.send({ tagName: tag });
    }
}

export { TagService };
