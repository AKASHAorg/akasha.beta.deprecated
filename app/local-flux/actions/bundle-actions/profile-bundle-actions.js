import { AppActions } from '../';

let profileBundleActions = null;

class ProfileBundleActions {
    constructor (dispatch) {
        if (!profileBundleActions) {
            profileBundleActions = this;
        }
        this.dispatch = dispatch;
        this.appActions = new AppActions(this.dispatch);
        return profileBundleActions;
    }
    resumeEntryPublishing = () => {
        console.log('success');
    }
}

export { ProfileBundleActions };
