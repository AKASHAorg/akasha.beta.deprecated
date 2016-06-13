
const { ipcMain } = require('electron');
const Logger = require('../../loggers');
const { EVENTS } = require('../settings');

const symbolEnforcer = Symbol();
const symbol = Symbol();

class LoggerService {
    /*
     * This is called from the getInstance function.
     * It shouldn't be called from any other place with new LoggerService
     * @param {Symbol} enforcer
     * @returns {LoggerService}
     */
    constructor (enforcer) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }
        this.loggerNames = ['geth', 'ipfs'];
        this.PREVIOUS_LOG_LINES = -10;
        this.serverEvent = EVENTS.server.logger;
        this.clientEvent = EVENTS.client.logger;
    }
    /**
     * Makes sure it returns the same reference to a GethAction instance
     * This must be used in order to get a GethAction instance
     * @returns {GethAction}
     */
    static getInstance () {
        if (!this[symbol]) {
            this[symbol] = new LoggerService(symbolEnforcer);
        }
        return this[symbol];
    }
    /**
    * Shorthand function for sending events back to the View layer
    * @param event
    */
    _sendEvent (event) {
        return (name, successCode, data) => {
            event.sender.send(name, {
                success: successCode,
                status: data
            });
        };
    }
    /*
     * It sets up the listeners for this module.
     *
     * @param {BrowserWindow} mainWindow
     * @returns undefined
     */
    setupListeners (mainWindow) {
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
                        level: level,
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
        //the stopGethInfo message before the startGethInfo
        if(this.__gethUpdatesHandler && typeof this.__gethUpdatesHandler == 'function') {
            this._getLog('geth').removeListener('logging', this.__gethUpdatesHandler);
            this.__gethUpdatesHandler = null;
        }
    }

}

export default LoggerService;
