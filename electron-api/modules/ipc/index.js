const ipfs = require('./ipfs.js');
const geth = require('./geth.js');
const logger = require('./logger.js');


export function initIPCServices ( mainWindow ) {
    
    const gethIPCService = geth.getInstance();
    const loggerIPCService = logger.getInstance();

    //ipfs.setupListeners(mainWindow);
    gethIPCService.setupListeners(mainWindow);
    loggerIPCService.setupListeners(mainWindow);

}