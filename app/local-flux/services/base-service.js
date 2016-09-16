import { ipcRenderer } from 'electron';
import debug from 'debug';
import invariant from 'fbjs/lib/invariant';

const dbg = debug('App::BaseService::*');

class BaseService {
    constructor () {
        this._listeners = new Map();
        this._openChannels = new Set();
    }
    registerListener = (clientChannel, cb, secondCallback) => {
        this._listeners.set(clientChannel, cb);
        ipcRenderer.on(clientChannel, this._listeners.get(clientChannel));
        secondCallback();
    };
    removeListener = (channel, cb) => {
        ipcRenderer.removeListener(channel, this.listeners.get(channel));
        this._listeners.delete(channel);
        return cb();
    };
    // open communication with a channel through channel manager
    openChannel = ({ serverManager, clientManager, serverChannel, clientChannel, listenerCb }, cb) => {
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
            if (res.error) return invariant(res.error, res.error.message);
            this.registerListener(clientChannel, listenerCb, cb);
        });
        ipcRenderer.send(serverManager, { channel: serverChannel, listen: true });
    };
    // close communication with a channel through channel manager
    closeChannel = (manager, channel) => {
        this.removeListener(channel, () => {
            ipcRenderer.send(manager, { listen: false });
        });
    };
}

export default BaseService;
