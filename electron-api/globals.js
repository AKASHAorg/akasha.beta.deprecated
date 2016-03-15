const UserPreferences = require('./models/UserPreferences');
const ipcMain = require('electron').ipcMain;
const geth    = require('./modules/geth');
const ipfs    = require('./modules/ipfs');
const userPreferences  = new UserPreferences();

global.userPreferences = userPreferences;

global.gethInstance = geth.getInstance();
global.ipfsInstance = ipfs.getInstance();
