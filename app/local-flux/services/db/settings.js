import Dexie from 'dexie';

const dbName = 'settings-akasha-alpha-' + process.env.NODE_ENV;
const settingsDB = new Dexie(dbName);
settingsDB.version(1).stores({
    geth: '&name, autodag, cache, datadir, fast, ipcpath, mine, minerthreads, networkid',
    ipfs: '&name, ipfsPath',
    flags: '&name, requestStartupChange',
    user: '&akashaId, autoCrashReports',
    general: '&name'
});

// Remove the flags table and move its content to general settings
settingsDB.version(2).stores({
    flags: null
});

export default settingsDB;
