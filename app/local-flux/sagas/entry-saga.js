import { all, apply, call, fork, put, select, take, takeEvery,
    takeLatest } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actionActions from '../actions/action-actions';
import * as appActions from '../actions/app-actions';
import * as actions from '../actions/entry-actions';
import * as draftActions from '../actions/draft-actions';
import * as profileActions from '../actions/profile-actions';
import * as types from '../constants';
import { selectBlockNumber, selectColumnLastBlock, selectEntry, selectFullEntry,
    selectIsFollower, selectListNextEntries, selectLoggedEthAddress, selectToken } from '../selectors';
import * as actionStatus from '../../constants/action-status';

const { Channel } = global;
const ALL_STREAM_LIMIT = 6;
const ENTRY_ITERATOR_LIMIT = 6;
const ENTRY_LIST_ITERATOR_LIMIT = 10;

function* enableExtraChannels () {
    const { canClaim, getEntryBalance, getVoteOf } = Channel.server.entry;
    yield all([
        call(enableChannel, getVoteOf, Channel.client.entry.manager),
        call(enableChannel, getEntryBalance, Channel.client.entry.manager),
        call(enableChannel, canClaim, Channel.client.entry.manager),
    ]);
}

function* entryCanClaim ({ entryId }) {
    const channel = Channel.server.entry.canClaim;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId: [entryId] }]);
}

function* entryClaim ({ actionId, entryId, entryTitle }) {
    const channel = Channel.server.entry.claim;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ actionId, token, entryId, entryTitle }]);
}

function* entryClaimSuccess ({ data }) {
    const { entryId } = data;
    yield put(actions.entryCanClaim(entryId));
    yield put(actions.entryGetBalance(entryId));
    yield put(appActions.showNotification({
        id: 'claimSuccess',
        values: { entryTitle: data.entryTitle }
    }));
}

function* entryDownvote ({ actionId, entryId, entryTitle, ethAddress, weight, value }) {
    const channel = Channel.server.entry.downvote;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const token = yield select(selectToken);
    yield apply(
        channel,
        channel.send,
        [{ actionId, token, entryId, entryTitle, ethAddress, weight, value }]
    );
}

function* entryDownvoteSuccess ({ data }) {
    yield call(entryVoteSuccess, data.entryId); // eslint-disable-line no-use-before-define
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

function* entryGetExtraOfEntry (entryId, ethAddress) {
    const { canClaim, getEntryBalance, getVoteOf } = Channel.server.entry;
    yield call(enableExtraChannels);
    const loggedEthAddress = yield select(selectLoggedEthAddress);
    const isOwnEntry = ethAddress && loggedEthAddress === ethAddress;
    yield apply(getVoteOf, getVoteOf.send, [[{ ethAddress: loggedEthAddress, entryId }]]);
    if (isOwnEntry) {
        yield apply(getEntryBalance, getEntryBalance.send, [{ entryId: [entryId] }]);
        yield apply(canClaim, canClaim.send, [{ entryId: [entryId] }]);
    } else {
        const isFollower = yield select(state => selectIsFollower(state, ethAddress));
        if (isFollower === undefined) {
            yield put(profileActions.profileIsFollower([ethAddress]));
        }
    }
}

export function* entryGetExtraOfList (collection, limit, columnId, asDrafts) { // eslint-disable-line
    // requests are made for n+1 entries, but the last one
    // should be ignored if the limit is fulfilled
    const entries = collection.length === limit ?
        collection.slice(0, -1) :
        collection;
    const { canClaim, getEntryBalance, getVoteOf } = Channel.server.entry;
    yield call(enableExtraChannels);
    const loggedEthAddress = yield select(selectLoggedEthAddress);
    const allEntries = [];
    const ownEntries = [];
    const ethAddresses = [];
    entries.forEach((entry) => {
        const { ethAddress } = entry.author;
        allEntries.push({ ethAddress: loggedEthAddress, entryId: entry.entryId });
        if (ethAddress && !ethAddresses.includes(ethAddress)) {
            ethAddresses.push(ethAddress);
        }
        if (ethAddress && loggedEthAddress === ethAddress) {
            ownEntries.push(entry.entryId);
        }
    });
    // yield put(actions.entryResolveIpfsHash({
    //     ipfsHash: entryIpfsHashes,
    //     columnId,
    //     entryIds,
    //     asDrafts
    // }));
    // yield put(profileActions.profileResolveIpfsHash(profileIpfsHashes, columnId, ethAddresses));
    yield put(profileActions.profileIsFollower(ethAddresses));
    yield apply(getVoteOf, getVoteOf.send, [allEntries]);
    if (ownEntries.length) {
        yield apply(getEntryBalance, getEntryBalance.send, [ownEntries]);
        yield apply(canClaim, canClaim.send, [{ entryId: ownEntries }]);
    }
    for (let i = 0; i < ethAddresses.length; i++) {
        yield put(profileActions.profileGetData({ ethAddress: ethAddresses[i] }));
    }
    for (let i = 0; i < entries.length; i++) {
        const { author, entryId } = entries[i];
        yield put(actions.entryGetShort({ entryId, ethAddress: author.ethAddress, context: columnId }));
    }
}

function* entryGetFull ({ akashaId, entryId, ethAddress, version, asDraft }) {
    // yield fork(watchEntryGetChannel); // eslint-disable-line no-use-before-define
    const channel = Channel.server.entry.getEntry;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ akashaId, entryId, ethAddress, full: true, version, asDraft }]);
    yield put(profileActions.profileGetData({ ethAddress }));
}

function* entryGetLatestVersion ({ entryId }) {
    // yield fork(watchEntryGetChannel); // eslint-disable-line no-use-before-define
    const channel = Channel.server.entry.getEntry;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId, full: true, latestVersion: true }]);
}

function* entryGetScore ({ entryId }) {
    const channel = Channel.server.entry.getScore;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryId }]);
}

function* entryGetShort ({ context, entryId, ethAddress }) {
    const channel = Channel.server.entry.getEntry;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ context, entryId, ethAddress }]);
}

function* entryGetVoteOf ({ entryId }) {
    const channel = Channel.server.entry.getVoteOf;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const ethAddress = yield select(selectLoggedEthAddress);
    yield apply(channel, channel.send, [[{ ethAddress, entryId }]]);
}

function* entryListIterator ({ name }) {
    const channel = Channel.server.entry.getEntryList;
    const entryIds = yield select(state => selectListNextEntries(state, name, ENTRY_LIST_ITERATOR_LIMIT));
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield apply(channel, channel.send, [{ entryIds, listName: name }]);
}

function* entryMoreNewestIterator ({ columnId }) {
    const channel = Channel.server.entry.allStreamIterator;
    const toBlock = yield select(state => selectColumnLastBlock(state, columnId)) - 1;
    yield apply(
        channel,
        channel.send,
        [{ columnId, limit: ALL_STREAM_LIMIT, toBlock, more: true }]
    );
}

function* entryMoreProfileIterator ({ columnId, ethAddress }) {
    const channel = Channel.server.entry.entryProfileIterator;
    const toBlock = yield select(state => selectColumnLastBlock(state, columnId)) - 1;
    yield apply(
        channel,
        channel.send,
        [{ columnId, ethAddress, limit: ENTRY_ITERATOR_LIMIT, toBlock, more: true }]
    );
}

function* entryMoreStreamIterator ({ columnId }) {
    const channel = Channel.server.entry.followingStreamIterator;
    const toBlock = yield select(state => selectColumnLastBlock(state, columnId)) - 1;
    yield apply(channel, channel.send, [{ columnId, limit: ENTRY_ITERATOR_LIMIT, toBlock, more: true }]);
}

function* entryMoreTagIterator ({ columnId, tagName }) {
    const channel = Channel.server.entry.entryTagIterator;
    const toBlock = yield select(state => selectColumnLastBlock(state, columnId)) - 1;
    yield apply(
        channel,
        channel.send,
        [{ columnId, limit: ENTRY_ITERATOR_LIMIT, toBlock, tagName, more: true }]
    );
}

function* entryNewestIterator ({ columnId }) {
    const channel = Channel.server.entry.allStreamIterator;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const toBlock = yield select(selectBlockNumber);
    yield apply(channel, channel.send, [{ columnId, limit: ALL_STREAM_LIMIT, toBlock }]);
}

function* entryProfileIterator ({ columnId, ethAddress, limit = ENTRY_ITERATOR_LIMIT, asDrafts }) {
    const channel = Channel.server.entry.entryProfileIterator;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const toBlock = yield select(selectBlockNumber);
    yield apply(channel, channel.send, [{ columnId, limit, ethAddress, asDrafts, toBlock }]);
}

function* entryStreamIterator ({ columnId }) {
    const channel = Channel.server.entry.followingStreamIterator;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const toBlock = yield select(selectBlockNumber);
    yield apply(channel, channel.send, [{ columnId, limit: ENTRY_ITERATOR_LIMIT, toBlock }]);
}

function* entryTagIterator ({ columnId, tagName }) {
    const channel = Channel.server.entry.entryTagIterator;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const toBlock = yield select(selectBlockNumber);
    yield apply(channel, channel.send, [{ columnId, limit: ENTRY_ITERATOR_LIMIT, tagName, toBlock }]);
}

function* entryVoteSuccess (entryId) {
    const loggedEthAddress = yield select(selectLoggedEthAddress);
    let entry = yield select(state => selectEntry(state, entryId));
    const fullEntry = yield select(selectFullEntry);
    if (!entry && fullEntry && fullEntry.get('entryId') === entryId) {
        entry = fullEntry;
    }
    const authorEthAddress = entry && entry.getIn(['author', 'ethAddress']);
    if (authorEthAddress && authorEthAddress === loggedEthAddress) {
        yield put(actions.entryCanClaim(entryId));
        yield put(actions.entryGetBalance(entryId));
    }
    yield put(actions.entryGetScore(entryId));
    yield put(actions.entryGetVoteOf(entryId));
}

function* entryUpvote ({ actionId, entryId, entryTitle, ethAddress, weight, value }) {
    const channel = Channel.server.entry.upvote;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const token = yield select(selectToken);
    yield apply(
        channel,
        channel.send,
        [{ actionId, token, entryId, entryTitle, ethAddress, weight, value }]
    );
}

function* entryUpvoteSuccess ({ data }) {
    yield call(entryVoteSuccess, data.entryId);
    yield put(appActions.showNotification({
        id: 'upvoteEntrySuccess',
        values: { entryTitle: data.entryTitle }
    }));
}

function* entryVoteCost () {
    const channel = Channel.server.entry.voteCost;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    yield apply(channel, channel.send, [weights]);
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
        const { actionId, entryId, entryTitle } = resp.request;
        if (resp.error) {
            yield put(actions.entryClaimError(resp.error, entryId, entryTitle));
            yield put(actionActions.actionDelete(actionId));
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
        }
    }
}

function* watchEntryDownvoteChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.downvote);
        const { actionId, entryId, entryTitle } = resp.request;
        if (resp.error) {
            yield put(actions.entryDownvoteError(resp.error, entryId, entryTitle));
            yield put(actionActions.actionDelete(actionId));
        } else if (resp.data.receipt) {
            yield put(actionActions.actionPublished(resp.data.receipt));
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
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
    while (true) {
        const resp = yield take(actionChannels.entry.getEntry);
        if (resp.error) {
            if (resp.request.asDraft) {
                yield put(actions.entryGetFullAsDraftError(resp.error));
            } else if (resp.request.latestVersion) {
                yield put(actions.entryGetLatestVersionError(resp.error));
            } else if (resp.request.full) {
                yield put(actions.entryGetFullError(resp.error));
            } else {
                yield put(actions.entryGetShortError(resp.error, resp.request));
            }
        } else if (resp.request.asDraft) {
            yield put(actions.entryGetFullAsDraftSuccess(resp.data));
        } else if (resp.request.latestVersion) {
            // TODO Use getLatestEntryVersion channel
            const { content } = resp.data;
            yield put(actions.entryGetLatestVersionSuccess(content && content.version));
        } else if (resp.request.full) {
            yield put(actions.entryGetFullSuccess(resp.data, resp.request));
            yield fork(entryGetExtraOfEntry, resp.request.entryId, resp.request.ethAddress);
        } else {
            yield put(actions.entryGetShortSuccess(resp.data, resp.request));
        }
    }
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

function* watchEntryListIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.getEntryList);
        if (resp.error) {
            yield put(actions.entryListIteratorError(resp.error));
        } else {
            yield put(actions.entryListIteratorSuccess(resp.data, resp.request));
        }
        const { listName } = resp.request;
        yield fork(entryGetExtraOfList, resp.data.collection, null, listName);
    }
}

function* watchEntryNewestIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.allStreamIterator);
        if (resp.error) {
            if (resp.request.more) {
                yield put(actions.entryMoreNewestIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.entryNewestIteratorError(resp.error, resp.request));
            }
        } else {
            const { columnId, limit } = resp.request;
            yield fork(entryGetExtraOfList, resp.data.collection, limit, columnId);
            if (resp.request.more) {
                yield put(actions.entryMoreNewestIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.entryNewestIteratorSuccess(resp.data, resp.request));
            }
        }
    }
}

function* watchEntryProfileIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.entryProfileIterator);
        const { columnId, limit, asDrafts } = resp.request;
        if (resp.error) {
            if (resp.request.more) {
                yield put(actions.entryMoreProfileIteratorError(resp.error, resp.request));
            } else if (resp.request.asDrafts) {
                yield put(draftActions.entriesGetAsDraftsError(resp.error, resp.request));
            } else {
                yield put(actions.entryProfileIteratorError(resp.error, resp.request));
            }
        } else if (resp.request.more) {
            yield fork(entryGetExtraOfList, resp.data.collection, limit, columnId, asDrafts);
            yield put(actions.entryMoreProfileIteratorSuccess(resp.data, resp.request));
        } else if (resp.request.asDrafts) {
            yield put(draftActions.entriesGetAsDraftsSuccess(resp.data, resp.request));
            const reqObj = resp.data.collection.map(entry => ({
                ipfsHash: [entry.entryEth.ipfsHash],
                entryIds: [entry.entryId]
            })).reduce((prev, curr) => ({
                ipfsHash: prev.ipfsHash.concat(curr.ipfsHash),
                entryIds: prev.entryIds.concat(curr.entryIds),
                columnId: null,
                asDrafts: true,
                full: true,
            }));
            // yield put(actions.entryResolveIpfsHash(reqObj));
        } else {
            yield fork(entryGetExtraOfList, resp.data.collection, limit, columnId, asDrafts);
            yield put(actions.entryProfileIteratorSuccess(resp.data, resp.request));
        }
    }
}

function* watchEntryStreamIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.followingStreamIterator);
        if (resp.error) {
            if (resp.request.more) {
                yield put(actions.entryMoreStreamIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.entryStreamIteratorError(resp.error, resp.request));
            }
        } else {
            const { columnId, limit } = resp.request;
            yield fork(entryGetExtraOfList, resp.data.collection, limit, columnId);
            if (resp.data.more) {
                yield put(actions.entryMoreStreamIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.entryStreamIteratorSuccess(resp.data, resp.request));
            }
        }
    }
}

function* watchEntryTagIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.entryTagIterator);
        if (resp.error) {
            if (resp.request.more) {
                yield put(actions.entryMoreTagIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.entryTagIteratorError(resp.error, resp.request));
            }
        } else {
            const { columnId, limit } = resp.request;
            yield fork(entryGetExtraOfList, resp.data.collection, limit, columnId);
            if (resp.request.more) {
                yield put(actions.entryMoreTagIteratorSuccess(resp.data, resp.request));
            } else {
                yield put(actions.entryTagIteratorSuccess(resp.data, resp.request));
            }
        }
    }
}

function* watchEntryUpvoteChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.upvote);
        const { actionId, entryId, entryTitle } = resp.request;
        if (resp.error) {
            yield put(actions.entryUpvoteError(resp.error, entryId, entryTitle));
            yield put(actionActions.actionDelete(actionId));
        } else if (resp.data.receipt) {
            yield put(actionActions.actionPublished(resp.data.receipt));
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
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
    yield fork(watchEntryGetChannel);
    yield fork(watchEntryGetScoreChannel);
    yield fork(watchEntryGetVoteOfChannel);
    yield fork(watchEntryListIteratorChannel);
    yield fork(watchEntryNewestIteratorChannel);
    yield fork(watchEntryProfileIteratorChannel);
    yield fork(watchEntryStreamIteratorChannel);
    yield fork(watchEntryTagIteratorChannel);
    yield fork(watchEntryUpvoteChannel);
    yield fork(watchEntryVoteCostChannel);
}

export function* watchEntryActions () { // eslint-disable-line max-statements
    yield takeEvery(types.ENTRY_CAN_CLAIM, entryCanClaim);
    yield takeEvery(types.ENTRY_CLAIM, entryClaim);
    yield takeEvery(types.ENTRY_CLAIM_SUCCESS, entryClaimSuccess);
    yield takeEvery(types.ENTRY_DOWNVOTE, entryDownvote);
    yield takeEvery(types.ENTRY_DOWNVOTE_SUCCESS, entryDownvoteSuccess);
    yield takeEvery(types.ENTRY_GET_BALANCE, entryGetBalance);
    yield takeLatest(types.ENTRY_GET_FULL, entryGetFull);
    yield takeLatest(types.ENTRY_GET_LATEST_VERSION, entryGetLatestVersion);
    yield takeEvery(types.ENTRY_GET_SCORE, entryGetScore);
    yield takeEvery(types.ENTRY_GET_SHORT, entryGetShort);
    yield takeEvery(types.ENTRY_GET_VOTE_OF, entryGetVoteOf);
    yield takeEvery(types.ENTRY_LIST_ITERATOR, entryListIterator);
    yield takeEvery(types.ENTRY_MORE_NEWEST_ITERATOR, entryMoreNewestIterator);
    yield takeEvery(types.ENTRY_MORE_PROFILE_ITERATOR, entryMoreProfileIterator);
    yield takeEvery(types.ENTRY_MORE_STREAM_ITERATOR, entryMoreStreamIterator);
    yield takeEvery(types.ENTRY_MORE_TAG_ITERATOR, entryMoreTagIterator);
    yield takeEvery(types.ENTRY_NEWEST_ITERATOR, entryNewestIterator);
    yield takeEvery(types.ENTRY_PROFILE_ITERATOR, entryProfileIterator);
    yield takeEvery(types.ENTRY_STREAM_ITERATOR, entryStreamIterator);
    yield takeEvery(types.ENTRY_TAG_ITERATOR, entryTagIterator);
    yield takeEvery(types.ENTRY_UPVOTE, entryUpvote);
    yield takeEvery(types.ENTRY_UPVOTE_SUCCESS, entryUpvoteSuccess);
    yield takeEvery(types.ENTRY_VOTE_COST, entryVoteCost);
}

export function* registerWatchers () {
    yield fork(registerEntryListeners);
    yield fork(watchEntryActions);
}
