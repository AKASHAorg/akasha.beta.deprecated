import { syncActionCreators } from './action-creators';
import { SetupService } from '../services';
import { SettingsActions, EProcActions } from './';
let syncActions = null;

class SyncActions {
    constructor (dispatch) {
        if (!syncActions) {
            syncActions = this;
        }
        this.setupService = new SetupService();
        this.dispatch = dispatch;
        return syncActions;
    }
    
}
export { SyncActions };
