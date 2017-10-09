import Dexie from 'dexie';

const dbName = `tags-akasha-alpha-${process.env.NODE_ENV}`;
const tagsDB = new Dexie(dbName);
tagsDB.version(1).stores({
    allTags: '&tagId, tagName',
    margins: '&staticId',
});

export default tagsDB;
