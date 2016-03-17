
const UserPrefs = require('./models/UserPreferences');
const ipcMain = require('electron').ipcMain;
const geth    = require('./modules/geth');
const ipfs    = require('./modules/ipfs');
const userPrefs = new UserPrefs();

global.userPreferences = userPrefs;

global.gethInstance = geth.getInstance();
global.ipfsInstance = ipfs.getInstance();

setTimeout(() => {
  const txs = require('./modules/transactions');
  global.txs = txs.getInstance();
}, 5000);
