import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import { mainResponse } from './event/responses';
import WebContents = Electron.WebContents;

class EntryIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'entry';
        this.DEFAULT_MANAGED = ['getVoteEndDate', 'getScore'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this
            ._manager();
    }

    private _publish() {
        this.registerListener(
            channels.server[this.MODULE_NAME].create,
            (event: any, data: TagCreateRequest) => {

            });
        return this;
    }

}

export default EntryIPC;
