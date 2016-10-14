import Dexie from 'dexie';
import { getDraftClass } from './schema/draft';

const entriesDB = new Dexie('entries');
entriesDB.version(1).stores({
    drafts: '++id,tags,authorUsername',
    entries: '&ipfsHash',
    savedEntries: '++id,username'
});

entriesDB.drafts.mapToClass(getDraftClass());

entriesDB.drafts.hook('creating', (primaryKey, obj) => {
    obj.status = {
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
        tagsPublished: false,
        publishing: false
    };
});

entriesDB.drafts.hook('updating', (modifications, primaryKey, obj) => {
    return {
        status: {
            created_at: obj.status.created_at,
            updated_at: new Date().toString(),
            tagsPublished: obj.status.tagsPublished,
            publishing: obj.status.publishing
        }
    };
});

entriesDB.open();

export default entriesDB;
