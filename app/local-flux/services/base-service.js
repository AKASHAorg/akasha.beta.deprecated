import { ipcRenderer } from 'electron';
import debug from 'debug';
import invariant from 'fbjs/lib/invariant';

const dbg = debug('App::BaseService::*');
/**
 * All services should extend this base services
 * it provides utilities for ipc.
 */
class BaseService {
    constructor () {
        this._listeners = new Map();
        this._openChannels = new Set();
    }
    /**
     * Register a listener on a channel and store a reference to it
     * @param clientChannel <String> the channel we are receiving responses
     * @param listener <Function> the actual listener
     * @param cb <Function> callback
     */
    registerListener = (clientChannel, listener, cb) => {
        this._listeners.set(clientChannel, listener);
        ipcRenderer.on(clientChannel, this._listeners.get(clientChannel));
        return cb();
    };
    /**
     * removes a listener
     */
    removeListener = (channel, cb) => {
        ipcRenderer.removeListener(channel, this.listeners.get(channel));
        this._listeners.delete(channel);
        return cb();
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
        if (this._openChannels.has(serverManager)) {
            dbg('channel already listening', serverManager);
            dbg('trying to register listener for it');
            if (this._listeners.has(clientChannel)) {
                dbg('listener already registered for channel', clientChannel);
                return cb();
            }
            dbg('registering a new listener for ', clientChannel);
            return this.registerListener(clientChannel, listenerCb, cb);
        }
        dbg('open channels', this._openChannels);
        ipcRenderer.once(clientManager, (ev, res) => {
            if (res.error) return invariant(false, res.error.message);
            return this.registerListener(clientChannel, listenerCb, cb);
        });
        return ipcRenderer.send(serverManager, { channel: serverChannel, listen: true });
    };
    /** close communication with a channel through channel manager
     * @param manager <String> manager channel => we are sending req on this
     * @param channel <String> the server channel we need to stop listen
     */
    closeChannel = (manager, channel) => {
        this.removeListener(channel, () => {
            ipcRenderer.send(manager, { listen: false });
        });
    };
}

export default BaseService;
