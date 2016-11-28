import Dexie from 'dexie';

const settingsDB = new Dexie('settings');
settingsDB.version(1).stores({
    geth: '&name, autodag, cache, datadir, fast, ipcpath, mine, minerthreads, networkid',
    ipfs: '&name, ipfsPath',
    flags: '&name, requestStartupChange',
    user: '&akashaId, autoCrashReports',
    general: '&name'
});

export default settingsDB;
