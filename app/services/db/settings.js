import Dexie from 'dexie';
import debug from 'debug';
const dbg = debug('App:settingsDB');

const db = new Dexie('settings');
db.version(1).stores({
    geth: ',dataDir, ipcPath, cache',
    ipfs: ',apiPort, gatewayPort'
});

db.geth.hook('creating', (primaryKey, obj, trans) => {
    dbg('saving to geth ', primaryKey, obj, trans);
});

export default db;
