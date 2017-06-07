
import { take, fork, call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as types from '../constants';
import * as tempProfileActions from '../actions/temp-profile-actions';
import * as registryService from '../services/registry-service';

const Channel = global.Channel;

/**
 * Get temp profile from database
 */
function* tempProfileGetRequest () {
    try {
        const data = yield call([registryService, registryService.getTempProfile]);
        yield put(tempProfileActions.tempProfileGetSuccess(data));
    } catch (error) {
        yield put(tempProfileActions.tempProfileGetError(error));
    }
}

/**
 * Create temp profile in database
 */
function* createTempProfile () {
    const tempProfile = yield select(state => state.tempProfileState.get('tempProfile'));
    try {
        const savedProfile = yield call(
            [registryService, registryService.createTempProfile],
            tempProfile.toJS()
        );
        yield put(tempProfileActions.tempProfileCreateSuccess(savedProfile));
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
    yield call([channel, channel.send], { password: new TextEncoder('utf-8').encode(tempProfile.password) });
}
/**
 * Listen on generateEthKey channel
 */
function* createEthAddressListener (tempProfile) {
    const response = yield take(actionChannels.auth.generateEthKey);
    const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
    if (!response.error) {
        tempProfile.address = response.data.address;
        tempProfile = yield call(
            [registryService, registryService.updateTempProfile],
            tempProfile,
            tempProfileStatus.toJS()
        );
        yield put(tempProfileActions.ethAddressCreateSuccess(tempProfile));
    } else {
        yield put(tempProfileActions.ethAddressCreateError(response.error));
    }
}
/**
 * Request faucet for initial aeth supply
 */
function* requestEther (tempProfile) {
    const channel = Channel.server.auth.requestEther;
    yield put(tempProfileActions.faucetRequest(tempProfile));
    yield call([channel, channel.send], { address: tempProfile.address });
}
/**
 * Listen for faucet transaction id
 */
function* requestEtherListener (tempProfile) {
    const response = yield take(actionChannels.auth.requestEther);
    const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
    if (!response.error) {
        try {
            tempProfile = yield call(
                [registryService, registryService.updateTempProfile],
                tempProfile,
                tempProfileStatus.toJS()
            );
            yield put(tempProfileActions.faucetRequestSuccess({ tempProfile, response }));
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
function* addTxToQueue (tx) {
    const channel = Channel.server.tx.addToQueue;
    yield call([channel, channel.send], [{ tx }]);
}

/**
 * Request main to login tempProfile
 */
function* tempProfileLoginRequest (tempProfile) {
    const channel = Channel.server.auth.login;
    yield put(tempProfileActions.tempProfileLogin(tempProfile));
    yield call([channel, channel.send], {
        account: tempProfile.address,
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
        yield put(tempProfileActions.tempProfileLoginSuccess({ tempProfile, response }));
    } else {
        yield put(tempProfileActions.tempProfileLoginError(response.error));
    }
}
/**
 * Request main to publish temp profile
 */
function* tempProfilePublishRequest (tempProfile) {
    const channel = Channel.server.registry.registerProfile;
    const manager = Channel.client.registry.manager;
    const { akashaId, address, password, ...others } = tempProfile;
    const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
    const profileToPublish = {
        akashaId,
        token: tempProfileStatus.token,
        ipfs: others
    };
    yield put(tempProfileActions.tempProfilePublish(tempProfile));
    yield call([registryService, registryService.updateTempProfile],
        tempProfile,
        tempProfileStatus.toJS()
    );
    yield call(enableChannel, channel, manager);
    yield call([channel, channel.send], profileToPublish);
}
/**
 * Listen for profile published event and receive transaction id
 */
function* tempProfilePublishListener (tempProfile) {
    const response = yield take(actionChannels.registry.registerProfile);
    if (!response.error) {
        try {
            yield put(tempProfileActions.tempProfilePublishSuccess({ tempProfile, response }));
            const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
            tempProfile = yield call(
                [registryService, registryService.updateTempProfile],
                tempProfile, tempProfileStatus.toJS()
            );
        } catch (error) {
            yield put(tempProfileActions.tempProfilePublishError(error));
        }
    } else {
        yield put(tempProfileActions.tempProfilePublishError(response.error));
    }
}

/**
 * ... watchers ...
 */
function* ethAddressCreate ({ data }) {
    if (!data.address) {
        yield fork(createEthAddressListener, data);
        yield fork(createEthAddressRequest, data);
    } else {
        yield put(tempProfileActions.ethAddressCreateSuccess(data));
    }
}

function* faucetRequest ({ data }) {
    const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
    if (!tempProfileStatus.faucetRequested || !tempProfileStatus.faucetTx) {
        yield fork(requestEtherListener, data);
        yield fork(requestEther, data);
    } else {
        yield put(tempProfileActions.faucetRequestSuccess(data));
    }
}

function* addFaucetTxToQueue () {
    const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
    yield fork(addTxToQueue, tempProfileStatus.faucetTx);
}
/**
 * Do login only if faucet tx was successfuly mined
 * @param {Object} data transaction details
 */
function* tempProfileLogin ({ data }) {
    const tempProfile = yield select(state => state.tempProfileState.get('tempProfile'));
    const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
    const isFaucetTx = data.some(txData => txData.tx === tempProfileStatus.get('faucetTx'));
    if (tempProfileStatus.get('faucetTx') && isFaucetTx) {
        yield fork(tempProfileLoginListener, tempProfile);
        yield fork(tempProfileLoginRequest, tempProfile);
    }
}

function* tempProfilePublish ({ data }) {
    const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
    if (!tempProfileStatus.publishRequested || !tempProfileStatus.publishTx) {
        yield fork(tempProfilePublishListener, data.tempProfile);
        yield fork(tempProfilePublishRequest, data.tempProfile);
    } else {
        yield put(tempProfileActions.tempProfilePublishSuccess(data.tempProfile));
    }
}

function* addPublishTxToQueue () {
    const tempProfileStatus = yield select(state => state.tempProfileState.get('status'));
    yield fork(addTxToQueue, tempProfileStatus.publishTx);
}

function* tempProfilePublishDone () {
    yield put(tempProfileActions.tempProfilePublishTxMinedSuccess());
}

function* tempProfileRemove () {
    const tempProfile = yield select(state => state.tempProfileState.get('tempProfile'));
    try {
        yield call(
            [registryService, registryService.deleteTempProfile],
            tempProfile.akashaId
        );
        yield put(tempProfileActions.tempProfileDeleteSuccess());
    } catch (err) {
        console.error('error!', err);
        yield put(tempProfileActions.tempProfileDeleteError(err));
    }
}

function* watchTempProfileRequest () {
    while (yield take(types.TEMP_PROFILE_GET_REQUEST)) {
        yield fork(tempProfileGetRequest);
    }
}

export function* watchTempProfileActions () {
    yield fork(watchTempProfileRequest);

    yield takeLatest(types.TEMP_PROFILE_CREATE, createTempProfile);
    yield takeLatest(types.TEMP_PROFILE_CREATE_SUCCESS, ethAddressCreate);
    yield takeLatest(types.ETH_ADDRESS_CREATE_SUCCESS, faucetRequest);
    yield takeEvery(types.FUND_FROM_FAUCET_SUCCESS, addFaucetTxToQueue);
    // faucet tx successfully mined
    yield takeEvery(types.TRANSACTION_EMIT_MINED_SUCCESS, tempProfileLogin);
    yield takeLatest(types.TEMP_PROFILE_LOGIN_SUCCESS, tempProfilePublish);
    yield takeLatest(types.TEMP_PROFILE_PUBLISH_SUCCESS, addPublishTxToQueue);
    yield takeEvery(types.TRANSACTION_EMIT_MINED_SUCCESS, tempProfilePublishDone);
    yield takeLatest(types.TEMP_PROFILE_DELETE, tempProfileRemove);
}
