import { delay } from 'redux-saga';
import { apply, call, cancel, fork, put, select, take } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/external-process-actions';
import * as types from '../constants/external-process-constants';

const Channel = window.Channel;

function* resetGethBusyState () {
    yield call(delay, 2000);
    yield put(actions.resetGethBusy());
}

function* resetIpfsBusyState () {
    yield call(delay, 2000);
    yield put(actions.resetIpfsBusy());
}

export function* startGethLogger () {
    const channel = Channel.server.geth.logs;
    yield call(enableChannel, channel, Channel.client.geth.manager);
    while (true) {
        yield apply(channel, channel.send, [{}]);
        yield call(delay, 2000);
    }
}

export function* getGethOptions () {
    const channel = Channel.server.geth.options;
    yield call(delay, 200);
    yield call(enableChannel, channel, Channel.client.geth.manager);
    yield apply(channel, channel.send, [{}]);
}

export function* getIpfsConfig () {
    const channel = Channel.server.ipfs.getConfig;
    yield call(delay, 200);
    yield call(enableChannel, channel, Channel.client.ipfs.manager);
    yield apply(channel, channel.send, [{}]);
}

export function* toggleGethLogger () {
    while (true) {
        yield take(types.START_GETH_LOGGER);
        const task = yield fork(startGethLogger);
        yield take(types.STOP_GETH_LOGGER);
        yield cancel(task);
    }
}

// WATCHERS

function* watchGethStop () {
    while (true) {
        const resp = yield take(actionChannels.geth.stopService);
        if (resp.error) {
            yield put(actions.stopGethError(resp.error));
        } else {
            yield put(actions.stopGethSuccess(resp.data));
        }
        yield fork(resetGethBusyState);
    }
}

function* watchIpfsStop () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.stopService);
        if (resp.error) {
            yield put(actions.stopIPFSError(resp.error));
        } else {
            yield put(actions.stopIPFSSuccess(resp.data));
        }
        yield fork(resetIpfsBusyState);
    }
}

function filterGethLogs (data, timestamp) {
    const logs = [...data.gethError, ...data.gethInfo]
        .filter(log => new Date(log.timestamp).getTime() > timestamp);
    return logs;
}

function* watchGethLogs () {
    while (true) {
        const resp = yield take(actionChannels.geth.logs);
        const timestamp = yield select(state => state.appState.get('timestamp'));
        const logs = filterGethLogs(resp.data, timestamp);
        yield put(actions.getGethLogsSuccess(logs));
    }
}

function* watchIpfsConfig () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.getConfig);
        if (resp.error) {
            yield put(actions.getIpfsConfigError(resp.error));
        } else {
            yield put(actions.getIpfsConfigSuccess(resp.data));
        }
    }
}

function* watchGethOptions () {
    while (true) {
        const resp = yield take(actionChannels.geth.options);
        if (resp.error) {
            yield put(actions.getGethOptionsError(resp.error));
        } else {
            yield put(actions.getGethOptionsSuccess(resp.data));
        }
    }
}

export function* registerEProcListeners () {
    yield fork(watchGethStop);
    yield fork(watchIpfsStop);
    yield fork(watchGethOptions);
    yield fork(watchIpfsConfig);
    yield fork(watchGethLogs);
}

