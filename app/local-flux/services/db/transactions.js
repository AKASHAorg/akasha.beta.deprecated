import Dexie from 'dexie';

const transactionsDB = new Dexie('transactions');
transactionsDB.version(1).stores({
    pending: '&tx, type, profile, [type+profile]',
    mined: '&tx, type, profile, [type+profile]',
    errors: '&tx, code, message, fatal'
});

export default transactionsDB;
