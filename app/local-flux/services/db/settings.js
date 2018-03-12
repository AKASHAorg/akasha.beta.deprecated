export default {
    collectionName : `settings-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`,
    options : {
        indices: ['ethAddress']
    }
};

/**
const dbName = `settings-akasha-${process.env.AKASHA_VERSION}-${process.env.NODE_ENV}`;
const settingsDB = new Dexie(dbName);
settingsDB.version(1).stores({
    geth: '&name, autodag, cache, datadir, fast, ipcpath, mine, minerthreads, networkid',
    ipfs: '&name, ipfsPath',
    user: '&ethAddress, autoCrashReports',
    general: '&name'
});

export default settingsDB;
**/
