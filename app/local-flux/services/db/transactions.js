import Dexie from 'dexie';
import debug from 'debug';
const dbg = debug('App:transactionsDB');

const transactionsDB = new Dexie('transactions');
transactionsDB.version(1).stores({
    pending: '&tx',
    mined: '&tx',
    errors: '&tx, code, message, fatal'
});

transactionsDB.pending.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating pending.. ', obj);
});
transactionsDB.pending.hook('updating', (primaryKey, obj, transaction) => {
    dbg('updating pending.. ', obj);
});
transactionsDB.mined.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating mined.. ', obj);
});
transactionsDB.mined.hook('updating', (primaryKey, obj, transaction) => {
    dbg('updating mined.. ', obj);
});

transactionsDB.open();

export default transactionsDB;
