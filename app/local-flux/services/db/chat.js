import Dexie from 'dexie';

const dbName = `chat-akasha-alpha-${process.env.NODE_ENV}`;
const chatDB = new Dexie(dbName);
chatDB.version(1).stores({
    channels: '&akashaId'
});

export default chatDB;
