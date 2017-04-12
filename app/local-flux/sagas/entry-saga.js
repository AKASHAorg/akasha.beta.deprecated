import { apply, call, fork, put, take, takeLatest } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/entry-actions';
import * as types from '../constants';

const Channel = global.Channel;

function* entryVoteCost () {
    const channel = Channel.server.entry.voteCost;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    for (let i = 1; i <= 10; i++) {
        yield apply(channel, channel.send, [{ weight: i }]);
    }
}

// Action watchers

function* watchEntryVoteCost () {
    yield takeLatest(types.ENTRY_VOTE_COST, entryVoteCost);
}

// Channel watchers

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
    yield fork(watchEntryVoteCostChannel);
}

export function* watchEntryActions () {
    yield fork(watchEntryVoteCost);
}

export function* registerWatchers () {
    yield fork(registerEntryListeners);
    yield fork(watchEntryActions);
}
