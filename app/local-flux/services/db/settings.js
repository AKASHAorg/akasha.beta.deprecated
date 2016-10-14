import Dexie from 'dexie';

const settingsDB = new Dexie('settings');
settingsDB.version(1).stores({
    geth: '&name, datadir, ipcpath, cache',
    ipfs: '&name, ipfsPath',
    flags: '&name, requestStartupChange',
    user: '&username, autoCrashReports'
});

settingsDB.open();

export default settingsDB;
