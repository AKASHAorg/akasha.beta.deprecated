export default {
    collectionName : `list-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`,
    options : {
        indices: ['ethAddress', 'date', 'id'],
        unique: ['id']
    }
};

/**
import Dexie from 'dexie';

const dbName = `list-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`;
const listDB = new Dexie(dbName);
listDB.version(1).stores({
    lists: '&id, ethAddress, name, date, [ethAddress+id]',
});

export default listDB;
**/
