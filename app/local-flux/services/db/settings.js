import Dexie from 'dexie';

const dbName = (process.env.NODE_ENV === 'production') ? 'settings-akasha': 'settings-dev';
const settingsDB = new Dexie(dbName);
settingsDB.version(1).stores({
    geth: '&name, autodag, cache, datadir, fast, ipcpath, mine, minerthreads, networkid',
    ipfs: '&name, ipfsPath',
    flags: '&name, requestStartupChange',
    user: '&akashaId, autoCrashReports',
    general: '&name'
});

export default settingsDB;
