import IpfsEmitter from './event/IpfsEmitter';
import WebContents = Electron.WebContents;
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import AppLogger from './Logger';

class IpfsIPC extends IpfsEmitter {
    public logger = 'ipfs';
    private DEFAULT_MANAGED: string[] = ['startService', 'stopService'];

    constructor() {
        super();
        this.attachEmitters();
    }

    initListeners(webContents: WebContents) {
        IpfsConnector.getInstance().setLogger(
          AppLogger.getInstance().registerLogger(this.logger)
        );
        this.webContents = webContents;
    }

}

export default IpfsIPC;
