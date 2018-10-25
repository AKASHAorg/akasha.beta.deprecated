import * as reduxSaga from 'redux-saga';
import { apply, call, cancel, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/external-process-actions';
import * as appActions from '../actions/app-actions';
import * as profileActions from '../actions/profile-actions';
import * as searchActions from '../actions/search-actions';
import * as types from '../constants';
import { selectGethStatus, selectGethSyncActionId, selectLastGethLog,
    selectLastIpfsLog, selectLoggedEthAddress } from '../selectors';
import ChReqService from '../services/channel-request-service';
import { GETH_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

const Channel = global.Channel;

let gethSyncInterval = null;

function* gethResetBusyState () {
    yield apply(reduxSaga, reduxSaga.delay, [2000]);
    yield put(actions.gethResetBusy());
}

function* ipfsResetBusyState () {
    yield apply(reduxSaga, reduxSaga.delay, [2000]);
    yield put(actions.ipfsResetBusy());
}

function* gethStartLogger () {
    const channel = Channel.server.geth.logs;
    yield call(enableChannel, channel, Channel.client.geth.manager);
    while (true) {
        yield put(actions.gethGetLogs());
        yield apply(channel, channel.send, [{}]);
        yield apply(reduxSaga, reduxSaga.delay, [2000]);
    }
}

function* ipfsStartLogger () {
    const channel = Channel.server.ipfs.logs;
    yield call(enableChannel, channel, Channel.client.ipfs.manager);
    while (true) {
        yield put(actions.ipfsGetLogs());
        yield apply(channel, channel.send, [{}]);
        yield apply(reduxSaga, reduxSaga.delay, [2000]);
    }
}

export function* gethGetOptions () {
    // const channel = Channel.server.geth.options;
    // yield call(enableChannel, channel, Channel.client.geth.manager);
    // yield apply(channel, channel.send, [{}]);
    yield call([ChReqService, ChReqService.sendRequest], GETH_MODULE, GETH_MODULE.options, {});
}

export function* ipfsGetConfig () {
    // const channel = Channel.server.ipfs.getConfig;
    // yield call(enableChannel, channel, Channel.client.ipfs.manager);
    // yield apply(channel, channel.send, [{}]);
    yield call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.getConfig, {});
}

export function* ipfsGetPorts () {
    // const channel = Channel.server.ipfs.getPorts;
    // yield call(enableChannel, channel, Channel.client.ipfs.manager);
    // yield apply(channel, channel.send, [{}]);
    yield call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.getPorts, {});
}

function* ipfsSetPorts ({ ports, restart }) {
    // const channel = Channel.server.ipfs.setPorts;
    // yield call(enableChannel, channel, Channel.client.ipfs.manager);
    // yield apply(channel, channel.send, [{ ports, restart }]);
    yield call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.setPorts, { ports, restart });
}

function* gethStart () {
    // const channel = Channel.server.geth.startService;
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
    // yield apply(channel, channel.send, [options]);
    yield call([ChReqService, ChReqService.sendRequest], GETH_MODULE, GETH_MODULE.startService, options);
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
    yield call([ChReqService, ChReqService.sendRequest], GETH_MODULE, GETH_MODULE.status, {})
}

export function* ipfsGetStatus () {
    yield call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.status, {})
}

function* gethGetSyncStatus () {
    const channel = Channel.server.geth.syncStatus;
    const syncActionId = yield select(selectGethSyncActionId);
    if (!gethSyncInterval) {
        gethSyncInterval = setInterval(() => {
            if (syncActionId === 0 || syncActionId === 1) {
                channel.send({});
            }
        }, 2000);
    }
}

// WATCHERS

function* watchGethStopChannel () {
    while (true) {
        const resp = yield take(actionChannels.geth.stopService);
        if (resp.error) {
            yield put(actions.gethStopError(resp.error));
        } else {
            if (gethSyncInterval) {
                clearInterval(gethSyncInterval);
                gethSyncInterval = null;
            }
            yield put(actions.gethStopSuccess(resp.data, resp.services));
        }
        if (resp.error || resp.services.geth.process === false) {
            yield fork(gethResetBusyState);
        }
    }
}

function* watchIpfsStopChannel () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.stopService);
        if (resp.error) {
            yield put(actions.ipfsStopError(resp.error));
        } else {
            yield put(actions.ipfsStopSuccess(resp.data, resp.services));
            // yield put(actions.ipfsResetPorts());
        }
        yield fork(ipfsResetBusyState);
    }
}

function filterLogs (logs) {
    const sortedLogs = logs
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
    return sortedLogs;
}

function* watchGethLogsChannel () {
    while (true) {
        const resp = yield take(actionChannels.geth.logs);
        const timestamp = yield select(selectLastGethLog);
        const logs = filterLogs([...resp.data.gethError, ...resp.data.gethInfo], timestamp);
        yield put(actions.gethGetLogsSuccess(logs));
    }
}

function* watchIpfsLogsChannel () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.logs);
        const timestamp = yield select(selectLastIpfsLog);
        const logs = filterLogs([...resp.data.ipfsError, ...resp.data.ipfsInfo], timestamp);
        yield put(actions.ipfsGetLogsSuccess(logs));
    }
}

function* watchIpfsConfigChannel (data) {
    console.log('start an action based on response on another action', data);
    // while (true) {
    //     const resp = yield take(actionChannels.ipfs.getConfig);
    //     if (resp.error) {
    //         yield put(actions.ipfsGetConfigError(resp.error));
    //     } else {
    //         yield put(actions.ipfsGetConfigSuccess(resp.data));
    //     }
    // }
}

function* watchIpfsGetPortsChannel () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.getPorts);
        if (resp.error) {
            yield put(actions.ipfsGetPortsError(resp.error));
        } else {
            yield put(actions.ipfsGetPortsSuccess(resp.data, resp.services));
        }
    }
}

function* watchIpfsSetPortsChannel () {
    while (true) {
        const resp = yield take(actionChannels.ipfs.setPorts);
        if (resp.error) {
            yield put(actions.ipfsSetPortsError(resp.error));
        } else {
            yield put(actions.ipfsSetPortsSuccess(resp.data));
            yield put(actions.ipfsGetPorts());
            yield put(appActions.showNotification({
                id: 'setIpfsPortsSuccess',
                duration: 4,
            }));
        }
    }
}

// function* watchGethOptionsChannel () {
//     while (true) {
//         const resp = yield take(actionChannels.geth.options);
//         if (resp.error) {
//             yield put(actions.gethGetOptionsError(resp.error));
//         } else {
//             yield put(actions.gethGetOptionsSuccess(resp.data));
//         }
//     }
// }

// function* watchGethStartChannel () {
//     while (true) {
//         const resp = yield take(actionChannels.geth.startService);
//         if (resp.error) {
//             yield put(actions.gethStartError(resp.data, resp.error));
//         } else {
//             const gethStatus = yield select(selectGethStatus);
//             const syncActionId = yield select(selectGethSyncActionId);
//             const gethIsSyncing = gethStatus.get('process') && !gethStatus.get('upgrading') &&
//                 (syncActionId === 1 || syncActionId === 0);
//             if (gethIsSyncing && !gethSyncInterval) {
//                 yield call(gethGetSyncStatus);
//             }
//             yield put(actions.gethStartSuccess(resp.data, resp.services));
//         }
//         if (resp.error || resp.services.geth.process || resp.data.started) {
//             yield fork(gethResetBusyState);
//         }
//     }
// }

// function* watchIpfsStartChannel () {
//     while (true) {
//         const resp = yield take(actionChannels.ipfs.startService);
//         if (resp.error) {
//             yield put(actions.ipfsStartError(resp.data, resp.error));
//         } else {
//             yield put(actions.ipfsStartSuccess(resp.data, resp.services));
//             // if ((resp.data.started || resp.services.ipfs.process) && !resp.data.upgrading) {
//             //     yield call(ipfsGetPorts);
//             // }
//         }
//         yield fork(ipfsResetBusyState);
//     }
// }

function* watchGethGetStatusChannel () {
    while (true) {
        const resp = yield take(actionChannels.geth.status);
        if (resp.error) {
            yield put(actions.gethGetStatusError(resp.error));
        } else {
            yield put(actions.gethGetStatusSuccess(resp.data, resp.services));
            const ethAddress = yield select(selectLoggedEthAddress);
            const notificationsLoaded = yield select(state => state.notificationsState.notificationsLoaded);
            if (ethAddress && notificationsLoaded) {
                yield put(profileActions.profileSaveLastBlockNr());
            }
        }
    }
}

function* watchIpfsStatusChannel () {
    // let isFirstResponse = true;
    while (true) {
        const resp = yield take(actionChannels.ipfs.status);
        if (resp.error) {
            yield put(actions.ipfsGetStatusError(resp.error));
        } else {
            yield put(actions.ipfsGetStatusSuccess(resp.data, resp.services));
            // if (isFirstResponse && (resp.data.started || resp.services.ipfs.process)) {
            //     yield call(ipfsGetPorts);
            // }
        }
        // isFirstResponse = false;
    }
}

function* watchGethSyncStatusChannel () {
    while (true) {
        const resp = yield take(actionChannels.geth.syncStatus);
        if (resp.error) {
            yield put(actions.gethGetSyncStatusError(resp.error));
        } else {
            yield put(actions.gethGetSyncStatusSuccess(resp.data, resp.services));
            if (resp.data.synced) {
                if (gethSyncInterval) {
                    clearInterval(gethSyncInterval);
                    gethSyncInterval = null;
                }
                yield put(searchActions.searchSyncTags());
            }
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
    while (yield take(types.GETH_GET_STATUS)) {
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

function* watchIpfsToggleLogger () {
    while (true) {
        yield take(types.IPFS_START_LOGGER);
        const task = yield fork(ipfsStartLogger);
        yield take(types.IPFS_STOP_LOGGER);
        yield cancel(task);
    }
}

function* watchIpfsSetPorts () {
    while (true) {
        const action = yield take(types.IPFS_SET_PORTS);
        yield call(ipfsSetPorts, action);
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
    yield fork(watchIpfsToggleLogger);
    yield fork(watchIpfsSetPorts);
    yield takeEvery(types.IPFS_GET_PORTS, ipfsGetPorts);
}

export function* registerEProcListeners () {
    // yield fork(watchGethStopChannel);
    // yield fork(watchIpfsStopChannel);
    // yield fork(watchGethGetStatusChannel);
    // yield fork(watchIpfsStatusChannel);
    // yield fork(watchGethStartChannel);
    // yield fork(watchIpfsStartChannel);
    // yield fork(watchGethOptionsChannel);
    yield takeEvery(`${IPFS_MODULE.getConfig}_SUCCESS`, watchIpfsConfigChannel);
    // yield fork(watchIpfsGetPortsChannel);
    // yield fork(watchIpfsSetPortsChannel);
    // yield fork(watchGethSyncStatusChannel);
    // yield fork(watchGethLogsChannel);
    // yield fork(watchIpfsLogsChannel);
}

export function* registerWatchers () {
    // yield fork(registerEProcListeners);
    // yield fork(watchEProcActions);
}
