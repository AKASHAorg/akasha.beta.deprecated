/* eslint strict: 0, no-console: 0 */
'use strict';
const { EVENTS } = require('../settings');

/**
 * IpcService class
 * It provides a base for the other IPC classes.
 *
 */
class IpcService {
    /**
    * Reference to all ipc services
    */
    static services = {};
    /*
     * Constructor for this class.
     * @param {String} type. Ex: geth, ipfs
     * @returns {IpcService}
     */
    constructor (type) {
        this.serverEvent = EVENTS.server[type];
        this.clientEvent = EVENTS.client[type];
        IpcService.services[type] = this;
    }

    /*
     * A helper method for sending events back to the Renderer.
     *
     * @param {EventEmitter} event
     * @returns {Function} the event handler
     */
    _sendEvent (event) {
        return (name, successCode, data, extra) => {
            let result = {
                success: successCode,
                status: data
            };
            if (extra && typeof extra === 'object') {
                result = Object.assign(result, extra);
            }
            event.sender.send(name, result);
        };
    }

    /**
    * Placeholder for subclasses
    * Here, each IPCService will add cleanup stuff
    */
    shutDown () {

    }

    /**
    *
    */
    static getService (type) {
        return IpcService.services[type];
    }
}

export default IpcService;
