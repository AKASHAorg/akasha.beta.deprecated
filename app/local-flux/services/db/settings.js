import Dexie from 'dexie';

const dbName = `settings-akasha-alpha-${process.env.NODE_ENV}`;
const settingsDB = new Dexie(dbName);
settingsDB.version(1).stores({
    geth: '&name, autodag, cache, datadir, fast, ipcpath, mine, minerthreads, networkid',
    ipfs: '&name, ipfsPath',
    user: '&ethAddress, autoCrashReports',
    general: '&name'
});

export default settingsDB;
