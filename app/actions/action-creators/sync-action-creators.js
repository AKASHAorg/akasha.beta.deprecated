import * as types from '../../constants/SyncConstants';

export function startSync() {
    return {
        type: types.SYNC_ACTIVE
    };
}

export function stopSync() {
    return {
        type: types.SYNC_STOPPED
    };
}

export function pauseSync () {
    return {
        type: types.SYNC_PAUSE
    };
}

export function resumeSync () {
    return {
        type: types.SYNC_RESUME
    }
}
