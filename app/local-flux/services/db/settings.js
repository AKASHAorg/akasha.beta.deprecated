import Dexie from 'dexie';

const settingsDB = new Dexie('settings');
settingsDB.version(1).stores({
    geth: '&name, autodag, cache, datadir, fast, ipcpath, mine, minerthreads, networkid',
    ipfs: '&name, ipfsPath',
    flags: '&name, requestStartupChange',
    user: '&username, autoCrashReports',
    general: '&name'
});

settingsDB.open();

export default settingsDB;
