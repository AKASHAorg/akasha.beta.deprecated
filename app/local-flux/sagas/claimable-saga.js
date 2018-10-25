// @flow
import * as reduxSaga from 'redux-saga';
import { apply, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actions from '../actions/claimable-actions';
import * as entryActions from '../actions/entry-actions';
import * as types from '../constants';
import { selectBlockNumber, selectClaimableOffset, selectLoggedEthAddress,
    selectPendingEntries, 
    selectEntry} from '../selectors';
import * as claimableService from '../services/claimable-service';

const CLAIMABLE_LIMIT = 10;
const ENTRIES_LIMIT = 5;

function* claimableDeleteEntry ({ entryId }) {
    const ethAddress = yield select(selectLoggedEthAddress);
    try {
        yield call([claimableService, claimableService.deleteEntry], { ethAddress, entryId });
        yield put(actions.claimableDeleteEntrySuccess({ entryId }));
    } catch (error) {
        yield put(actions.claimableDeleteEntryError(error));
    }
}

function* claimableGetEntries ({ more }) {
    const ethAddress = yield select(selectLoggedEthAddress);
    const offset = more ? yield select(selectClaimableOffset) : 0;
    yield call([reduxSaga, reduxSaga.delay], 500);    
    try {
        const data = yield call(
            [claimableService, claimableService.getEntries],
            { ethAddress, limit: ENTRIES_LIMIT, offset }
        );
        yield put(actions.claimableGetEntriesSuccess(data, { more, limit: ENTRIES_LIMIT }));
        yield fork(claimableGetEntriesData, data);
    } catch (error) {
        yield put(actions.claimableGetEntriesError(error, { more }));
    }
}

function* claimableGetEntriesData (data) {
    let allEntries = [];
    let ownEntries = [];
    let voteEntries = [];
    data.forEach((claimableEntry) => {
        const entryId = claimableEntry.entryId;
        allEntries.push(entryId);
        if (claimableEntry.isVote) {
            voteEntries.push(entryId);
        } else {
            ownEntries.push(entryId);
        }
    });
    for (let i = 0; i < allEntries.length; i++) {
        const context = 'claimable';
        const pendingEntries = yield select(state => selectPendingEntries(state, context));
        const isPending = pendingEntries && pendingEntries.get(allEntries[i]);
        const entry = yield select(state => selectEntry(state, allEntries[i]));
        if (!isPending && !entry) {
            yield put(entryActions.entryGetShort({ context, entryId: allEntries[i] }));
        } else {
            yield put(actions.claimableDeleteLoading(allEntries[i]));
        }
    }
    if (ownEntries.length) {
        yield put(entryActions.entryCanClaim(ownEntries));
        yield put(entryActions.entryGetBalance(ownEntries, true));
    }
    if (voteEntries.length) {
        yield put(entryActions.entryCanClaimVote(voteEntries));
        yield put(entryActions.entryGetVoteOf(voteEntries, true));        
    }
}

function* claimableGetStatus () {
    const loggedEthAddress = yield select(selectLoggedEthAddress);
    try {
        const status = yield call([claimableService, claimableService.getStatus], loggedEthAddress);
        return status;
    } catch (error) {
        console.error(error);
        yield put(actions.claimableGetStatusError({ error }));
    }
}

function* claimableIterator () {
    // const channel = Channel.server.entry.myVotesIterator;
    const status = (yield call(claimableGetStatus)) || {};
    const { newestBlock, oldestBlock, newestIndex, oldestIndex } = status;
    const ethAddress = yield select(selectLoggedEthAddress);

    while (!(yield select(selectBlockNumber))) {
        yield call([reduxSaga, reduxSaga.delay], 1000);
    }
    // yield call(enableChannel, channel, Channel.client.entry.manager);
    if (oldestBlock === 0) {
        // yield apply(
        //     channel,
        //     channel.send,
        //     [{ ethAddress, toBlock: newestBlock, lastIndex: newestIndex, limit: CLAIMABLE_LIMIT, reversed: true }]
        // );
    } else {
        const toBlock = oldestBlock || (yield select(selectBlockNumber));
        // yield apply(
        //     channel,
        //     channel.send,
        //     [{ ethAddress, toBlock, lastIndex: oldestIndex, limit: CLAIMABLE_LIMIT }]
        // );
    }
}

function* claimableSaveEntries ({ data, request }) {
    try {
        const newStatus = yield apply(claimableService, claimableService.saveEntries, [data, request]);
        return newStatus;
    } catch (error) {
        yield put(actions.claimableSaveEntriesError(error));
    }
}

// function* watchClaimableIteratorChannel () {
//     while (true) {
//         const resp = yield take(actionChannels.entry.myVotesIterator);
//         const { ethAddress, limit, reversed } = resp.request;
//         const loggedEthAddress = yield select(selectLoggedEthAddress);        
//         if (resp.error) {
//             yield put(actions.claimableIteratorError(resp.error));
//         } else if (loggedEthAddress === ethAddress) {
//             const status = yield call(claimableSaveEntries, { data: resp.data, request: resp.request });
//             const syncedNormal = status.oldestBlock === 0;
//             const syncedReversed = reversed && resp.data.collection.length !== limit;
//             if (!syncedNormal || !syncedReversed) {
//                 yield apply(reduxSaga, reduxSaga.delay, [1000]);
//                 yield call(claimableIterator);
//             }
//         }
//     }
// }

// $FlowFixMe
export function* watchClaimableActions () { //$FlowFixMe
    yield takeEvery(types.CLAIMABLE_DELETE_ENTRY, claimableDeleteEntry);// $FlowFixMe
    yield takeEvery(types.CLAIMABLE_GET_ENTRIES, claimableGetEntries);// $FlowFixMe
    yield takeEvery(types.CLAIMABLE_ITERATOR, claimableIterator);// $FlowFixMe
}
