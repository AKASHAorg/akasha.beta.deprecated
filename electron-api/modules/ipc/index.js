const IpfsService = require('./ipfs.js');
const GethService = require('./geth.js');
const LoggerService = require('./logger.js');
const UserService = require('./user.js');

// initialize the AkashaLogger with the user data folder
const app = require('electron').app;
const mainLogger = require('../../loggers/').getInstance(app.getPath('userData'));

// catch all errors [especially not the ones caused by us]
const generalLogger = mainLogger.registerLogger('general');

// we must ensure this is called only once
const geth = new GethService();
const logger = new LoggerService();
const ipfs = new IpfsService();
const user = new UserService();

process.on('uncaughtException', (err) => {
    generalLogger.warn(err);
});

app.on('before-quit', () => {
    geth.shutDown();
    logger.shutDown();
});

export function initIPCServices (mainWindow) {
    geth.setupListeners(mainWindow);
    logger.setupListeners(mainWindow);
    ipfs.setupListeners(mainWindow);
    user.setupListeners(mainWindow);
}
