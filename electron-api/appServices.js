const geth = require('./modules/geth');
const ipfs = require('./modules/ipfs');
const Logger = require('./loggers');
const remote = require('electron').remote;
let app = remote.app;

const userData = app.getPath('userData');
const linvoDb = require('linvodb3');
linvoDb.dbPath = userData;
Logger.getInstance(userData);

window.gethInstance = geth.getInstance();
window.ipfsInstance = ipfs.getInstance();

window.gethInstance.start();
window.ipfsInstance.start();

app.on('before-quit', () => {
  window.gethInstance.stop();
  window.ipfsInstance.stop();
  app = null;
});
