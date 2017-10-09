import Dexie from 'dexie';

const dbName = `highlight-akasha-alpha-${process.env.NODE_ENV}`;
const highlightDB = new Dexie(dbName);
highlightDB.version(1).stores({
    highlights: '&id, ethAddress, content, entryId, entryTitle, notes, publisher, timestamp'
});

export default highlightDB;
