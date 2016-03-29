
const UserPrefs = require('./models/UserPreferences');
const ipcMain = require('electron').ipcMain;
const geth    = require('./modules/geth');
const ipfs    = require('./modules/ipfs');
const userPrefs = new UserPrefs();

global.userPreferences = userPrefs;

global.gethInstance = geth.getInstance();
global.ipfsInstance = ipfs.getInstance();

global.akasha = {};
global.akasha.userPrefs = userPrefs;

setTimeout(() => {
//   const txs = require('./modules/transactions');
//   global.akasha.txInstance = txs.getInstance();
//   const shh = require('./modules/whisper');
//   global.akasha.shhInstance = shh.getInstance();
const prof = require('./modules/profiles');
  global.akasha.profileInstance = prof.getInstance();
 }, 5000);
