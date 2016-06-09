
const { ipcMain } = require('electron');
const { IpfsConnector } = require('../services/ipfs-connector/index.js');
const loggerRegistrar = require('../../loggers');
const { EVENTS } = require('../settings');

const symbolEnforcer = Symbol();
const symbol = Symbol();

/**
 * IpfsService class
 * It provides the View layer with access to geth instance.
 * It also registers events for the View layer, in order for the View layer
 * to be notified of what happens on the blockchain.
 *
 */
class IpfsService {
    /*
     * This is called from the getInstance function.
     * It shouldn't be called from any other place with new IpfsService
     * @param {Symbol} enforcer
     * @returns {IpfsService}
     */
    constructor (enforcer) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }
        this.serverEvent = EVENTS.server.ipfs;
        this.clientEvent = EVENTS.client.ipfs;
    }
    /**
     * Makes sure it returns the same reference to a IpfsService instance
     * This must be used in order to get a IpfsService instance
     * @returns {IpfsService}
     */
    static getInstance () {
        if (!this[symbol]) {
            this[symbol] = new IpfsService(symbolEnforcer);
        }
        return this[symbol];
    }
    /*
     * It sets up the listeners for this module.
     * Events used are:
     * server:ipfs:startService used by the View layer to start the ipfs executable
     *
     * @param {BrowserWindow} mainWindow
     * @returns undefined
     */
    setupListeners (mainWindow) {
        ipcMain.on(this.serverEvent.startService, (event, arg) => {
            this._startIpfsService(event, arg);
        });
        ipcMain.on(this.serverEvent.stopService, (event, arg) => {
            IpfsConnector.getInstance().stop();
        });
    }
    _sendEvent (event) {
        return (name, successCode, data) => {
            event.sender.send(name, {
                success: successCode,
                status: data
            });
        };
    }
    _startIpfsService (event, arg) {
        this.getIpfsService().setLogger(loggerRegistrar.getInstance().registerLogger('ipfs', { maxsize: 1024 * 10 * 3 }));
        this
            .getIpfsService()
            .start()
            .then((data) => {
                this._sendEvent(event)(this.clientEvent.startService, true, data);
            })
            .catch((data) => {
                this._sendEvent(event)(this.clientEvent.startService, false, data);
            });
    }
    _stopIpfsService (event, arg) {
        this
            .getIpfsService()
            .stop();
        this._sendEvent(event)(this.clientEvent.stopService, true, null);
    }
    getIpfsService () {
        return IpfsConnector.getInstance();
    }
}

export default IpfsService;
