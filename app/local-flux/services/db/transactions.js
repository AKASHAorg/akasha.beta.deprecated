import Dexie from 'dexie';

const transactionsDB = new Dexie('transactions');
transactionsDB.version(1).stores({
    pending: '&tx',
    mined: '&tx',
    errors: '&tx, code, message, fatal'
});

transactionsDB.open();

export default transactionsDB;
