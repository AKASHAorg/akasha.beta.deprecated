import { ipcRenderer } from 'electron';
import { EVENTS } from '../../../electron-api/modules/settings';
import { Map } from 'immutable';

class BaseService {
    constructor () {
        this._listeners = new Map();
        this.eventChannels = EVENTS;
    }
    registerListener = (channel, cb) => {
        this._listeners.set(channel, cb);
        ipcRenderer.on(channel, this._listeners.get(channel));
    };
    removeListener = (channel, cb) => {
        ipcRenderer.removeListener(channel, this.listeners.get(channel));
        this.listeners.delete(channel);
        return cb();
    };
    createChannel = (managerChannel, channel, cb) => {
        ipcRenderer.on(managerChannel, (ev, data) => {
            if(data.error) {
                const error = new Error(data.error);
                return cb(error);
            }
            this.registerListener(channel, cb);
        });
        ipcRenderer.send(managerChannel, { listen: true });
    };
    removeChannel = (managerChannel, channel) => {
        this.removeListener(channel, () => {
           ipcRenderer.send(managerChannel, { listen: false });
        });
    };
    parseData = (data, cb) => {
        if(data.error) {
            return cb(new Error(data.error));
        }
        return cb(null, data);
    }
}
