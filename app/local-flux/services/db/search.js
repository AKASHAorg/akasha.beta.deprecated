export default {
    collectionName : `search-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`,
    options : {
        indices: ['ethAddress', 'lastEntriesBlock', 'lastTagsBlock']
    }
};

/**
import Dexie from 'dexie';

const dbName = `search-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`;
const searchDB = new Dexie(dbName);
searchDB.version(1).stores({
    lastEntriesBlock: '&ethAddress',
    lastTagsBlock: '&type',
});

export default searchDB;
**/
