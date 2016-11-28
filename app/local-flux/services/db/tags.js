import Dexie from 'dexie';

const tagsDB = new Dexie('tags');
tagsDB.version(1).stores({
    pendingTags: '&tag, tx, profile',
    selectedTag: '&akashaId'
});

export default tagsDB;
