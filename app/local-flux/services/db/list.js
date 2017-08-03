import Dexie from 'dexie';

const dbName = `list-akasha-alpha-${process.env.NODE_ENV}`;
const listDB = new Dexie(dbName);
listDB.version(1).stores({
    lists: '&id, account, name, date',
});

export default listDB;
