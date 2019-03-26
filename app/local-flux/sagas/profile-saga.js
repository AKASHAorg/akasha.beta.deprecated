// @flow
import { apply, call, put, fork, all, select, takeEvery, takeLatest, getContext } from 'redux-saga/effects';
import { COMMON_MODULE, PROFILE_MODULE, AUTH_MODULE, REGISTRY_MODULE } from '@akashaproject/common/constants';
import * as appActions from '../actions/app-actions';
import * as actions from '../actions/profile-actions';
import * as tempProfileActions from '../actions/temp-profile-actions';
import * as types from '../constants';
import { isEthAddress } from '../../utils/dataModule';
import { profileSelectors, externalProcessSelectors, appSelectors } from '../selectors';

/*::
    import type { Saga } from 'redux-saga';
 */

const TRANSFERS_ITERATOR_LIMIT = 20;
const FOLLOWERS_ITERATOR_LIMIT = 2;
const FOLLOWINGS_ITERATOR_LIMIT = 2;
const COMMENTS_ITERATOR_LIMIT = 3;

function* profileAethTransfersIterator () /* : Saga<void> */ {
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const toBlock = yield select(externalProcessSelectors.getCurrentBlockNumber);
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.transfersIterator, {
        ethAddress,
        toBlock,
        limit: TRANSFERS_ITERATOR_LIMIT
    });
}

function* profileEssenceIterator () /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const essenceIterator = yield select(profileSelectors.getEssenceIterator);
    const lastBlock =
        essenceIterator.lastBlock === null
            ? yield select(externalProcessSelectors.getCurrentBlockNumber)
            : essenceIterator.lastBlock;
    const moreRequest = !!essenceIterator.lastBlock;
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.essenceIterator, {
        ethAddress,
        lastBlock,
        lastIndex: essenceIterator.lastIndex,
        limit: 16,
        moreRequest
    });
}

function* profileBondAeth ({ actionId, amount }) /* : Saga<void> */ {
    const token = yield select(profileSelectors.getToken);
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.bondAeth, {
        actionId,
        amount,
        token
    });
}

function* profileCommentsIterator ({ column }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const { id, value, reversed, firstBlock, firstIndex } = column;
    const lastBlock = reversed ? firstBlock : yield select(externalProcessSelectors.getCurrentBlockNumber);
    const lastIndex = reversed ? firstIndex : column.lastIndex;
    let akashaId, ethAddress;
    if (isEthAddress(value)) {
        ethAddress = value;
    } else {
        akashaId = value;
    }
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.commentsIterator, {
        columnId: id,
        limit: COMMENTS_ITERATOR_LIMIT,
        akashaId,
        ethAddress,
        lastBlock,
        lastIndex,
        reversed
    });
}

function* profileCreateEthAddress ({ passphrase, passphrase1 }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], AUTH_MODULE, AUTH_MODULE.generateEthKey, {
        password: passphrase,
        password1: passphrase1
    });
}

function* profileCycleAeth ({ actionId, amount }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.cycleAeth, {
        actionId,
        amount,
        token
    });
}

function* profileCyclingStates () /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.cyclingStates, {
        ethAddress
    });
}

function* profileDeleteLogged () /* : Saga<void> */ {
    const profileService = yield getContext('profileService');
    try {
        yield call([profileService, profileService.profileDeleteLogged]);
        yield put(actions.profileDeleteLoggedSuccess());
    } catch (error) {
        yield put(actions.profileDeleteLoggedError(error));
    }
}

function* profileExists ({ akashaId }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    if (akashaId.length === 1) {
        // yield put(actions.profileExistsSuccess({ akashaId, exists: false, idValid: false }));
    } else {
        yield call([service, service.sendRequest], REGISTRY_MODULE, REGISTRY_MODULE.profileExists, {
            akashaId
        });
    }
}

function* profileFaucet ({ actionId, ethAddress, withNotification }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    if (!ethAddress) {
        ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    }
    yield call([service, service.sendRequest], COMMON_MODULE, COMMON_MODULE.requestEther, {
        address: ethAddress,
        actionId,
        withNotification
    });
}

function* profileFollow ({ actionId, ethAddress }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.followProfile, {
        token,
        actionId,
        ethAddress
    });
}

function* profileFollowersIterator ({ column, batching }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const { id, value } = column;
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.followersIterator, {
        columnId: id,
        ethAddress: value,
        limit: FOLLOWERS_ITERATOR_LIMIT,
        batching
    });
}

function* profileFollowingsIterator ({
    column,
    limit = FOLLOWINGS_ITERATOR_LIMIT,
    allFollowings,
    batching
}) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const { id, value } = column;
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.followingIterator, {
        columnId: id,
        ethAddress: value,
        limit,
        allFollowings,
        batching
    });
}

function* profileFreeAeth ({ actionId, amount }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.freeAeth, {
        actionId,
        amount,
        token
    });
}

function* profileGetBalance ({ unit = 'ether' }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    if (!ethAddress) {
        return;
    }
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.getBalance, {
        etherBase: ethAddress,
        unit
    });
}

function* profileGetByAddress ({ ethAddress }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.getByAddress, {
        ethAddress
    });
}

function* profileGetData ({ akashaId, context, ethAddress, full = false, batching }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.profileData, {
        akashaId,
        context,
        ethAddress,
        full,
        batching
    });
}

export function* profileGetExtraOfList (collection, context) /* : Saga<void> */ {
    const acs = yield all([
        ...collection
            .filter(prof => prof.ethAddress)
            .map(prof =>
                put(
                    actions.profileGetData({
                        context,
                        ethAddress: prof.ethAddress,
                        batching: true
                    })
                )
            )
    ]);
    if (acs.length) {
        yield fork(profileIsFollower, { followings: acs.map(action => action.ethAddress) });
    }
}

function* profileGetList ({ ethAddresses }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.getProfileList, ethAddresses);
}

function* profileGetLocal ({ polling }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], COMMON_MODULE, COMMON_MODULE.getLocalIdentities, {
        polling
    });
}

function* getCurrentProfile () /* : Saga<void> */ {
    const service = yield getContext('reqService');
    try {
        yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.getCurrentProfile, {});
    } catch (ex) {
        yield call(actions.getCurrentProfileError(ex));
    }
}

export function* profileGetLogged () /* : Saga<void> */ {
    const profileService = yield getContext('profileService');
    try {
        const loggedProfile = yield select(profileSelectors.getLoggedProfile);
        if (loggedProfile.get('ethAddress')) {
            return;
        }
        const profile = yield apply(profileService, profileService.profileGetLogged);
        yield put(actions.profileGetLoggedSuccess(profile));
        yield put(actions.profileGetBalance());
        if (profile && profile.ethAddress) {
            yield call(profileGetData, {
                ethAddress: profile.ethAddress,
                full: true,
                akashaId: profile.akashaID,
                batching: false,
                context: null
            });
        }
    } catch (error) {
        yield put(actions.profileGetLoggedError(error));
    }
}

export function* profileGetPublishingCost () /* : Saga<void> */ {
    const service = yield getContext('reqService');
    try {
        const loggedProfile = yield select(profileSelectors.getLoggedProfile);
        // yield call(
        //     [service, service.sendRequest],
        //     UTILS_MODULE, UTILS_MODULE.manaCosts, {
        //         ethAddress: loggedProfile.get('ethAddress')
        //     }
        // );
    } catch (ex) {
        yield call(actions.profileGetPublishingCostError(ex));
    }
}

function* profileIsFollower ({ followings, ethAddress }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    if (!ethAddress) {
        ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    }
    const payload = followings.map(following => ({
        ethAddressFollower: ethAddress,
        ethAddressFollowing: following
    }));
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.isFollower, payload);
}

function* profileLogin ({ data }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const { ...payload } = data;
    payload.password = new global.TextEncoder('utf-8').encode(payload.password);
    yield call([service, service.sendRequest], COMMON_MODULE, COMMON_MODULE.login, payload);
}

function* profileLogout () /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], COMMON_MODULE, COMMON_MODULE.logout, {});
}

function* profileKarmaRanking () /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const following = yield select(profileSelectors.selectAllFollowings);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.karmaRanking, {
        following
    });
}

function* profileManaBurned () /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.manaBurned, {
        ethAddress
    });
}

function* profileMoreCommentsIterator ({ column }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const { id, lastIndex, lastBlock, value } = column;
    let akashaId, ethAddress;
    if (isEthAddress(value)) {
        ethAddress = value;
    } else {
        akashaId = value;
    }
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.commentsIterator, {
        columnId: id,
        ethAddress,
        akashaId,
        limit: COMMENTS_ITERATOR_LIMIT,
        lastBlock,
        lastIndex,
        more: true
    });
}

function* profileMoreFollowersIterator ({ column }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.followersIterator, {
        columnId: column.id,
        ethAddress: column.value,
        limit: FOLLOWERS_ITERATOR_LIMIT,
        lastBlock: column.lastBlock,
        lastIndex: column.lastIndex,
        totalLoaded: column.itemsList.size
    });
}

function* profileMoreFollowingsIterator ({ column }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.followingIterator, {
        columnId: column.id,
        ethAddress: column.value,
        limit: FOLLOWINGS_ITERATOR_LIMIT,
        lastBlock: column.lastBlock,
        lastIndex: column.lastIndex,
        totalLoaded: column.itemList ? column.itemsList.size : 0
    });
}

function* profileResolveIpfsHash ({ ipfsHash, columnId, akashaIds }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.resolveProfileIpfsHash, {
        ipfsHash,
        columnId,
        akashaIds
    });
}

function* profileSaveLastBlockNr () /* : Saga<void> */ {
    const profileService = yield getContext('profileService');
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const blockNr = yield select(externalProcessSelectors.getCurrentBlockNumber);
    try {
        yield call([profileService, profileService.profileSaveLastBlockNr], { ethAddress, blockNr });
    } catch (error) {
        yield put(actions.profileSaveLastBlockNrError(error));
    }
}

function* profileSaveLogged (loggedProfile) /* : Saga<void> */ {
    const profileService = yield getContext('profileService');
    try {
        yield call([profileService, profileService.profileSaveLogged], loggedProfile);
    } catch (error) {
        yield put(actions.profileSaveLoggedError(error));
    }
}

function* profileSendTip ({
    actionId,
    akashaId,
    ethAddress,
    receiver,
    value,
    tokenAmount
}) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.sendTip, {
        token,
        actionId,
        akashaId,
        ethAddress,
        receiver,
        value,
        tokenAmount
    });
}

function* profileToggleDonations ({ actionId, status }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.toggleDonations, {
        token,
        actionId,
        status
    });
}

function* profileToggleDonationsSuccess () /* : Saga<void> */ {
    const profileService = yield getContext('profileService');
    const profile = yield call([profileService, profileService.profileGetLogged]);
    if (profile && profile.ethAddress) {
        yield call(profileGetData, {
            batching: false,
            context: null,
            akashaId: profile.akashaId,
            ethAddress: profile.ethAddress,
            full: true
        });
    }
    yield put(
        appActions.showNotification({
            id: 'toggleDonationsSuccess',
            duration: 4
        })
    );
}

function* profileTransferToken ({ actionId, akashaId, ethAddress, tokenAmount }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.transfer, {
        token,
        actionId,
        akashaId,
        ethAddress,
        tokenAmount
    });
}

function* profileTransferEth ({ actionId, akashaId, ethAddress, value }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.transfer, {
        token,
        actionId,
        akashaId,
        ethAddress,
        value
    });
}

function* profileTransformEssence ({ actionId, amount }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.transformEssence, {
        actionId,
        amount,
        token
    });
}

function* profileUnfollow ({ actionId, ethAddress }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.unFollowProfile, {
        token,
        actionId,
        ethAddress
    });
}

function* profileUpdate ({
    actionId,
    about,
    avatar,
    backgroundImage,
    firstName,
    lastName,
    links
}) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const isProfileEdit = select(appSelectors.selectProfileEditToggle);
    if (isProfileEdit) {
        yield put(appActions.profileEditToggle());
    }
    const token = yield select(profileSelectors.getToken);
    const ipfs = { about, avatar, backgroundImage, firstName, lastName, links };
    yield call([service, service.sendRequest], PROFILE_MODULE, PROFILE_MODULE.updateProfileData, {
        token,
        actionId,
        ipfs
    });
}

function* profileUpdateSuccess (payload) /* : Saga<void> */ {
    const { akashaId, ethAddress } = payload.data;
    // remove saved temp profile from DB
    yield put(tempProfileActions.tempProfileDeleteFull(ethAddress));
    // get updated profile data
    yield call(profileGetData, {
        akashaId,
        ethAddress: null,
        context: null,
        batching: false,
        full: true
    });
    yield put(
        appActions.showNotification({
            id: 'updateProfileSuccess',
            duration: 4
        })
    );
}

function* profileRegister ({
    actionId,
    akashaId,
    address,
    about,
    avatar,
    backgroundImage,
    donationsEnabled,
    firstName,
    lastName,
    links,
    ethAddress
}) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const isProfileEdit = yield select(appSelectors.selectProfileEditToggle);
    if (isProfileEdit) {
        yield put(appActions.profileEditToggle());
    }
    const token = yield select(profileSelectors.getToken);
    const ipfs = { avatar, address, about, backgroundImage, firstName, lastName, links };
    yield call([service, service.sendRequest], REGISTRY_MODULE, REGISTRY_MODULE.registerProfile, {
        token,
        actionId,
        akashaId,
        donationsEnabled,
        ethAddress,
        ipfs
    });
}

function* profileRegisterSuccess (payload) /* : Saga<void> */ {
    const { akashaId, ethAddress } = payload.data;
    // remove saved temp profile from DB
    yield put(tempProfileActions.tempProfileDeleteFull(ethAddress));
    // get updated profile data
    yield call(profileGetData, {
        akashaId,
        ethAddress: null,
        context: null,
        batching: false,
        full: true
    });
    yield put(
        appActions.showNotification({
            id: 'registerProfileSuccess',
            duration: 4
        })
    );
}

// eslint-disable-next-line max-statements
export function* watchProfileActions () /* : Saga<void> */ {
    yield takeEvery(PROFILE_MODULE.transfersIterator, profileAethTransfersIterator);
    yield takeEvery(PROFILE_MODULE.bondAeth, profileBondAeth);
    yield takeLatest(PROFILE_MODULE.commentsIterator, profileCommentsIterator);
    yield takeLatest(AUTH_MODULE.generateEthKey, profileCreateEthAddress);
    yield takeEvery(PROFILE_MODULE.cycleAeth, profileCycleAeth);
    yield takeEvery(PROFILE_MODULE.cyclingStates, profileCyclingStates);
    yield takeLatest(types.PROFILE_DELETE_LOGGED, profileDeleteLogged);
    yield takeEvery(PROFILE_MODULE.essenceIterator, profileEssenceIterator);
    yield takeLatest(REGISTRY_MODULE.profileExists, profileExists);
    yield takeEvery(COMMON_MODULE.requestEther, profileFaucet);
    yield takeEvery(PROFILE_MODULE.followProfile, profileFollow);
    yield takeEvery(PROFILE_MODULE.followersIterator, profileFollowersIterator);
    yield takeEvery(PROFILE_MODULE.followingIterator, profileFollowingsIterator);
    yield takeEvery(PROFILE_MODULE.freeAeth, profileFreeAeth);
    yield takeLatest(PROFILE_MODULE.getBalance, profileGetBalance);
    yield takeEvery(PROFILE_MODULE.getByAddress, profileGetByAddress);
    yield takeEvery(PROFILE_MODULE.getCurrentProfile, getCurrentProfile);
    yield takeEvery(PROFILE_MODULE.profileData, profileGetData);
    yield takeLatest(PROFILE_MODULE.getProfileList, profileGetList);
    yield takeLatest(COMMON_MODULE.getLocalIdentities, profileGetLocal);
    yield takeLatest(types.PROFILE_GET_LOGGED, profileGetLogged);
    yield takeLatest(types.PROFILE_GET_LOGGED_SUCCESS, profileGetPublishingCost);
    yield takeEvery(PROFILE_MODULE.isFollower, profileIsFollower);
    yield takeEvery(PROFILE_MODULE.karmaRanking, profileKarmaRanking);
    yield takeLatest(COMMON_MODULE.login, profileLogin);
    yield takeLatest(COMMON_MODULE.logout, profileLogout);
    yield takeEvery(PROFILE_MODULE.manaBurned, profileManaBurned);
    yield takeEvery(PROFILE_MODULE.commentsIterator, profileMoreCommentsIterator);
    yield takeEvery(PROFILE_MODULE.followersIterator, profileMoreFollowersIterator);
    yield takeEvery(PROFILE_MODULE.followingIterator, profileMoreFollowingsIterator);
    yield takeEvery(PROFILE_MODULE.resolveProfileIpfsHash, profileResolveIpfsHash);
    yield takeEvery(types.PROFILE_SAVE_LAST_BLOCK_NR, profileSaveLastBlockNr);
    yield takeEvery(PROFILE_MODULE.sendTip, profileSendTip);
    yield takeEvery(PROFILE_MODULE.toggleDonations, profileToggleDonations);
    yield takeEvery(PROFILE_MODULE.transfer, profileTransferToken);
    yield takeEvery(PROFILE_MODULE.transformEssence, profileTransformEssence);
    yield takeEvery(PROFILE_MODULE.unFollowProfile, profileUnfollow);
    yield takeEvery(PROFILE_MODULE.updateProfileData, profileUpdate);
    yield takeEvery(REGISTRY_MODULE.registerProfile, profileRegister);
}
