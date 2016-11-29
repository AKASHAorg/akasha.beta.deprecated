import Dexie from 'dexie';

const dbName = (process.env.NODE_ENV === 'production') ? 'tags-akasha': 'tags-dev';
const tagsDB = new Dexie(dbName);
tagsDB.version(1).stores({
    pendingTags: '&tag, tx, profile',
    selectedTag: '&akashaId'
});

export default tagsDB;
