import { apply, call, fork, put, take } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/utils-actions';
import * as appActions from '../actions/app-actions';
import * as types from '../constants';

const Channel = global.Channel;

function* backupKeysRequest () {
    const channel = Channel.server.utils.backupKeys;
    yield call(enableChannel, channel, Channel.client.utils.manager);
    yield apply(channel, channel.send, [{}]);
}

// Action watchers

function* watchBackupKeysRequest () {
    while (yield take(types.BACKUP_KEYS_REQUEST)) {
        yield fork(backupKeysRequest);
    }
}

// Channel watchers

function* watchBackupChannel () {
    while (true) {
        const resp = yield take(actionChannels.utils.backupKeys);
        if (resp.error) {
            yield put(actions.backupKeysError(resp.error));
        } else {
            yield put(appActions.showNotification({
                id: 'backupSuccess',
                duration: 4,
                values: { path: resp.data.target }
            }));
            yield put(actions.backupKeysSuccess(resp.data));
        }
    }
}

export function* watchUtilsActions () {
    yield fork(watchBackupKeysRequest);
}

export function* registerUtilsListeners () {
    yield fork(watchBackupChannel);
}

export function* registerWatchers () {
    yield fork(registerUtilsListeners);
    yield fork(watchUtilsActions);
}
