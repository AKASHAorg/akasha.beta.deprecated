import { checkForGenesis } from './config/genesis';
import GethIPC from './GethIPC';
import IpfsIPC from './IpfsIPC';
import AuthIPC from './AuthIPC';
import Logger from './Logger';
import TxIPC from './TxIPC';
import RegistryIPC from './RegistryIPC';
import ProfileIPC from './ProfileIPC';
import TagsIPC from './TagsIPC';
import EntryIPC from './EntryIPC';
import CommentsIPC from './CommentsIPC';
import LicensesIPC from './LicensesIPC';
import NotificationsIPC from './NotificationsIPC';
import ChatIPC from './ChatIPC';
import SearchIPC from './SearchIPC';
import UtilsIPC from './UtilsIPC';

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

