import Dexie from 'dexie';
import debug from 'debug';
import { draftSchema } from './schema/draft';
const dbg = debug('App:entriesDB');

const entriesDB = new Dexie('entries');
entriesDB.version(1).stores({
    drafts: '++id',
    entries: '&ipfsHash',
});

const Draft = Dexie.defineClass(draftSchema());

Draft.prototype.save = function () {
    console.log(this, 'zis!');
    return entriesDB.drafts.put(this);
};
entriesDB.drafts.mapToClass(Draft);
entriesDB.drafts.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', obj);
});
entriesDB.entries.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', obj);
});

entriesDB.open();

export default entriesDB;
