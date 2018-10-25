// @flow
import { apply, call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/utils-actions';
import * as appActions from '../actions/app-actions';
import * as types from '../constants';


function* backupKeysRequest () {
    // const channel = Channel.server.utils.backupKeys;
    // yield call(enableChannel, channel, Channel.client.utils.manager);
    // yield apply(channel, channel.send, [{}]);
}

function* reloadPage () {
    // const channel = Channel.server.utils.reloadPage;
    // yield call(enableChannel, channel, Channel.client.utils.manager);
    // yield apply(channel, channel.send, [{}]);    
}

// Channel watchers

function* watchBackupChannel () {
    // while (true) {
    //     const resp = yield take(actionChannels.utils.backupKeys);
    //     if (resp.error) {
    //         yield put(actions.backupKeysError(resp.error));
    //     } else {
    //         yield put(appActions.showNotification({
    //             id: 'backupSuccess',
    //             duration: 4,
    //             values: { path: resp.data.target }
    //         }));
    //         yield put(actions.backupKeysSuccess(resp.data));
    //     }
    // }
}

export function* watchUtilsActions () {
    yield takeEvery(types.BACKUP_KEYS_REQUEST, backupKeysRequest);
    yield takeEvery(types.RELOAD_PAGE, reloadPage);    
}
