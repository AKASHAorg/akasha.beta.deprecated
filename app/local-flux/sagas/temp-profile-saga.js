import { take, fork, call, apply, put } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as types from '../constants';
import * as tempProfileActions from '../actions/temp-profile-actions';
import * as registryService from '../services/registry-service';

const Channel = global.Channel;

/**
 * Create temp profile in database
 */
function* createTempProfile (data) {
    try {
        const tempProfile = yield apply(
            registryService,
            registryService.createTempProfile,
            [data]
        );
        yield put(tempProfileActions.tempProfileCreateSuccess(tempProfile));
    } catch (ex) {
        yield put(tempProfileActions.tempProfileCreateError(ex));
    }
}
/**
 * Request main to create an address (key)
 */
function* createEthAddressRequest (tempProfile) {
    const channel = Channel.server.auth.generateEthKey;
    yield put(tempProfileActions.ethAddressCreate(tempProfile));
    yield call(enableChannel, channel, Channel.client.auth.manager);
    yield call([channel, channel.send], { password: tempProfile.password });
}
/**
 * Listen on generateEthKey channel
 */
function* createEthAddressListener (tempProfile) {
    const response = yield take(actionChannels.auth.generateEthKey);
    if (!response.error) {
        tempProfile.address = response.data.address;
        tempProfile = yield apply(
            registryService,
            registryService.updateTempProfile,
            [tempProfile]
        );
        yield put(tempProfileActions.ethAddressCreateSuccess(tempProfile));
    } else {
        yield put(tempProfileActions.ethAddressCreateError(response.error));
    }
}
/**
 * Request faucet for initial aeth supply
 */
function* faucetRequest (tempProfile) {
    const channel = Channel.server.auth.requestEther;
    yield put(tempProfileActions.faucetRequest(tempProfile));
    yield call([channel, channel.send], { address: tempProfile.address });
}
/**
 * Listen for faucet transaction id
 */
function* faucetRequestListener (tempProfile) {
    const response = yield take(actionChannels.auth.requestEther);
    if (!response.error) {
        tempProfile.currentStatus.faucetRequested = true;
        tempProfile.currentStatus.faucetTx = response.data.tx;
        try {
            tempProfile = yield apply(
                registryService,
                registryService.updateTempProfile,
                [tempProfile]
            );
            yield put(tempProfileActions.faucetRequestSuccess(tempProfile));
        } catch (error) {
            yield put(tempProfileActions.faucetRequestError(error));
        }
    } else {
        yield put(tempProfileActions.faucetRequestError(response.error));
    }
}
/**
 * Add transactions to queue
 */
function* addTxToQueue ([tx, action]) {
    const channel = Channel.server.tx.addToQueue;
    yield put(tempProfileActions[action]());
    yield call([channel, channel.send], { tx });
}
/**
 * Listen faucet transaction for mined event
 */
function* listenFaucetTx (tempProfile) {
    const response = yield take(actionChannels.tx.emitMined);
    if (!response.error && response.data.tx === tempProfile.currentStatus.faucetTx) {
        yield put(tempProfileActions.tempProfileFaucetTxMinedSuccess(tempProfile));
    } else {
        yield put(tempProfileActions.faucetRequestError(response.error));
    }
}
/**
 * Request main to log in tempProfile
 */
function* tempProfileLoginRequest (tempProfile) {
    const channel = Channel.server.auth.login;
    yield put(tempProfileActions.tempProfileLogin(tempProfile));
    yield call([channel, channel.send], {
        account: tempProfile.account,
        password: tempProfile.password,
        registering: true
    });
}
/**
 * Listen when tempProfile was logged in
 */
function* tempProfileLoginListener (tempProfile) {
    const response = yield take(actionChannels.auth.login);
    if (!response.error) {
        yield put(tempProfileActions.tempProfileLoginSuccess(tempProfile));
    } else {
        yield put(tempProfileActions.tempProfileLoginError(response.error));
    }
}
/**
 * Request main to publish temp profile
 */
function* tempProfilePublishRequest (tempProfile) {
    const channel = Channel.server.registry.registerProfile;
    yield put(tempProfileActions.tempProfilePublish(tempProfile));
    yield call(enableChannel, channel, Channel.client.registry.manager);
    yield call([channel, channel.send], tempProfile);
}
/**
 * Listen for profile published event and receive transaction id
 */
function* tempProfilePublishListener (tempProfile) {
    const response = yield take(actionChannels.registry.registerProfile);
    if (!response.error) {
        tempProfile.currentStatus.publishTx = response.data.tx;
        tempProfile.currentStatus.publishRequested = true;
        tempProfile = yield apply(
            registryService,
            registryService.updateTempProfile,
            [tempProfile]
        );
        yield put(tempProfileActions.tempProfilePublishSuccess(tempProfile));
    } else {
        yield put(tempProfileActions.tempProfilePublishError(response.error));
    }
}
/**
 * Listen when publish transaction is mined
 */
function* publishTxListener (tempProfile) {
    const response = yield take(actionChannels.tx.emitMined);
    if (!response.error && response.data.tx === tempProfile.currentStatus.publishTx) {
        yield put(tempProfileActions.tempProfilePublishTxMinedSuccess(tempProfile));
    } else if (response.error && response.error.from.tx === tempProfile.currentStatus.publishTx) {
        yield put(tempProfileActions.tempProfilePublishError(response.error));
    }
}
/**
 * ... watchers ...
 */
function* watchProfileCreate () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_CREATE);
        yield fork(createTempProfile, action.data);
    }
}

function* watchEthAddressCreate () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_CREATE_SUCCESS);
        if (!action.data.address) {
            yield fork(createEthAddressListener, action.data);
            yield fork(createEthAddressRequest, action.data);
        } else {
            yield put(tempProfileActions.ethAddressCreateSuccess(action.data));
        }
    }
}

function* watchFaucetRequest () {
    while (true) {
        const action = yield take(types.ETH_ADDRESS_CREATE_SUCCESS);
        if (!action.data.currentStatus.faucetRequested || !action.data.currentStatus.faucetTx) {
            yield fork(faucetRequestListener, action.data);
            yield fork(faucetRequest, action.data);
        } else {
            yield put(tempProfileActions.faucetRequest(action.data));
        }
    }
}

function* watchFaucetTxMined () {
    while (true) {
        const action = yield take(types.FUND_FROM_FAUCET_SUCCESS);
        yield fork(listenFaucetTx, action.data);
        yield fork(addTxToQueue, [action.data.currentStatus.faucetTx, 'tempProfileFaucetTxMined']);
    }
}

function* watchTempProfileLogin () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS);
        yield fork(tempProfileLoginListener, action.data);
        yield fork(tempProfileLoginRequest, action.data);
    }
}

function* watchTempProfilePublish () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_LOGIN_SUCCESS);
        if (!action.data.currentStatus.publishRequested || !action.data.currentStatus.publishTx) {
            yield fork(tempProfilePublishListener, action.data);
            yield fork(tempProfilePublishRequest, action.data);
        } else {
            yield put(tempProfileActions.tempProfilePublishSuccess(action.data));
        }
    }
}

function* watchPublishTxMined () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_PUBLISH_SUCCESS);
        yield fork(publishTxListener, action.data);
        yield fork(addTxToQueue, [action.data.currentStatus.publishTx, 'tempProfilePublishTxMined']);
    }
}

function* watchTempProfileRemove () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS);
        yield put(tempProfileActions.tempProfileDelete());
        try {
            yield call([registryService, registryService.deleteTempProfile], action.data);
            yield put(tempProfileActions.tempProfileDeleteSuccess());
        } catch (err) {
            yield put(tempProfileActions.tempProfileDeleteError());
        }
    }
}

export function* watchTempProfileActions () {
    yield fork(watchProfileCreate);
    yield fork(watchEthAddressCreate);
    yield fork(watchFaucetRequest);
    yield fork(watchFaucetTxMined);
    yield fork(watchTempProfileLogin);
    yield fork(watchTempProfilePublish);
    yield fork(watchPublishTxMined);
    yield fork(watchTempProfileRemove);
}
