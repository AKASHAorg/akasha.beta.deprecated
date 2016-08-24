let appBundleActions = null;
import { EntryActions } from '../'

class AppBundleActions {
    constructor (dispatch) {
        if (!appBundleActions) {
            appBundleActions = this;
        }
        this.dispatch = dispatch;
        this.appService = new AppService();
        this.entryActions = new EntryActions(dispatch);
        return appBundleActions;
    }
    resumeEntryPublishing = () => {
        console.log('success');
    }
}

export { AppBundleActions };
