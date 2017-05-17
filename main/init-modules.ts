import { checkForGenesis } from './config/genesis';
import GethIPC from './modules/GethIPC';
import IpfsIPC from './modules/IpfsIPC';
import AuthIPC from './modules/AuthIPC';
import Logger from './modules/Logger';
import TxIPC from './modules/TxIPC';
import RegistryIPC from './modules/RegistryIPC';
import ProfileIPC from './modules/ProfileIPC';
import TagsIPC from './modules/TagsIPC';
import EntryIPC from './modules/EntryIPC';
import CommentsIPC from './modules/CommentsIPC';
import LicensesIPC from './modules/LicensesIPC';
import NotificationsIPC from './modules/NotificationsIPC';
import ChatIPC from './modules/ChatIPC';
import SearchIPC from './modules/SearchIPC';
import UtilsIPC from './modules/UtilsIPC';

import WebContents = Electron.WebContents;

export function initModules() {
    const logger = Logger.getInstance();
    const ipcChannels: any[] = [
        new GethIPC(),
        new IpfsIPC(),
        new AuthIPC(),
        new TxIPC(),
        new RegistryIPC(),
        new ProfileIPC(),
        new TagsIPC(),
        new EntryIPC(),
        new CommentsIPC(),
        new LicensesIPC(),
        new NotificationsIPC(),
        new ChatIPC(),
        new SearchIPC(),
        new UtilsIPC()
    ];
    return {
        initListeners: (webContents: WebContents) => {
            logger.registerLogger('akasha', { maxsize: 50 * 1024 });
            ipcChannels.forEach((obj: any) => {
                obj.initListeners(webContents);
            });
            checkForGenesis((errGenesis) => {
                if (errGenesis) {
                    (Logger.getInstance().getLogger('akasha')).error(errGenesis);
                }
            });
        },
        logger,
        flushAll: () => {
            ipcChannels.forEach((obj: any) => {
                obj.purgeAllListeners();
            });
        }
    };
}

