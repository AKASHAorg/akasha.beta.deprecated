import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import entriesDB from './db/entry.js';
import debug from 'debug';
const dbg = debug('App:EntryService:');

class EntryService {
    saveDraft = (draft) =>
        new Promise((resolve, reject) => {
            entriesDB.transaction('rw', entriesDB.drafts, () => {
                if (draft.id) {
                    return entriesDB.drafts.update(draft.id, draft).then(updated => {
                        dbg('draft ', draft, 'updated');
                        if (updated) {
                            return entriesDB.drafts.get(draft.id)
                                            .then(updatedDraft => resolve(updatedDraft));
                        }
                        return reject(draft);
                    });
                }
                return entriesDB.drafts.add(draft).then(draftId => {
                    dbg('draft with id', draftId, 'created');
                    return entriesDB.drafts.get(draftId).then(foundDraft => resolve(foundDraft));
                });
            });
        });
    getAllDrafts = () =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts.toArray().then(drafts => {
                dbg('getAllDrafts', drafts);
                return drafts;
            })
        );
    getById = (table, id) =>
        entriesDB.transaction('r', entriesDB[table], () => {
            dbg('getById from', table, 'with id', id);
            return entriesDB[table]
                    .where('id')
                    .equals(parseInt(id, 10))
                    .first();
        });
}

export { EntryService };
