import Dexie from 'dexie';

const dbName = `action-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`;
const actionDB = new Dexie(dbName);
actionDB.version(1).stores({
    actions: '&id, ethAddress, status, tx, type, [ethAddress+status], [ethAddress+type]'
});

export default actionDB;
