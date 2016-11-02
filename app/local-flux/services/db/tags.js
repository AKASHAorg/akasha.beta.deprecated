import Dexie from 'dexie';

const tagsDB = new Dexie('tags');
tagsDB.version(1).stores({
    blockTags: '&tag',
    pendingTags: '&tag, tx'
});

tagsDB.open();

export default tagsDB;
