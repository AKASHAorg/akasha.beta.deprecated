import { checkForGenesis } from './config/genesis';
import * as Promise from 'bluebird';
import Logger from './modules/Logger';
import ipcChannels from './modules';
import WebContents = Electron.WebContents;

export function initModules() {
    const logger = Logger.getInstance();
    return {
        initListeners: Promise.coroutine(function* (webContents: WebContents) {
            yield logger.init();
            return new Promise((resolve) => {
                logger.registerLogger('akasha', { maxsize: 50 * 1024 });
                ipcChannels.forEach((obj: any) => {
                    obj.initListeners(webContents);
                });
                checkForGenesis((errGenesis) => {
                    if (errGenesis) {
                        (Logger.getInstance().getLogger('akasha')).error(errGenesis);
                    }
                    resolve();
                });
            });
        }),
        logger,
        flushAll: () => {
            ipcChannels.forEach((obj: any) => {
                obj.purgeAllListeners();
            });
        }
    };
}

