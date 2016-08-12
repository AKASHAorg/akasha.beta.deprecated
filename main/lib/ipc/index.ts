import GethIPC from './GethIPC';
import Logger from './Logger';
import WebContents = Electron.WebContents;

export function initModules() {
    const logger = Logger.getInstance();
    const gethChannel = new GethIPC();
    return {
        initListeners: (webContents: WebContents) => {
            gethChannel.initListeners(webContents);
        },
        logger,
        flushAll: () => {
            gethChannel.purgeAllListeners();
        }
    };
}

