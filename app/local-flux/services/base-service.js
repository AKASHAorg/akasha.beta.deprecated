import { ipcRenderer } from 'electron';
import debug from 'debug';

const dbg = debug('App::BaseService::*');
/**
 * All services should extend this base services
 * it provides utilities for ipc.
 */
class BaseService {
    constructor () {
        // client channel listeners
        this._listeners = new Map();

        // manager channel listeners
        this._openChannels = new Set();
    }
    // create a universal listener passed to ipcRenderer.on() method;
    createListener = (onError, onSuccess) =>
        (ev, res) => {
            dbg('response: ', res);
            if (res.error) {
                return onError(res.error);
            }
            return onSuccess(res.data);
        };
    /**
     * Register a listener on a channel and store a reference to it
     * @param clientChannel <String> the channel we are receiving responses
     * @param listener <Function> the actual listener
     * @param cb <Function> callback
     */
    registerListener = (clientChannel, listener, cb) => {
        this._listeners.set(clientChannel, listener);
        if (ipcRenderer.listenerCount(clientChannel) > 0) {
            if (typeof cb === 'function') return cb();
            return null;
        }
        ipcRenderer.on(clientChannel, (ev, res) => this._listeners.get(clientChannel)(ev, res));
        if (typeof cb === 'function') return cb();
        return null;
    };
    /**
     * removes a listener
     */
    removeListener = (channel, cb) => {
        ipcRenderer.removeListener(channel, this._listeners.get(channel));
        this._listeners.delete(channel);
        if (typeof cb === 'function') {
            return cb();
        }
        return null;
    };
    /** open communication with a channel through channel manager
     * @param serverManager <String> Server manager channel -> sending on this
     * @param clientManager <String> Client manager channel -> listening on this
     * @param serverChannel <String> The channel we need to open
     * @param clientChannel <String> The channel we receive response data
     * @param listenerCb <Function> The actual listener
     * @param cb <Function> callback
     * @TODO make this a promise
     */
    openChannel = ({
        serverManager,
        clientManager,
        serverChannel,
        clientChannel,
        listenerCb
    }, cb) => {
        if (this._openChannels.has(serverChannel)) {
            dbg(serverChannel, 'already opened. Nothing to do!');
            return cb();
        }
        ipcRenderer.once(clientManager, (ev, res) => {
            if (res.error) {
                dbg(`${res.error.message}, please check base-service -> openChannel method`);
            }
            dbg(serverChannel, 'is now open to communication');
            return this.registerListener(clientChannel, listenerCb, cb);
        });
        return ipcRenderer.send(serverManager, { channel: serverChannel, listen: true });
    };
    /** close communication with a channel through channel manager
     * @param manager <String> manager channel => we are sending req on this
     * @param channel <String> the server channel we need to stop listen
     */
    closeChannel = (serverManager, serverChannel, clientChannel) => {
        ipcRenderer.send(serverManager, { channel: serverChannel, listen: false });
        this.removeListener(clientChannel);
    };
}

export default BaseService;
