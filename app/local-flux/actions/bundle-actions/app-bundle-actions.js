import { EntryActions } from '../';

let appBundleActions = null;
class AppBundleActions {
    constructor (dispatch) {
        if (!appBundleActions) {
            appBundleActions = this;
        }
        this.dispatch = dispatch;
        this.entryActions = new EntryActions(dispatch);
        return appBundleActions;
    }
    resumeEntryPublishing = () => {
        console.log('success');
    }
}

export { AppBundleActions };
