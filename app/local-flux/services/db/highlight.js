export default {
    collectionName : `highlight-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`,
    options : {
        indices: ['ethAddress', 'publisher', 'timestamp', 'id'],
        unique: ['id']
    }
};

/**
import Dexie from 'dexie';

const dbName = ``;
const highlightDB = new Dexie(dbName);
highlightDB.version(1).stores({
    highlights: '&id, ethAddress, content, entryId, entryTitle, notes, publisher, timestamp'
});

export default highlightDB;
**/
