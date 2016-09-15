import { ipcRenderer } from 'electron';

class BaseService {
    constructor () {
        this._listeners = new Map();
    }
    registerListener = (channel, cb, secondCallback) => {
        this._listeners.set(channel, cb);
        ipcRenderer.on(channel, this._listeners.get(channel));
        secondCallback();
    };
    removeListener = (channel, cb) => {
        ipcRenderer.removeListener(channel, this.listeners.get(channel));
        this.listeners.delete(channel);
        return cb();
    };
    // open communication with a channel through channel manager
    openChannel = ({ manager, serverChannel, clientChannel, listenerCb }, cb) => {
        ipcRenderer.on(manager, (ev, data) => {
            this.registerListener(channel, listenerCb);
            return cb();
        });
        ipcRenderer.send(manager, { channel: serverChannel, listen: true });
    };
    // close communication with a channel through channel manager
    closeChannel = (manager, channel) => {
        this.removeListener(channel, () => {
            ipcRenderer.send(manager, { listen: false });
        });
    };
}

export default BaseService;
