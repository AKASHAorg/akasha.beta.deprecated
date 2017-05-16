import Dexie from 'dexie';

const dbName = 'transactions-akasha-alpha-' + process.env.NODE_ENV;
const transactionsDB = new Dexie(dbName);
transactionsDB.version(1).stores({
    pending: '&tx, type, profile, [type+profile]',
    mined: '&tx, type, profile, [type+profile]',
    errors: '&tx, code, message, fatal'
});

transactionsDB.version(2).stores({
    pending: '&tx, type, akashaId, [type+akashaId]',
    mined: '&tx, type, akashaId, [type+akashaId]',
});

export default transactionsDB;
