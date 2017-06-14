import { all, apply, call, fork, put, select, take, takeEvery,
    takeLatest } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as appActions from '../actions/app-actions';
import * as actions from '../actions/entry-actions';
import * as profileActions from '../actions/profile-actions';
import * as transactionActions from '../actions/transaction-actions';
import * as types from '../constants';
import { selectColumnLastEntry, selectColumnLastBlock, selectIsFollower, selectLoggedAkashaId,
    selectToken } from '../selectors';
import actionTypes from '../../constants/action-types';

const Channel = global.Channel;
const ALL_STREAM_LIMIT = 11;
const ENTRY_ITERATOR_LIMIT = 6;

function* enableExtraChannels () {
    const getVoteOf = Channel.server.entry.getVoteOf;
    const getEntryBalance = Channel.server.entry.getEntryBalance;
    const canClaim = Channel.server.entry.canClaim;
    yield all([
        call(enableChannel, getVoteOf, Channel.client.entry.manager),
        call(enableChannel, getEntryBalance, Channel.client.entry.manager),
        call(enableChannel, canClaim, Channel.client.entry.manager)
    ]);
}

function* entryCanClaim ({ entryId }) {
    const channel = Channel.server.entry.canClaim;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId: [entryId] }]);
}

function* entryClaim ({ entryId, entryTitle, gas }) {
    const channel = Channel.server.entry.claim;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, entryId, entryTitle, gas }]);
}

function* entryClaimSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'claimSuccess',
        values: { entryTitle: data.entryTitle }
    }));
}

function* entryDownvote ({ entryId, entryTitle, weight, value, gas }) {
    const channel = Channel.server.entry.downvote;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, entryId, entryTitle, weight, value, gas }]);
}

function* entryDownvoteSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'downvoteEntrySuccess',
        values: { entryTitle: data.entryTitle }
    }));
}

function* entryGetBalance ({ entryId }) {
    const channel = Channel.server.entry.getEntryBalance;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId: [entryId] }]);
}

function* entryGetExtraOfEntry (entryId, publisher) {
    const getVoteOf = Channel.server.entry.getVoteOf;
    const getEntryBalance = Channel.server.entry.getEntryBalance;
    const canClaim = Channel.server.entry.canClaim;
    yield call(enableExtraChannels);
    const akashaId = yield select(state => state.profileState.getIn(['loggedProfile', 'akashaId']));
    const isOwnEntry = publisher && akashaId === publisher.akashaId;
    yield apply(getVoteOf, getVoteOf.send, [[{ akashaId, entryId }]]);
    if (isOwnEntry) {
        yield apply(getEntryBalance, getEntryBalance.send, [{ entryId: [entryId] }]);
        yield apply(canClaim, canClaim.send, [{ entryId: [entryId] }]);
    } else {
        const isFollower = yield select(state => selectIsFollower(state, publisher.akashaId));
        if (isFollower === undefined) {
            yield put(profileActions.profileIsFollower([publisher.akashaId]));
        }
    }
}

function* entryGetExtraOfList (entries) {
    const getVoteOf = Channel.server.entry.getVoteOf;
    const getEntryBalance = Channel.server.entry.getEntryBalance;
    const canClaim = Channel.server.entry.canClaim;
    yield call(enableExtraChannels);
    const akashaId = yield select(selectLoggedAkashaId);
    const allEntries = [];
    const ownEntries = [];
    entries.forEach((entry) => {
        allEntries.push({ akashaId, entryId: entry.entryId });
        if (entry.entryEth && entry.entryEth.publisher &&
                akashaId === entry.entryEth.publisher.akashaId) {
            ownEntries.push(entry.entryId);
        }
    });
    yield apply(getVoteOf, getVoteOf.send, [allEntries]);
    if (ownEntries.length) {
        yield apply(getEntryBalance, getEntryBalance.send, [{ entryId: ownEntries }]);
        yield apply(canClaim, canClaim.send, [{ entryId: ownEntries }]);
    }
}

function* entryGetFull ({ entryId, version }) {
    yield fork(watchEntryGetChannel); // eslint-disable-line no-use-before-define
    const channel = Channel.server.entry.getEntry;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId, full: true, version }]);
}

function* entryGetLatestVersion ({ entryId }) {
    yield fork(watchEntryGetChannel); // eslint-disable-line no-use-before-define
    const channel = Channel.server.entry.getEntry;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId, full: true, latestVersion: true }]);
}

function* entryGetScore ({ entryId }) {
    const channel = Channel.server.entry.getScore;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId }]);
}

function* entryGetVoteOf ({ entryId }) {
    const channel = Channel.server.entry.getVoteOf;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const akashaId = yield select(selectLoggedAkashaId);
    yield apply(channel, channel.send, [[{ akashaId, entryId }]]);
}

function* entryIsActive ({ entryId }) {
    const channel = Channel.server.entry.isActive;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId }]);
}

function* entryMoreNewestIterator ({ id }) {
    const channel = Channel.server.entry.allStreamIterator;
    const toBlock = yield select(state => selectColumnLastBlock(state, id));
    yield apply(channel, channel.send, [{ id, limit: ALL_STREAM_LIMIT, toBlock: toBlock - 1 }]);
}

function* entryMoreProfileIterator ({ id, akashaId }) {
    const channel = Channel.server.entry.entryProfileIterator;
    const start = yield select(state => selectColumnLastEntry(state, id));
    yield apply(channel, channel.send, [{ id, limit: ENTRY_ITERATOR_LIMIT, start, akashaId }]);
}

function* entryMoreStreamIterator ({ id }) {
    const channel = Channel.server.entry.followingStreamIterator;
    const toBlock = yield select(state => selectColumnLastBlock(state, id));
    yield apply(channel, channel.send, [{ id, limit: ENTRY_ITERATOR_LIMIT, toBlock: toBlock - 1 }]);
}

function* entryMoreTagIterator ({ id, tagName }) {
    const channel = Channel.server.entry.entryTagIterator;
    const start = yield select(state => selectColumnLastEntry(state, id));
    yield apply(channel, channel.send, [{ id, limit: ENTRY_ITERATOR_LIMIT, start, tagName }]);
}

function* entryNewestIterator ({ id }) {
    const channel = Channel.server.entry.allStreamIterator;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ id, limit: ALL_STREAM_LIMIT }]);
}

function* entryProfileIterator ({ id, akashaId }) {
    const channel = Channel.server.entry.entryProfileIterator;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ id, limit: ENTRY_ITERATOR_LIMIT, akashaId }]);
}

function* entryStreamIterator ({ id }) {
    const channel = Channel.server.entry.followingStreamIterator;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ id, limit: ENTRY_ITERATOR_LIMIT }]);
}

function* entryTagIterator ({ id, tagName }) {
    const channel = Channel.server.entry.entryTagIterator;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ id, limit: ENTRY_ITERATOR_LIMIT, tagName }]);
}

function* entryUpvote ({ entryId, entryTitle, weight, value, gas }) {
    const channel = Channel.server.entry.upvote;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, entryId, entryTitle, weight, value, gas }]);
}

function* entryUpvoteSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'upvoteEntrySuccess',
        values: { entryTitle: data.entryTitle }
    }));
}

function* entryVoteCost () {
    const channel = Channel.server.entry.voteCost;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const weight = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    yield apply(channel, channel.send, [{ weight }]);
}

// Action watchers

function* watchEntryCanClaim () {
    yield takeEvery(types.ENTRY_CAN_CLAIM, entryCanClaim);
}

function* watchEntryClaim () {
    yield takeEvery(types.ENTRY_CLAIM, entryClaim);
}

function* watchEntryClaimSuccess () {
    yield takeEvery(types.ENTRY_CLAIM_SUCCESS, entryClaimSuccess);
}

function* watchEntryDownvote () {
    yield takeEvery(types.ENTRY_DOWNVOTE, entryDownvote);
}

function* watchEntryDownvoteSuccess () {
    yield takeEvery(types.ENTRY_DOWNVOTE_SUCCESS, entryDownvoteSuccess);
}

function* watchEntryGetBalance () {
    yield takeEvery(types.ENTRY_GET_BALANCE, entryGetBalance);
}

function* watchEntryGetFull () {
    yield takeLatest(types.ENTRY_GET_FULL, entryGetFull);
}

function* watchEntryGetLatestVersion () {
    yield takeLatest(types.ENTRY_GET_LATEST_VERSION, entryGetLatestVersion);
}

function* watchEntryGetScore () {
    yield takeEvery(types.ENTRY_GET_SCORE, entryGetScore);
}

function* watchEntryGetVoteOf () {
    yield takeEvery(types.ENTRY_GET_VOTE_OF, entryGetVoteOf);
}

function* watchEntryIsActive () {
    yield takeEvery(types.ENTRY_IS_ACTIVE, entryIsActive);
}

function* watchEntryMoreNewestIterator () {
    yield takeEvery(types.ENTRY_MORE_NEWEST_ITERATOR, entryMoreNewestIterator);
}

function* watchEntryMoreProfileIterator () {
    yield takeEvery(types.ENTRY_MORE_PROFILE_ITERATOR, entryMoreProfileIterator);
}

function* watchEntryMoreStreamIterator () {
    yield takeEvery(types.ENTRY_MORE_STREAM_ITERATOR, entryMoreStreamIterator);
}

function* watchEntryMoreTagIterator () {
    yield takeEvery(types.ENTRY_MORE_TAG_ITERATOR, entryMoreTagIterator);
}

function* watchEntryNewestIterator () {
    yield takeEvery(types.ENTRY_NEWEST_ITERATOR, entryNewestIterator);
}

function* watchEntryProfileIterator () {
    yield takeEvery(types.ENTRY_PROFILE_ITERATOR, entryProfileIterator);
}

function* watchEntryStreamIterator () {
    yield takeEvery(types.ENTRY_STREAM_ITERATOR, entryStreamIterator);
}

function* watchEntryTagIterator () {
    yield takeEvery(types.ENTRY_TAG_ITERATOR, entryTagIterator);
}

function* watchEntryUpvote () {
    yield takeEvery(types.ENTRY_UPVOTE, entryUpvote);
}

function* watchEntryUpvoteSuccess () {
    yield takeEvery(types.ENTRY_UPVOTE_SUCCESS, entryUpvoteSuccess);
}

function* watchEntryVoteCost () {
    yield takeEvery(types.ENTRY_VOTE_COST, entryVoteCost);
}

// Channel watchers

function* watchEntryCanClaimChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.canClaim);
        if (resp.error) {
            yield put(actions.entryCanClaimError(resp.error));
        } else {
            yield put(actions.entryCanClaimSuccess(resp.data));
        }
    }
}

function* watchEntryClaimChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.claim);
        const { entryId, entryTitle, gas } = resp.request;
        if (resp.error) {
            yield put(actions.entryClaimError(resp.error, entryId, entryTitle));
        } else {
            const payload = [{
                extra: {
                    entryId,
                    entryTitle
                },
                gas,
                tx: resp.data.tx,
                type: actionTypes.claim
            }];
            yield put(transactionActions.transactionAddToQueue(payload));
            yield put(appActions.showNotification({
                id: 'claiming',
                values: { entryTitle },
                duration: 3000
            }));
        }
    }
}

function* watchEntryDownvoteChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.downvote);
        const { entryId, entryTitle, gas, weight } = resp.request;
        if (resp.error) {
            yield put(actions.entryDownvoteError(resp.error, entryId, entryTitle));
        } else {
            const payload = [{
                extra: {
                    entryId,
                    entryTitle,
                    weight
                },
                gas,
                tx: resp.data.tx,
                type: actionTypes.downvote,
            }];
            yield put(transactionActions.transactionAddToQueue(payload));
            yield put(appActions.showNotification({
                id: 'downvotingEntry',
                values: { entryTitle },
                duration: 3000
            }));
        }
    }
}

function* watchEntryGetBalanceChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.getEntryBalance);
        if (resp.error) {
            yield put(actions.entryGetBalanceError(resp.error));
        } else {
            yield put(actions.entryGetBalanceSuccess(resp.data));
        }
    }
}

function* watchEntryGetChannel () {
    const resp = yield take(actionChannels.entry.getEntry);
    if (resp.error) {
        if (resp.request.latestVersion) {
            yield put(actions.entryGetLatestVersionError(resp.error));
        } else if (resp.request.full) {
            yield put(actions.entryGetFullError(resp.error));
        } else {
            yield put(actions.entryGetError(resp.error));
        }
        return;
    } else if (resp.request.latestVersion) {
        const { content } = resp.data;
        yield put(actions.entryGetLatestVersionSuccess(content && content.version));
    } else if (resp.request.full) {
        yield put(actions.entryGetFullSuccess(resp.data));
    } else {
        yield put(actions.entryGetFullSuccess(resp.data));
    }
    yield fork(entryGetExtraOfEntry, resp.data.entryId, resp.data.entryEth.publisher);
}

function* watchEntryGetScoreChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.getScore);
        if (resp.error) {
            yield put(actions.entryGetScoreError(resp.error));
        } else {
            yield put(actions.entryGetScoreSuccess(resp.data));
        }
    }
}

function* watchEntryGetVoteOfChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.getVoteOf);
        if (resp.error) {
            yield put(actions.entryGetVoteOfError(resp.error));
        } else {
            yield put(actions.entryGetVoteOfSuccess(resp.data));
        }
    }
}

function* watchEntryIsActiveChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.isActive);
        if (resp.error) {
            yield put(actions.entryIsActiveError(resp.error));
        } else {
            yield put(actions.entryIsActiveSuccess(resp.data));
        }
    }
}

function* watchEntryNewestIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.allStreamIterator);
        if (resp.error) {
            if (resp.request.toBlock) {
                yield put(actions.entryMoreNewestIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.entryNewestIteratorError(resp.error, resp.request));
            }
        } else {
            if (resp.data.toBlock) {
                yield put(actions.entryMoreNewestIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.entryNewestIteratorSuccess(resp.data, resp.request));
            }
            yield fork(entryGetExtraOfList, resp.data.collection);
        }
    }
}

function* watchEntryProfileIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.entryProfileIterator);
        if (resp.error) {
            if (resp.request.start) {
                yield put(actions.entryMoreProfileIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.entryProfileIteratorError(resp.error, resp.request));
            }
        } else {
            if (resp.request.start) {
                yield put(actions.entryMoreProfileIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.entryProfileIteratorSuccess(resp.data, resp.request));
            }
            yield fork(entryGetExtraOfList, resp.data.collection);
        }
    }
}

function* watchEntryStreamIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.followingStreamIterator);
        if (resp.error) {
            if (resp.request.toBlock) {
                yield put(actions.entryMoreStreamIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.entryStreamIteratorError(resp.error, resp.request));
            }
        } else {
            if (resp.data.toBlock) {
                yield put(actions.entryMoreStreamIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.entryStreamIteratorSuccess(resp.data, resp.request));
            }
            yield fork(entryGetExtraOfList, resp.data.collection);
        }
    }
}

function* watchEntryTagIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.entryTagIterator);
        if (resp.error) {
            if (resp.request.start) {
                yield put(actions.entryMoreTagIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.entryTagIteratorError(resp.error, resp.request));
            }
        } else {
            if (resp.request.start) {
                yield put(actions.entryMoreTagIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.entryTagIteratorSuccess(resp.data, resp.request));
            }
            yield fork(entryGetExtraOfList, resp.data.collection);
        }
    }
}

function* watchEntryUpvoteChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.upvote);
        const { entryId, entryTitle, gas, weight } = resp.request;
        if (resp.error) {
            yield put(actions.entryUpvoteError(resp.error, entryId, entryTitle));
        } else {
            const payload = [{
                extra: {
                    entryId,
                    entryTitle,
                    weight
                },
                gas,
                tx: resp.data.tx,
                type: actionTypes.upvote,
            }];
            yield put(transactionActions.transactionAddToQueue(payload));
            yield put(appActions.showNotification({
                id: 'upvotingEntry',
                values: { entryTitle },
                duration: 3000
            }));
        }
    }
}

function* watchEntryVoteCostChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.voteCost);
        if (resp.error) {
            yield put(actions.entryVoteCostError(resp.error));
        } else {
            yield put(actions.entryVoteCostSuccess(resp.data));
        }
    }
}

export function* registerEntryListeners () {
    yield fork(watchEntryCanClaimChannel);
    yield fork(watchEntryClaimChannel);
    yield fork(watchEntryDownvoteChannel);
    yield fork(watchEntryGetBalanceChannel);
    yield fork(watchEntryGetScoreChannel);
    yield fork(watchEntryGetVoteOfChannel);
    yield fork(watchEntryIsActiveChannel);
    yield fork(watchEntryNewestIteratorChannel);
    yield fork(watchEntryProfileIteratorChannel);
    yield fork(watchEntryStreamIteratorChannel);
    yield fork(watchEntryTagIteratorChannel);
    yield fork(watchEntryUpvoteChannel);
    yield fork(watchEntryVoteCostChannel);
}

export function* watchEntryActions () { // eslint-disable-line max-statements
    yield fork(watchEntryCanClaim);
    yield fork(watchEntryClaim);
    yield fork(watchEntryClaimSuccess);
    yield fork(watchEntryDownvote);
    yield fork(watchEntryDownvoteSuccess);
    yield fork(watchEntryGetBalance);
    yield fork(watchEntryGetFull);
    yield fork(watchEntryGetLatestVersion);
    yield fork(watchEntryGetScore);
    yield fork(watchEntryGetVoteOf);
    yield fork(watchEntryIsActive);
    yield fork(watchEntryMoreNewestIterator);
    yield fork(watchEntryMoreProfileIterator);
    yield fork(watchEntryMoreStreamIterator);
    yield fork(watchEntryMoreTagIterator);
    yield fork(watchEntryNewestIterator);
    yield fork(watchEntryProfileIterator);
    yield fork(watchEntryStreamIterator);
    yield fork(watchEntryTagIterator);
    yield fork(watchEntryUpvote);
    yield fork(watchEntryUpvoteSuccess);
    yield fork(watchEntryVoteCost);
}

export function* registerWatchers () {
    yield fork(registerEntryListeners);
    yield fork(watchEntryActions);
}
