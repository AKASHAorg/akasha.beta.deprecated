import Dexie from 'dexie';
import debug from 'debug';
import { getDraftClass } from './schema/draft';
const dbg = debug('App:entriesDB');

const entriesDB = new Dexie('entries');
entriesDB.version(1).stores({
    drafts: '++id',
    entries: '&ipfsHash',
});

entriesDB.drafts.mapToClass(getDraftClass());

entriesDB.drafts.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', obj);
    obj.created_at = new Date().toString();
});
entriesDB.drafts.hook('updating', (modifications, primaryKey, obj, transaction) => {
    dbg('updating..', obj, modifications);
    return {
        updated_at: new Date().toString()
    };
});
entriesDB.entries.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', obj);
});

entriesDB.open();

export default entriesDB;
