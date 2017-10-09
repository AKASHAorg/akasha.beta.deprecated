import Dexie from 'dexie';
import draftSchema from './schema/draft';

const dbName = 'entries-akasha-alpha-' + process.env.NODE_ENV;
const entriesDB = new Dexie(dbName);
entriesDB.version(1).stores({
    drafts: '++id,ethAddress',
    entries: '&ipfsHash',
    savedEntries: '&ethAddress'
});

entriesDB.drafts.mapToClass(draftSchema);

entriesDB.drafts.hook('creating', (primaryKey, obj) => {
    obj.created_at = new Date().toString();
    obj.updated_at = new Date().toString();
});

entriesDB.drafts.hook('updating', (modifications, primaryKey, obj) => ({
    updated_at: new Date().toString(),
    created_at: obj.created_at
}));


export default entriesDB;
