import { apply, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/entry-actions';
import * as types from '../constants';
import { selectColumnLastEntry, selectColumnLastBlock } from '../selectors';

const Channel = global.Channel;
const ALL_STREAM_LIMIT = 11;
const ENTRY_ITERATOR_LIMIT = 6;

function* entryGetExtraOfList ({ entries }) {
    const getVoteOf = Channel.server.entry.getVoteOf;
    const getEntryBalance = Channel.server.entry.getEntryBalance;
    const canClaim = Channel.server.entry.canClaim;
    yield [
        call(enableChannel, getVoteOf, Channel.client.entry.manager),
        call(enableChannel, getEntryBalance, Channel.client.entry.manager),
        call(enableChannel, canClaim, Channel.client.entry.manager)
    ];
    const akashaId = yield select(state => state.profileState.getIn(['loggedProfile', 'akashaId']));
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        yield apply(getVoteOf, getVoteOf.send, [{ akashaId, entryId: entry.entryId }]);
        const isOwnEntry = entry.entryEth && entry.entryEth.publisher &&
            akashaId === entry.entryEth.publisher.akashaId;
        if (isOwnEntry) {
            yield apply(getEntryBalance, getEntryBalance.send, [{ entryId: entry.entryId }]);
            yield apply(canClaim, canClaim.send, [{ entryId: entry.entryId }]);
        }
    }
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

function* entryVoteCost () {
    const channel = Channel.server.entry.voteCost;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    for (let i = 1; i <= 10; i++) {
        yield apply(channel, channel.send, [{ weight: i }]);
    }
}

// Action watchers

function* watchEntryGetVoteOfList () {
    yield takeEvery(types.ENTRY_GET_EXTRA_OF_LIST, entryGetExtraOfList);
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

function* watchEntryNewestIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.allStreamIterator);
        if (resp.error) {
            if (resp.request && resp.request.toBlock) {
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
            yield put(actions.entryGetExtraOfList(resp.data.collection));
        }
    }
}


function* watchEntryProfileIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.entryProfileIterator);
        if (resp.error) {
            if (resp.request && resp.request.start) {
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
            yield put(actions.entryGetExtraOfList(resp.data.collection));
        }
    }
}

function* watchEntryStreamIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.followingStreamIterator);
        if (resp.error) {
            if (resp.request && resp.request.toBlock) {
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
            yield put(actions.entryGetExtraOfList(resp.data.collection));
        }
    }
}

function* watchEntryTagIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.entry.entryTagIterator);
        if (resp.error) {
            if (resp.request && resp.request.start) {
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
            yield put(actions.entryGetExtraOfList(resp.data.collection));
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
    yield fork(watchEntryGetBalanceChannel);
    yield fork(watchEntryGetVoteOfChannel);
    yield fork(watchEntryNewestIteratorChannel);
    yield fork(watchEntryProfileIteratorChannel);
    yield fork(watchEntryStreamIteratorChannel);
    yield fork(watchEntryTagIteratorChannel);
    yield fork(watchEntryVoteCostChannel);
}

export function* watchEntryActions () {
    yield fork(watchEntryGetVoteOfList);
    yield fork(watchEntryMoreNewestIterator);
    yield fork(watchEntryMoreProfileIterator);
    yield fork(watchEntryMoreStreamIterator);
    yield fork(watchEntryMoreTagIterator);
    yield fork(watchEntryNewestIterator);
    yield fork(watchEntryProfileIterator);
    yield fork(watchEntryStreamIterator);
    yield fork(watchEntryTagIterator);
    yield fork(watchEntryVoteCost);
}

export function* registerWatchers () {
    yield fork(registerEntryListeners);
    yield fork(watchEntryActions);
}
