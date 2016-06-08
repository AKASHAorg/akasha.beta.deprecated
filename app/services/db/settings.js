import Dexie from 'dexie';

const db = new Dexie('settings');
db.version(1).stores({
    geth: 'dataDir, ipcPath, cacheSize',
    ipfs: 'apiPort, gatewayPort'
});

export default db;
