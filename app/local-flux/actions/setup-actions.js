import { setupActionCreators } from './action-creators';
import { SetupService } from '../services';

let setupActions = null;

class SetupActions {
    constructor (dispatch) {
        if (!setupActions) {
            setupActions = this;
        }
        this.setupService = new SetupService();
        this.dispatch = dispatch;
        return setupActions;
    }
    retrySetup = (isAdvanced) => {
        this.dispatch(setupActionCreators.retrySetup(isAdvanced));
    };
    toggleAdvancedSettings = (isAdvanced) => {
        this.dispatch(setupActionCreators.toggleAdvancedSettings(isAdvanced));
    };
    setupGethDataDir = (path) => {
        this.dispatch(setupActionCreators.setupGethDataDir(path));
    };
    setupGethIPCPath = (path) => {
        this.dispatch(setupActionCreators.setupGethIPCPath(path));
    };
    setupGethCacheSize = (size) => {
        this.dispatch(setupActionCreators.setupGethCacheSize(size));
    };
    setupIPFSPath = (path) => {
        this.dispatch(setupActionCreators.setupIPFSPath(path));
    };
    setupIPFSApiPort = (port) => {
        this.dispatch(setupActionCreators.setupIPFSApiPort(port));
    };
    setupIPFSGatewayPort = (port) => {
        this.dispatch(setupActionCreators.setupIPFSGatewayPort(port));
    }
}
export { SetupActions };
