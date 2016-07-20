import { GethConnector } from '@akashaproject/geth-connector';
import { AbstractEmitter } from './event/AbstractEmitter';
import { GethStart, GethRestart, GethStop } from '../dataTypes';
import channels from '../channels';
import IpcMainEvent = Electron.IpcMainEvent;

class GethIPC extends AbstractEmitter {
    initListeners() {
        // register listeners
        this._start()
            ._restart()
            ._stop();
    }
    // @Todo:
    attachEmitters() {

    }

    private _start() {
        this.registerListener(
            channels.server.geth.startService,
            (event: IpcMainEvent, data: GethStart) => {
                GethConnector.getInstance().start(data);
            }
        );
        return this;
    }

    private _restart() {
        this.registerListener(
            channels.server.geth.restartService,
            (event: IpcMainEvent, data: GethRestart) => {
                GethConnector.getInstance().restart(data.timer);
            }
        );
        return this;
    }

    private _stop() {
        this.registerListener(
            channels.server.geth.stopService,
            (event: IpcMainEvent, data: GethStop) => {
                GethConnector.getInstance().stop(data.signal);
            }
        );
        return this;
    }
}
export default GethIPC;
