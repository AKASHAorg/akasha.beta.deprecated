import Dexie from 'dexie';

const dbName = 'settings-akasha-alpha';
const settingsDB = new Dexie(dbName);
settingsDB.version(1).stores({
    geth: '&name, autodag, cache, datadir, fast, ipcpath, mine, minerthreads, networkid',
    ipfs: '&name, ipfsPath',
    flags: '&name, requestStartupChange',
    user: '&akashaId, autoCrashReports',
    general: '&name'
});

export default settingsDB;
