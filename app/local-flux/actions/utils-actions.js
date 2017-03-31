import { utilsActionCreators } from './action-creators';
import { UtilsService } from '../services';
import { AppActions } from './';
import * as types from '../constants';
import { action } from './helpers';

let utilsActions = null;

class UtilsActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (utilsActions) {
            return utilsActions;
        }
        this.dispatch = dispatch;
        this.appActions = new AppActions(dispatch);
        this.utilsService = new UtilsService();
        utilsActions = this;
    }

    backupKeys = () => {
        this.dispatch(utilsActionCreators.backupKeys({ backupPending: true }));
        this.utilsService.backupKeys({
            onSuccess: (data) => {
                this.appActions.showNotification({
                    id: 'backupSuccess',
                    values: { path: data.target },
                });
                this.dispatch(utilsActionCreators.backupKeysSuccess(data, {
                    backupPending: false
                }));
            },
            onError: (error) => {
                this.appActions.showNotification({
                    id: 'backupError',
                    values: { },
                });
                this.dispatch(utilsActionCreators.backupKeysError(error, {
                    backupPending: false
                }));
            }
        });
    };
}
export { UtilsActions };

export const backupKeysError = (error) => {
    error.code = 'BKE01';
    error.messageId = 'backupKeys';
    return action(types.BACKUP_KEYS_ERROR, { error });
};
export const backupKeysRequest = () => action(types.BACKUP_KEYS_REQUEST);
export const backupKeysSuccess = () => action(types.BACKUP_KEYS_SUCCESS);
