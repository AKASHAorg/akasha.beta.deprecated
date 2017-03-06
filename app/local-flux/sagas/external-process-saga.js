import { delay } from 'redux-saga';
import { apply, call, cancel, fork, put, select, take } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/external-process-actions';
import * as types from '../constants/external-process-constants';

const Channel = window.Channel;

function* gethResetBusyState () {
    yield call(delay, 2000);
    yield put(actions.gethResetBusy());
}

function* ipfsResetBusyState () {
    yield call(delay, 2000);
    yield put(actions.ipfsResetBusy());
}

export function* gethStartLogger () {
    const channel = Channel.server.geth.logs;
    yield call(enableChannel, channel, Channel.client.geth.manager);
    while (true) {
        yield apply(channel, channel.send, [{}]);
        yield call(delay, 2000);
    }
}

export function* gethGetOptions () {
    const channel = Channel.server.geth.options;
    yield call(delay, 200);
    yield call(enableChannel, channel, Channel.client.geth.manager);
    yield apply(channel, channel.send, [{}]);
}

export function* ipfsGetConfig () {
    const channel = Channel.server.ipfs.getConfig;
    yield call(delay, 200);
    yield call(enableChannel, channel, Channel.client.ipfs.manager);
    yield apply(channel, channel.send, [{}]);
}

function* gethStart () {
    const channel = Channel.server.geth.startService;
    const gethOptions = yield select(state => state.settingsState.get('geth').toJS());
    // filter out the null and false options
    const options = {};
    Object.keys(gethOptions).forEach((key) => {
        if (gethOptions[key] !== null && gethOptions[key] !== false) {
            options[key] = gethOptions[key];
        }
    });
    if (options.ipcpath) {
        options.ipcpath = options.ipcpath.replace('\\\\.\\pipe\\', '');
    }
    yield apply(channel, channel.send, [options]);
}

function* gethStop () {
    const channel = Channel.server.geth.stopService;
    yield apply(channel, channel.send, [{}]);
}

function* ipfsStart () {
    const channel = Channel.server.ipfs.startService;
    const storagePath = yield select(state => state.settingsState.getIn(['ipfs', 'storagePath']));
    yield apply(channel, channel.send, [{ storagePath }]);
}

function* ipfsStop () {
    const channel = Channel.server.ipfs.stopService;
    yield apply(channel, channel.send, [{}]);
}

export function* gethGetStatus () {
    const channel = Channel.server.geth.status;
    yield apply(channel, channel.send, [{}]);
}

export function* ipfsGetStatus () {
    const channel = Channel.server.ipfs.status;
    yield apply(channel, channel.send, [{}]);
}

function* gethGetSyncStatus () {
    const channel = Channel.server.geth.syncStatus;
    yield call(enableChannel, channel, Channel.client.geth.manager);
    yield apply(channel, channel.send, [{}]);
}

// WATCHERS

function* watchGethStop () {
    while (true) {
        const resp = yield take(actionChannels.geth.stopService);
        if (resp.error) {
            yield put(actions.gethStopError(resp.error));
        } else {
            yield put(actions.gethStopSuccess(resp.data));
        }
        yield fork(gethResetBusyState);
    }
}

function* watchIpfsStop () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.stopService);
        if (resp.error) {
            yield put(actions.ipfsStopError(resp.error));
        } else {
            yield put(actions.ipfsStopSuccess(resp.data));
        }
        yield fork(ipfsResetBusyState);
    }
}

function filterGethLogs (data, timestamp) {
    // merge errors and infos and sort them by timestamp in ascending order
    const logs = [...data.gethError, ...data.gethInfo]
        .sort((first, second) => {
            const firstTimestamp = new Date(first.timestamp).getTime();
            const secondTimestamp = new Date(second.timestamp).getTime();
            if (firstTimestamp > secondTimestamp) {
                return 1;
            } else if (firstTimestamp < secondTimestamp) {
                return -1;
            }
            return 0;
        });
    // find the index where the newer logs begin
    const index = logs.findIndex(log => new Date(log.timestamp).getTime() >= timestamp);
    return logs.slice(index);
}

function* watchGethLogs () {
    while (true) {
        const resp = yield take(actionChannels.geth.logs);
        const timestamp = yield select(state => state.appState.get('timestamp'));
        const logs = filterGethLogs(resp.data, timestamp);
        yield put(actions.gethGetLogsSuccess(logs));
    }
}

function* watchIpfsConfig () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.getConfig);
        if (resp.error) {
            yield put(actions.ipfsGetConfigError(resp.error));
        } else {
            yield put(actions.ipfsGetConfigSuccess(resp.data));
        }
    }
}

function* watchGethOptions () {
    while (true) {
        const resp = yield take(actionChannels.geth.options);
        if (resp.error) {
            yield put(actions.gethGetOptionsError(resp.error));
        } else {
            yield put(actions.gethGetOptionsSuccess(resp.data));
        }
    }
}

function* watchGethStart () {
    while (true) {
        const resp = yield take(actionChannels.geth.startService);
        if (resp.error) {
            yield put(actions.gethStartError(resp.error));
        } else {
            yield put(actions.gethStartSuccess(resp.data));
        }
        if (resp.data.api) {
            yield fork(gethResetBusyState);
        }
    }
}

function* watchIpfsStart () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.startService);
        if (resp.error) {
            yield put(actions.ipfsStartError(resp.error));
        } else {
            yield put(actions.ipfsStartSuccess(resp.data));
        }
        yield fork(ipfsResetBusyState);
    }
}

function* watchGethStatus () {
    while (true) {
        const resp = yield take(actionChannels.geth.status);
        if (resp.error) {
            yield put(actions.gethGetStatusError(resp.error));
        } else {
            yield put(actions.gethGetStatusSuccess(resp.data));
        }
    }
}

function* watchIpfsStatus () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.status);
        if (resp.error) {
            yield put(actions.ipfsGetStatusError(resp.error));
        } else {
            yield put(actions.ipfsGetStatusSuccess(resp.data));
        }
    }
}

function* watchGethSyncStatus () {
    while (true) {
        const resp = yield take(actionChannels.geth.syncStatus);
        if (resp.error) {
            yield put(actions.gethGetSyncStatusError(resp.error));
        } else {
            yield put(actions.gethGetSyncStatusSuccess(resp.data));
        }
    }
}

function* watchGethStartRequest () {
    while (yield take(types.GETH_START)) {
        yield call(gethStart);
    }
}

function* watchIpfsStartRequest () {
    while (yield take(types.IPFS_START)) {
        yield call(ipfsStart);
    }
}

function* watchGethStatusRequest () {
    while (yield take(types.GETH_STATUS)) {
        yield call(gethGetStatus);
    }
}

function* watchIpfsStatusRequest () {
    while (yield take(types.IPFS_GET_STATUS)) {
        yield call(ipfsGetStatus);
    }
}

function* watchGethGetSyncStatusRequest () {
    while (yield take(types.GETH_GET_SYNC_STATUS)) {
        yield call(gethGetSyncStatus);
    }
}

function* watchGethStopRequest () {
    while (yield take(types.GETH_STOP)) {
        yield call(gethStop);
    }
}

function* watchIpfsStopRequest () {
    while (yield take(types.IPFS_STOP)) {
        yield call(ipfsStop);
    }
}

function* watchGethToggleLogger () {
    while (true) {
        yield take(types.GETH_START_LOGGER);
        const task = yield fork(gethStartLogger);
        yield take(types.GETH_STOP_LOGGER);
        yield cancel(task);
    }
}

export function* watchEProcActions () {
    yield fork(watchGethStartRequest);
    yield fork(watchIpfsStartRequest);
    yield fork(watchGethStatusRequest);
    yield fork(watchIpfsStatusRequest);
    yield fork(watchGethGetSyncStatusRequest);
    yield fork(watchGethStopRequest);
    yield fork(watchIpfsStopRequest);
    yield fork(watchGethToggleLogger);
}

export function* registerEProcListeners () {
    yield fork(watchGethStop);
    yield fork(watchIpfsStop);
    yield fork(watchGethStatus);
    yield fork(watchIpfsStatus);
    yield fork(watchGethStart);
    yield fork(watchIpfsStart);
    yield fork(watchGethOptions);
    yield fork(watchIpfsConfig);
    yield fork(watchGethSyncStatus);
    yield fork(watchGethLogs);
}

