import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import entriesDB from './db/entry.js';

class EntryService {
    saveDraft = (draft) =>
        new Promise((resolve, reject) => {
            entriesDB.transaction('r', entriesDB.drafts, () => {
                console.log(entriesDB.table('drafts'));
                entriesDB.drafts.save(draft);
            });
        });
}

export { EntryService };
