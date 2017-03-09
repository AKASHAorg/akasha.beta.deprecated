import { take, fork, call, apply, put, cancelled } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as types from '../constants/temp-profile-constants';
import * as tempProfileActions from '../actions/temp-profile-actions';
import * as registryService from '../services/registry-service';

const Channel = global.Channel;

/**
 * Create temp profile in database
 */
export function* createTempProfile (data) {
    console.log('creating temp profile');
    try {
        const tempProfile = yield apply(
            registryService,
            registryService.createTempProfile,
            [data]
        );
        yield put(tempProfileActions.tempProfileCreateSuccess(tempProfile));
    } catch (ex) {
        console.error(ex);
        yield put(tempProfileActions.tempProfileCreateError(ex));
    } finally {
        if (yield cancelled()) {
            // cleanup database
            yield apply(registryService, registryService.removeTempProfile);
            yield put(tempProfileActions.tempProfileAbortSuccess());
        }
    }
}


export function* createEthAddress (tempProfile) {
    console.log('creating a key!');
    const channel = Channel.server.auth.generateEthKey;
    yield call(enableChannel, channel, Channel.client.auth.manager);
    if (!tempProfile.address) {
        yield call([channel, channel.send], { password: tempProfile.password });
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
            console.error(response.error);
            yield put(tempProfileActions.ethAddressCreateError(response.error));
        }
    }
    yield put(tempProfileActions.ethAddressCreateSuccess(tempProfile));
}

export function* faucetRequest (tempProfile) {
    console.log('Receiving some love!!');
    const channel = Channel.server.auth.requestEther;
    if (!tempProfile.currentStatus.faucetRequested || !tempProfile.currentStatus.faucetTx) {
        yield call([channel, channel.send], { address: tempProfile.address });
        const response = yield take(actionChannels.auth.requestEther);
        if (!response.error) {
            tempProfile.currentStatus.faucetRequested = true;
            tempProfile.currentStatus.faucetTx = response.data.tx;
            tempProfile = yield apply(
                registryService,
                registryService.updateTempProfile,
                [tempProfile]
            );
            yield put(tempProfileActions.faucetRequestSuccess(tempProfile));
        } else {
            console.error(response.error);
        }
    }
    yield put(tempProfileActions.faucetRequestSuccess(tempProfile));
}


function* listenFaucetTx (tempProfile) {
    console.log('listen for faucet tx everytime, no matter what!');
    const channel = Channel.server.tx.addToQueue;
    yield call([channel, channel.send], { tx: tempProfile.currentStatus.faucetTx });
    const response = yield take(actionChannels.tx.emitMined);
    if (!response.error && response.data.tx === tempProfile.currentStatus.faucetTx) {
        yield put(tempProfileActions.faucetTxMined(tempProfile));
    } else {
        console.error(response.error);
    }
}
function* tempProfileLogin (tempProfile) {
    console.log('temp profile login! do it everytime!');
    const channel = Channel.server.auth.login;
    yield call([channel, channel.send], {
        account: tempProfile.account,
        password: tempProfile.password,
        registering: true
    });
    const response = yield take(actionChannels.auth.login);
    if (!response.error) {
        yield put(tempProfileActions.tempProfileLoginSuccess(tempProfile));
    } else {
        console.error(response.error);
        yield put(tempProfileActions.tempProfileLoginError(response.error));
    }
}

function* tempProfilePublish (tempProfile) {
    console.log('publish!!');
    const channel = Channel.server.registry.registerProfile;
    if (!tempProfile.currentStatus.publishTx || tempProfile.currentStatus.publishRequested) {
        yield call(enableChannel, channel, Channel.client.registry.manager);
        yield call([channel, channel.send], tempProfile);
        const response = take(actionChannels.registry.registerProfile);
        if (!response.error) {
            tempProfile.currentStatus.publishTx = response.data.tx;
            tempProfile.currentStatus.publishRequested = true;
            yield put(tempProfileActions.tempProfileUpdate(tempProfile));
        } else {
            yield put(tempProfileActions.publishTempProfileError(response.error));
        }
    } else {
        yield put(tempProfileActions.publishTempProfileSuccess(tempProfile));
    }
}

function* listenPublishTx () {}
function* removeTempProfile () {}

function* watchProfileCreate () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_CREATE);
        yield fork(createTempProfile, action.data);
    }
}

function* watchEthAddressCreate () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_CREATE_SUCCESS);
        yield fork(createEthAddress, action.data);
    }
}

function* watchFaucetRequest () {
    while (true) {
        const action = yield take(types.ETH_ADDRESS_CREATE_SUCCESS);
        yield fork(faucetRequest, action.data);
    }
}

function* watchFaucetTxMined () {
    while (true) {
        const action = yield take(types.FUND_FROM_FAUCET_SUCCESS);
        yield fork(listenFaucetTx, action.data);
    }
}

function* watchTempProfileLogin () {
    while (true) {
        const action = yield take(types.FAUCET_TX_MINED);
        yield fork(tempProfileLogin, action.data);
    }
}
function* watchTempProfilePublish () {
    while (true) {
        const action = yield take(types.TEMP_PROFILE_LOGIN_SUCCESS);
        yield fork(tempProfilePublish, action.data);
    }
}
export function* watchTempProfileActions () {
    yield fork(watchProfileCreate);
    yield fork(watchEthAddressCreate);
    yield fork(watchFaucetRequest);
    yield fork(watchFaucetTxMined);
    yield fork(watchTempProfileLogin);
    yield fork(watchTempProfilePublish);
}


/**
 * Steps:
 *
 * 1. Create a temp profile in indexedDB
 *   1.1 Fire created action on success
 *
 * 2. Create eth address
 *   2.1. Update temp profile in indexedDB
 *   2.2. Fire address created action on success
 *
 * 3. Request fund from faucet
 *   3.1 Update temp profile in indexedDB
 *   3.2 Fire funds requested action on success
 *
 * 4. Listen for faucet tx to be mined
 *   4.1 update temp profile in indexedDB
 *   4.2 Fire faucet mined on success
 *
 * 5. Login with temp profile
 *
 * 6. Publish profile to blockchain
 *   6.1 update temp profile
 *
 * 7. Listen for publish tx to be mined
 *
 * 8. Remove temp profile from db
 */
