const IpfsService = require('./ipfs.js');
const GethService = require('./geth.js');
const LoggerService = require('./logger.js');
const util = require('util');

// initialize the AkashaLogger with the user data folder
const app = require('electron').app;
const mainLogger = require('../../loggers/').getInstance(app.getPath('userData'));

// catch all errors [especially not the ones caused by us]
const generalLogger = mainLogger.registerLogger('general');
process.on('uncaughtException', (err) => {
    generalLogger.log(util.inspect(err, false, null));
});

export function initIPCServices (mainWindow) {
    (new GethService()).setupListeners(mainWindow);
    (new LoggerService()).setupListeners(mainWindow);
    (new IpfsService()).setupListeners(mainWindow);
}
