const ipfs = require('./ipfs.js');
const geth = require('./geth.js');
const logger = require('./logger.js');
const util = require('util');

// initialize the AkashaLogger with the user data folder
const app = require('electron').app;
require('../../loggers/').getInstance(app.getPath('userData'));

// catch all errors [especially not the ones caused by us]
process.on('uncaughtException', function(err) {

    console.log(util.inspect(err, false, null));
});

export function initIPCServices (mainWindow) {
    const gethIPCService = geth.getInstance();
    const loggerIPCService = logger.getInstance();
    const ipfsService = ipfs.getInstance();

    gethIPCService.setupListeners(mainWindow);
    loggerIPCService.setupListeners(mainWindow);
    ipfsService.setupListeners(mainWindow);
}
