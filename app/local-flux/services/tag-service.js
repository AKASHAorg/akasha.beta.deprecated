import { ipcRenderer } from 'electron';
import debug from 'debug';
import BaseService from './base-service';
import tagsDB from './db/tags';

const dbg = debug('App:TagService:');

/** Tag Service */
class TagService extends BaseService {
    getTags = (startingIndex = 0) => {
        const serverChannel = this.eventChannels.server.entry.getTags;
        const clientChannel = this.eventChannels.client.entry.getTags;
        return new Promise((resolve, reject) => {
            if (typeof this._listeners[clientChannel] === 'function') {
                return this._listeners[clientChannel];
            }
            this._listeners[clientChannel] = (ev, response) => {
                dbg('getTags', response);
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
    // checkTagExistence = (tag) => {
    //     const serverChannel = this.eventChannels.server.entry.tagExists;
    //     const clientChannel = this.eventChannels.client.entry.tagExists;
    //     return new Promise((resolve, reject) => {
    //         ipcRenderer.on(clientChannel, (ev, data) => {
    //             if (!data) {
    //                 const error = new Error('Main Process Crashed!');
    //                 return reject(error);
    //             }
    //             if (!data.success) {
    //                 return reject(data.status.message);
    //             }
    //             return resolve(data);
    //         });
    //         ipcRenderer.send(serverChannel, tag);
    //     });
    // };
    createTag = (tag) => {
        const serverChannel = this.eventChannels.server.entry.addTag;
        const clientChannel = this.eventChannels.client.entry.addTag;
        return new Promise((resolve, reject) => {
            ipcRenderer.on(clientChannel, (ev, data) => {
                if (!data) {
                    const error = new Error('Main Process Crashed');
                    return reject(error);
                }
                if (!data.success) {
                    return reject(data.status.message);
                }
                return resolve(data);
            });
            ipcRenderer.send(serverChannel, tag);
        });
    };
    saveTagToDB = (tags) =>
        tagsDB.transaction('rw', tagsDB.blockTags, () => {
            tags.forEach((tag, key) => {
                tagsDB.blockTags.put({ tag });
            });
        });
    checkExistingTag = (tag) => {
        return tagsDB.transaction('r', tagsDB.blockTags, () => {
            tagsDB.blockTags.where('tag').equalsIgnoreCase(tag).toArray().then(res => {
                if (res.length === 0) {
                    return false;
                } else {
                    return true
                }
            });
        });
    };
}

export { TagService };
