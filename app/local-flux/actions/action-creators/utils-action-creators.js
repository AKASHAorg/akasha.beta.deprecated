import * as types from '../../constants/UtilsConstants';

export function backupKeys (flags) {
    return {
        type: types.BACKUP_KEYS,
        flags
    };
}

export function backupKeysSuccess (data, flags) {
    return {
        type: types.BACKUP_KEYS_SUCCESS,
        data,
        flags
    };
}

export function backupKeysError (error, flags) {
    return {
        type: types.BACKUP_KEYS_ERROR,
        error,
        flags
    };
}
