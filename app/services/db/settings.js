import Dexie from 'dexie';
import debug from 'debug';
const dbg = debug('App:settingsDB');

const db = new Dexie('settings');
db.version(1).stores({
    geth: '&name, dataDir, ipcPath, cache',
    user: '&username, autoCrashReports'
});

db.geth.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', primaryKey, obj, transaction);
});

db.open();

export default db;
