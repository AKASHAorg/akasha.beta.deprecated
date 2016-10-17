import Dexie from 'dexie';
import debug from 'debug';

const dbg = debug('App:tagsDB');

const tagsDB = new Dexie('tags');
tagsDB.version(1).stores({
    blockTags: '&tag'
});

tagsDB.blockTags.hook('creating', (primaryKey, obj) => {
    dbg('creating.. ', obj);
});

tagsDB.open();

export default tagsDB;
