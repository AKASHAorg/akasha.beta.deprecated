import Dexie from 'dexie';

const dbName = (process.env.NODE_ENV === 'production') ? 'transactions-akasha' : 'transactions-dev';
const transactionsDB = new Dexie(dbName);
transactionsDB.version(1).stores({
    pending: '&tx, type, profile, [type+profile]',
    mined: '&tx, type, profile, [type+profile]',
    errors: '&tx, code, message, fatal'
});

export default transactionsDB;
