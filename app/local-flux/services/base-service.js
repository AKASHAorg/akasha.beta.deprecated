import { ipcRenderer } from 'electron';
import debug from 'debug';
import invariant from 'fbjs/lib/invariant';

const dbg = debug('App::BaseService::*');

class BaseService {
    constructor () {
        this._listeners = new Map();
        this._openChannels = new Set();
    }
    registerListener = (channel, cb, secondCallback) => {
        this._listeners.set(channel, cb);
        ipcRenderer.on(channel, this._listeners.get(channel));
        secondCallback();
    };
    removeListener = (channel, cb) => {
        ipcRenderer.removeListener(channel, this.listeners.get(channel));
        this._listeners.delete(channel);
        return cb();
    };
    // open communication with a channel through channel manager
    openChannel = ({ serverManager, clientManager, serverChannel, clientChannel, listenerCb }, cb) => {
        if (this._openChannels.has(serverChannel)) {
            dbg('channel already listening', serverChannel);
            dbg('trying to register listener for it');
            if (this._listeners.has(clientChannel)) {
                dbg('listener already registered for channel', clientChannel);
                return cb();
            }
            dbg('registering a new listener for ', clientChannel);
            return this.registerListener(clientChannel, listenerCb, cb);
        }
        dbg('open channels', this._openChannels);
        this.registerListener(clientManager, (ev, res) => {
            dbg('main process now listening on', res.data.channel);
            if (res.error) return invariant(res.error, res.error.message);
            this._openChannels.add(res.data.channel);
            this.registerListener(clientManager, listenerCb, cb);
        }, () =>
            ipcRenderer.send(serverManager, { channel: serverChannel, listen: true })
        );
    };
    // close communication with a channel through channel manager
    closeChannel = (manager, channel) => {
        this.removeListener(channel, () => {
            ipcRenderer.send(manager, { listen: false });
        });
    };
}

export default BaseService;
