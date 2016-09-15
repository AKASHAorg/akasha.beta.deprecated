import { ipcRenderer } from 'electron';
import entriesDB from './db/entry';
import debug from 'debug';
const dbg = debug('App:DraftService:');

/** * DELETE THIS *****/
import { generateEntries } from './faker-data';
/** ******************/

class DraftService {
    constructor () {
        this.listeners = {};
    }
    removeListener = (channel) => {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
        this.listeners[channel] = null;
    };
    saveDraft = (partialDraft) =>
        entriesDB.transaction('rw', entriesDB.drafts, () => {
            if (partialDraft.id) {
                return entriesDB.drafts.update(partialDraft.id, partialDraft).then(updated => {
                    dbg('draft ', partialDraft.id, 'updated');
                    if (updated) {
                        return partialDraft;
                    }
                    return null;
                });
            }
            return entriesDB.drafts.add(partialDraft).then(draftId => {
                dbg('draft with id', draftId, 'created');
                return partialDraft;
            });
        });
    getAllDrafts = (userName) =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts
                     .where('authorUsername')
                     .equals(userName)
                     .toArray()
                     .then(drafts => {
                         dbg('getAllDrafts', drafts);
                         const convDrafts = drafts.map(draft => {
                             return Object.assign({}, draft);
                         });
                         return convDrafts;
                     })
        );
    getDraftsCount = (userName) =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts.where('authorUsername').equals(userName).count()
        )
    // get resource by id (drafts or entries);
    getById = (table, id) =>
        entriesDB.transaction('r', entriesDB[table], () => {
            dbg('getById from', table, 'with id', id);
            return entriesDB[table]
                    .where('id')
                    .equals(parseInt(id, 10))
                    .first();
        });
}

export { DraftService };
