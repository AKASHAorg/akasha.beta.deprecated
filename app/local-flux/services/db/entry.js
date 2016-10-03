import Dexie from 'dexie';
import debug from 'debug';
import { getDraftClass } from './schema/draft';
const dbg = debug('App:entriesDB');

const entriesDB = new Dexie('entries');
entriesDB.version(1).stores({
    drafts: '++id,tags,authorUsername',
    entries: '&ipfsHash',
    savedEntries: '++id,username'
});

entriesDB.drafts.mapToClass(getDraftClass());

entriesDB.drafts.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', obj);
    obj.status = {
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
        tagsPublished: false,
        publishing: false
    };
});

entriesDB.drafts.hook('updating', (modifications, primaryKey, obj, transaction) => {
    dbg('updating..', obj, modifications);
    return {
        status: {
            created_at: obj.status.created_at,
            updated_at: new Date().toString(),
            tagsPublished: obj.status.tagsPublished,
            publishing: obj.status.publishing
        }
    };
});

entriesDB.entries.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', obj);
});

entriesDB.savedEntries.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating savedEntries ', obj);
});

entriesDB.open();

export default entriesDB;
