import GethIPC from './GethIPC';
import IpfsIPC from './IpfsIPC';
import Logger from './Logger';
import WebContents = Electron.WebContents;

export function initModules() {
    const logger = Logger.getInstance();
    const gethChannel = new GethIPC();
    const ipfsChannel = new IpfsIPC();
    return {
        initListeners: (webContents: WebContents) => {
            gethChannel.initListeners(webContents);
            ipfsChannel.initListeners(webContents);
        },
        logger,
        flushAll: () => {
            gethChannel.purgeAllListeners();
            ipfsChannel.purgeAllListeners();
        }
    };
}

