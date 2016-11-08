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
import WebContents = Electron.WebContents;

export function initModules() {
    const logger = Logger.getInstance();
    const ipcChannels: any[] = [
        new GethIPC(),
        new IpfsIPC(),
        new AuthIPC(),
        new TxIPC(),
        new RegistryIPC(),
        //new ProfileIPC(),
        //new TagsIPC(),
        //new EntryIPC(),
        //new CommentsIPC(),
        new LicensesIPC()
    ];
    return {
        initListeners: (webContents: WebContents) => {
            logger.registerLogger('akasha', { maxsize: 50 * 1024 });
            ipcChannels.forEach((obj: any) => {
                obj.initListeners(webContents);
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

