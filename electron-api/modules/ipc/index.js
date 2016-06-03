const ipfs = require('./ipfs.js');
const geth = require('./geth.js');
const logger = require('./logger.js');

// initialize the AkashaLogger with the user data folder
const app = require('electron').app;
require('../../loggers/').getInstance(app.getPath('userData'));

export function initIPCServices (mainWindow) {
    const gethIPCService = geth.getInstance();
    const loggerIPCService = logger.getInstance();
    const ipfsService = ipfs.getInstance();

    gethIPCService.setupListeners(mainWindow);
    loggerIPCService.setupListeners(mainWindow);
    ipfsService.setupListeners(mainWindow);
}
