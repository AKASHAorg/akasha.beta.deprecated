import Dexie from 'dexie';

const tagsDB = new Dexie('tags');
tagsDB.version(1).stores({
    blockTags: '&tag'
});

tagsDB.open();

export default tagsDB;
