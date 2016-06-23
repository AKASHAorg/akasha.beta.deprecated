
const { ipcMain } = require('electron');
const Logger = require('../../loggers');
const IpcService = require('./ipcService');


class LoggerService extends IpcService {
    /*
     * @returns {LoggerService}
     */
    constructor () {
        super('logger');
        this.loggerNames = ['geth', 'ipfs'];
        this.PREVIOUS_LOG_LINES = -10;
    }
    /*
     * It sets up the listeners for this module.
     *
     * @param {BrowserWindow} mainWindow - ignored for now
     * @returns undefined
     */
    setupListeners () {
        ipcMain.on(this.serverEvent.gethInfo, (event, arg) => {
            this._getGethInfo(event, arg);
        });
        ipcMain.on(this.serverEvent.stopGethInfo, (event, arg) => {
            this._stopGethInfo(event, arg);
        });
    }
    /**
    * Shorthand function for getting the AkashaLogger instance
    * @returns {AkashaLogger}
    */
    _getGlobalLogger () {
        return Logger.getInstance();
    }
    /**
    * Shorthand function for getting a winston.Logger instance
    * @returns {winston.Logger}
    */
    _getLog (name) {
        return this._getGlobalLogger().getLogger(name);
    }
    /**
    * This function queries the GETH Logger for the last this.PREVIOUS_LOG_LINES entries
    * and sends them back to the view layer.
    * If arg is boolean true, it keeps sending entries to the client. If the client wants
    * to stop receiving entries it has to send this.serverEvent.stopGethInfo message.
    * @param event, arg
    * @returns undefined
    */
    _getGethInfo (event, arg) {
        if (this._getLog('geth')) {
            this._getLog('geth').query({
                start: this.PREVIOUS_LOG_LINES
            }, (err, data) => {
                if (!err) {
                    this._sendEvent(event)(this.clientEvent.gethInfo, true, data);
                } else {
                    this._sendEvent(event)(this.clientEvent.gethInfo, false, err);
                }
            });
            if (arg === true) {
                this._stopGethInfo(event);
                this._getLog('geth').on('logging', this._sendGethUpdates(event));
            }
        }
    }
    /**
    * This function is called every time the client wants to be updated with GETH new log entries.
    * It returns a function that gets called every time a new entry is logged by AkashaLogger.
    * @param event
    * @returns {Function}
    */
    _sendGethUpdates (event) {
        this.__gethUpdatesHandler = (transport, level, msg, meta) => {
            this._sendEvent(event)(this.clientEvent.gethInfo, true, {
                'log-geth': [
                    {
                        level: level, // eslint-disable-line object-shorthand
                        message: msg,
                        timestamp: (new Date()).toString()
                    }
                ]
            });
        };
        return this.__gethUpdatesHandler;
    }
    /**
    * This function is called when the client is not interested any more in the GETH updates
    * @param event, arg
    * @returns undefined
    */
    _stopGethInfo () {
        // We have to check for the existing of this function handler as someone might send
        // the stopGethInfo message before the startGethInfo
        if (this.__gethUpdatesHandler && typeof this.__gethUpdatesHandler === 'function') {
            this._getLog('geth').removeListener('logging', this.__gethUpdatesHandler);
            this.__gethUpdatesHandler = null;
        }
    }

    shutDown () {
        this._stopGethInfo();
    }

}

export default LoggerService;
