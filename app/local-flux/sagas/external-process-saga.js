// @flow
import {
    call,
    cancel,
    fork,
    put,
    select,
    takeLatest,
    take,
    takeEvery,
    takeLeading,
    getContext
} from 'redux-saga/effects';
import delay from '@redux-saga/delay-p';
import * as actions from '../actions/external-process-actions';
import { externalProcessSelectors, settingsSelectors } from '../selectors';
import { GETH_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';
import * as types from '../constants';

/*::
    import type { Saga } from 'redux-saga';
 */

function* gethStartLogger () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    while (true) {
        yield put(actions.gethGetLogs());
        yield call([service, service.sendRequest], GETH_MODULE, GETH_MODULE.logs, {});
        yield delay(2000);
    }
}

function* ipfsStartLogger () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    while (true) {
        yield put(actions.ipfsGetLogs());
        call([service, service.sendRequest], IPFS_MODULE, IPFS_MODULE.logs, {});
        yield delay(2000);
    }
}

export function* gethGetOptions () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], GETH_MODULE, GETH_MODULE.options, {});
}

export function* ipfsGetConfig () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], IPFS_MODULE, IPFS_MODULE.getConfig, {});
}

export function* ipfsGetPorts () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], IPFS_MODULE, IPFS_MODULE.getPorts, {});
}

function* ipfsSetPorts ({ ports, restart }) /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], IPFS_MODULE, IPFS_MODULE.setPorts, {
        ports,
        restart
    });
}

function* gethStart () /* :Saga<void> */ {
    const gethOptions = yield select(settingsSelectors.selectGethSettings);
    const service = yield getContext('reqService');
    const gethJsOptions = gethOptions.toJS();
    // filter out the null and false options
    const options = {};
    Object.keys(gethJsOptions).forEach(key => {
        if (gethJsOptions[key] !== null && gethJsOptions[key] !== false) {
            options[key] = gethJsOptions[key];
        }
    });
    if (options.ipcpath) {
        options.ipcpath = options.ipcpath.replace('\\\\.\\pipe\\', '');
    }
    yield call([service, service.sendRequest], GETH_MODULE, GETH_MODULE.startService, options);
}

function* gethStop () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], GETH_MODULE, GETH_MODULE.stopService, {});
}

function* ipfsStart () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    const storagePath = yield select(externalProcessSelectors.getIpfsStoragePath);
    yield call([service, service.sendRequest], IPFS_MODULE, IPFS_MODULE.startService, {
        storagePath
    });
}

function* ipfsStop () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], IPFS_MODULE, IPFS_MODULE.stopService, {});
}

export function* gethGetStatus () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], GETH_MODULE, GETH_MODULE.status, {});
}

export function* ipfsGetStatus () /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], IPFS_MODULE, IPFS_MODULE.status, {});
}

function* gethGetSyncStatus ({ payload }) /* :Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], GETH_MODULE, GETH_MODULE.syncStatus, payload);
}

function* watchGethToggleLogger () /* :Saga<void> */ {
    while (true) {
        yield take(GETH_MODULE.logs);
        const task = yield fork(gethStartLogger);
        yield take(GETH_MODULE.logs);
        yield cancel(task);
    }
}

function* watchIpfsToggleLogger () /* :Saga<void> */ {
    while (true) {
        yield take(IPFS_MODULE.logs);
        const task = yield fork(ipfsStartLogger);
        yield take(IPFS_MODULE.logs);
        yield cancel(task);
    }
}

export function* watchEProcActions () /* :Saga<void> */ {
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
    yield takeLeading(GETH_MODULE.options, gethGetOptions);
    yield takeLeading(IPFS_MODULE.getConfig, ipfsGetConfig);
}
