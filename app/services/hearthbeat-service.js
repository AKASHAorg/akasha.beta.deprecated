const { ipcRenderer } = require('electron');
import { EVENTS } from '../../electron-api/modules/settings';

class HearthbeatService {
    constructor () {
        this.listeners = [];
    }
    startHearthBeat = () => {}
    getHearthBeat = () => {}
    removeHearthBeat = () => {}
}
export { HearthbeatService };
