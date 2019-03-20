import * as types from '../constants';
import { action } from './helpers';

export const backupKeysError = error => {
    error.code = 'BKE01';
    error.messageId = 'backupKeys';
    return action(types.BACKUP_KEYS_ERROR, { error });
};
export const backupKeysRequest = () => action(types.BACKUP_KEYS_REQUEST);
export const backupKeysSuccess = () => action(types.BACKUP_KEYS_SUCCESS);

export const reloadPage = () => action(types.RELOAD_PAGE);
