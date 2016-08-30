import { AppActions } from '../';

let tagBundleActions = null;

class TagBundleActions {
    constructor (dispatch) {
        if (!tagBundleActions) {
            tagBundleActions = this;
        }
        this.appActions = new AppActions(this.dispatch);
        this.dispatch = dispatch;
        return tagBundleActions;
    }
}

export { TagBundleActions };
