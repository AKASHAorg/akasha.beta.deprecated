// @flow
import * as reduxSaga from 'redux-saga';
import { call, cancel, fork, put, select, takeLatest, take, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/external-process-actions';
import * as types from '../constants';
import { externalProcessSelectors } from '../selectors';
import ChReqService from '../services/channel-request-service';
import { GETH_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

/*::
    import type { Saga } from 'redux-saga';
 */
let gethSyncInterval = null;

// function* gethResetBusyState ()/* :Saga<void> */ {
//     yield call([reduxSaga, reduxSaga.delay], 2000);
//     yield put(actions.gethResetBusy());
// }

// function* ipfsResetBusyState ()/* :Saga<void> */ {
//     yield call([reduxSaga, reduxSaga.delay], 2000);
//     yield put(actions.ipfsResetBusy());
// }

function* gethStartLogger ()/* :Saga<void> */ {
    while (true) {
        yield put(actions.gethGetLogs());
        yield call([ChReqService, ChReqService.sendRequest], GETH_MODULE, GETH_MODULE.logs, {});
        yield call([reduxSaga, reduxSaga.delay], 2000);
    }
}

function* ipfsStartLogger ()/* :Saga<void> */ {
    while (true) {
        yield put(actions.ipfsGetLogs());
        call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.logs, {})
        yield call([reduxSaga, reduxSaga.delay], 2000);
    }
}

export function* gethGetOptions ()/* :Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], GETH_MODULE, GETH_MODULE.options, {});
}

export function* ipfsGetConfig ()/* :Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.getConfig, {});
}

export function* ipfsGetPorts ()/* :Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.getPorts, {});
}

function* ipfsSetPorts ({ ports, restart })/* :Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        IPFS_MODULE, IPFS_MODULE.setPorts, {
            ports, restart
        });
}

function* gethStart ()/* :Saga<void> */ {
    const gethOptions = yield select(externalProcessSelectors.getGethOptions);
    const gethJsOptions = gethOptions.toJS();
    // filter out the null and false options
    const options = {};
    Object.keys(gethJsOptions).forEach((key) => {
        if (gethJsOptions[key] !== null && gethJsOptions[key] !== false) {
            options[key] = gethJsOptions[key];
        }
    });
    if (options.ipcpath) {
        options.ipcpath = options.ipcpath.replace('\\\\.\\pipe\\', '');
    }
    yield call([ChReqService, ChReqService.sendRequest], GETH_MODULE, GETH_MODULE.startService, options);
}

function* gethStop ()/* :Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], GETH_MODULE, GETH_MODULE.stopService, {});
}

function* ipfsStart ()/* :Saga<void> */ {
    const storagePath = yield select(externalProcessSelectors.getIpfsStoragePath);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        IPFS_MODULE, IPFS_MODULE.startService, {
            storagePath
        });
}

function* ipfsStop ()/* :Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.stopService, {});
}

export function* gethGetStatus ()/* :Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], GETH_MODULE, GETH_MODULE.status, {})
}

export function* ipfsGetStatus ()/* :Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], IPFS_MODULE, IPFS_MODULE.status, {})
}

function* gethGetSyncStatus ()/* :Saga<void> */ {
    const syncActionId = yield select(externalProcessSelectors.selectGethSyncActionId);
    if (!gethSyncInterval) {
        gethSyncInterval = setInterval(() => {
            if (syncActionId === 0 || syncActionId === 1) {
                ChReqService.sendRequest(GETH_MODULE, GETH_MODULE.syncStatus, {});
            }
        }, 2000);
    }
}

function* watchGethToggleLogger ()/* :Saga<void> */ {
    while (true) {
        yield take(GETH_MODULE.logs);
        const task = yield fork(gethStartLogger);
        yield take(GETH_MODULE.logs);
        yield cancel(task);
    }
}

function* watchIpfsToggleLogger ()/* :Saga<void> */ {
    while (true) {
        yield take(IPFS_MODULE.logs);
        const task = yield fork(ipfsStartLogger);
        yield take(IPFS_MODULE.logs);
        yield cancel(task);
    }
}

export function* watchEProcActions ()/* :Saga<void> */ {
    yield takeLatest(GETH_MODULE.startService, gethStart);
    yield takeLatest(IPFS_MODULE.startService, ipfsStart);
    yield takeEvery(GETH_MODULE.status, gethGetStatus);
    yield takeEvery(IPFS_MODULE.status, ipfsGetStatus);
    yield takeEvery(GETH_MODULE.syncStatus, gethGetSyncStatus);
    yield takeLatest(GETH_MODULE.stop, gethStop);
    yield takeLatest(IPFS_MODULE.stopService, ipfsStop);
    yield fork(watchGethToggleLogger);
    yield fork(watchIpfsToggleLogger);
    yield takeLatest(IPFS_MODULE.setPorts, ipfsSetPorts);
    yield takeEvery(IPFS_MODULE.getPorts, ipfsGetPorts);
    // yield takeEvery(`${IPFS_MODULE.getConfig}_SUCCESS`, watchIpfsConfigChannel);
}
