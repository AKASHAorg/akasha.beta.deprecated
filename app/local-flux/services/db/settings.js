import Dexie from 'dexie';
import debug from 'debug';
const dbg = debug('App:settingsDB');

const settingsDB = new Dexie('settings');
settingsDB.version(1).stores({
    geth: '&name, datadir, ipcpath, cache',
    ipfs: '&name, ipfsPath',
    flags: '&name, requestStartupChange',
    user: '&username, autoCrashReports'
});

settingsDB.geth.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', obj);
});
settingsDB.ipfs.hook('creating', (primaryKey, obj, transaction) => {
    dbg('creating.. ', obj);
});

settingsDB.open();

export default settingsDB;
