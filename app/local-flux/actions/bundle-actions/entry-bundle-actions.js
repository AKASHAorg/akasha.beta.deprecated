import debug from 'debug';
import { EntryActions, ProfileActions, TagActions, AppActions } from '../';

const dbg = debug('App:EntryBundleActions');
let entryBundleActions = null;

class EntryBundleActions {
    constructor (dispatch) {
        if (!entryBundleActions) {
            entryBundleActions = this;
        }
        this.dispatch = dispatch;
        this.profileActions = new ProfileActions(dispatch);
        this.entryActions = new EntryActions(dispatch);
        this.tagActions = new TagActions(dispatch);
        this.appActions = new AppActions(dispatch);
        return entryBundleActions;
    }
    publishEntry = (entry, profileAddress) => {
      console.log('publish entry', entry, profileAddress);
    };
    publishTags = (tagsToPublish) => {
        dbg('publishTags', tagsToPublish);
        // this.tagActions.registerTags(tagsToRegister).then(() => {
        //     // continue to entry publishing procedure;
        // });
    };
    requestAuthentication = (nextAction) => {
        this.appActions.showAuthDialog();
        this.profileActions.requestAuthentication(nextAction);
    };
    _checkAccountUnlocked = (loggedProfile) => {
        const unlockStatus = loggedProfile.get('unlockStatus');
        if (unlockStatus) {
            const lastUnlock = new Date(unlockStatus.get('lastUnlock'));
            const now = Date.now();
            const unlockInterval = unlockStatus.get('unlockInterval');
            return (lastUnlock - now > unlockInterval);
        }
        return false;
    };
}

export { EntryBundleActions };
