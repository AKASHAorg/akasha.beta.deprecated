/* eslint strict: 0, no-console: 0 */
'use strict';
const { ipcMain } = require('electron');
const { IpfsConnector } = require('../services/ipfs-connector/index.js');
const loggerRegistrar = require('../../loggers');
const IpcService = require('./ipcService');

/**
 * IpfsService class
 * It provides the Renderer with access to Ipfs instance.
 * It also registers events for the Renderer, in order for the Renderer
 * to be notified of what happens on ipfs.
 *
 */
class IpfsService extends IpcService {
    /*
     * @returns {IpfsService}
     */
    constructor () {
        super('ipfs');
    }
    /*
     * It sets up the listeners for this module.
     * Events used are:
     * server:ipfs:startService used by the View layer to start the ipfs executable
     *
     * @param {BrowserWindow} mainWindow -- ignored for now
     * @returns undefined
     */
    setupListeners () {
        ipcMain.on(this.serverEvent.startService, (event, arg) => {
            this._startIpfsService(event, arg);
        });
        ipcMain.on(this.serverEvent.stopService, (event, arg) => {
            this._stopIpfsService(event, arg);
        });
    }
    _startIpfsService (event, arg) {
        this
            .getIpfsService()
            .setLogger(loggerRegistrar.getInstance()
            .registerLogger('ipfs', { maxsize: 1024 * 10 * 3 }));
        if (arg && typeof arg === 'object') {
            if (arg.repoDir && arg.repoDir.length > 0) {
                this.getIpfsService().setIpfsFolder(arg.repoDir);
            }
        }
        this
            .getIpfsService()
            .start()
            .then((data) => {
                this._sendEvent(event)(this.clientEvent.startService, true, Object.assign({
                    ipfsMessage: data
                }, arg));
            })
            .catch((data) => {
                this._sendEvent(event)(this.clientEvent.startService, false, data);
            });
    }
    _stopIpfsService (event, arg) {
        this
            .getIpfsService()
            .stop();
        this._sendEvent(event)(this.clientEvent.stopService, true, arg);
    }
    getIpfsService () {
        return IpfsConnector.getInstance();
    }
}

export default IpfsService;
