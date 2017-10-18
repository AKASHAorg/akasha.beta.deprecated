import GethIPC from './GethIPC';
import IpfsIPC from './IpfsIPC';
import AuthIPC from './AuthIPC';
import TxIPC from './TxIPC';
import RegistryIPC from './RegistryIPC';
import ProfileIPC from './ProfileIPC';
import TagsIPC from './TagsIPC';
import EntryIPC from './EntryIPC';
import CommentsIPC from './CommentsIPC';
import LicensesIPC from './LicensesIPC';
// import NotificationsIPC from './NotificationsIPC';
// import ChatIPC from './ChatIPC';
import SearchIPC from './SearchIPC';
import UtilsIPC from './UtilsIPC';

export default [
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
    // new NotificationsIPC(),
    // new ChatIPC(),
    new SearchIPC(),
    new UtilsIPC()
];
