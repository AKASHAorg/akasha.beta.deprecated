import Dexie from 'dexie';

const dbName = `search-akasha-alpha-${process.env.NODE_ENV}`;
const searchDB = new Dexie(dbName);
searchDB.version(1).stores({
    lastEntriesBlock: '&ethAddress',
    lastTagsBlock: '&type',
});

export default searchDB;
