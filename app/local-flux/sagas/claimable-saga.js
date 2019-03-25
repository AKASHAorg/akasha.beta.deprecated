// @flow
import { call, fork, put, select, takeEvery, delay } from 'redux-saga/effects';
import * as actions from '../actions/claimable-actions';
import * as entryActions from '../actions/entry-actions';
import * as types from '../constants';
import { externalProcessSelectors, profileSelectors, claimSelectors, entrySelectors } from '../selectors';
import * as claimableService from '../services/claimable-service';
import ChReqService from '../services/channel-request-service';
import { ENTRY_MODULE } from '@akashaproject/common/constants';

/*::
    import type { Saga } from 'redux-saga';
 */

const CLAIMABLE_LIMIT = 10;
const ENTRIES_LIMIT = 5;

function* claimableDeleteEntry ({ entryId }) /* : Saga<void> */ {
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    try {
        yield call([claimableService, claimableService.deleteEntry], { ethAddress, entryId });
        yield put(actions.claimableDeleteEntrySuccess({ entryId }));
    } catch (error) {
        yield put(actions.claimableDeleteEntryError(error));
    }
}

function* claimableGetEntries ({ more }) /* : Saga<void> */ {
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const offset = more ? yield select(claimSelectors.getClaimableEntriesCounter) : 0;
    yield delay(500);
    try {
        const data = yield call([claimableService, claimableService.getEntries], {
            ethAddress,
            limit: ENTRIES_LIMIT,
            offset
        });
        yield put(actions.claimableGetEntriesSuccess(data, { more, limit: ENTRIES_LIMIT }));
        yield fork(claimableGetEntriesData, data);
    } catch (error) {
        yield put(actions.claimableGetEntriesError(error, { more }));
    }
}

function* claimableGetEntriesData (data) /* : Saga<void> */ {
    let allEntries = [];
    let ownEntries = [];
    let voteEntries = [];
    data.forEach(claimableEntry => {
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
        const pendingEntries = yield select(state => entrySelectors.getPendingEntries(state, context));
        const isPending = pendingEntries && pendingEntries.get(allEntries[i]);
        const entry = yield select(state => entrySelectors.selectEntryById(state, allEntries[i]));
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

function* claimableGetStatus () /* : Saga<void> */ {
    const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
    try {
        const status = yield call([claimableService, claimableService.getStatus], loggedEthAddress);
        return status;
    } catch (error) {
        yield put(actions.claimableGetStatusError({ error }));
    }
}

function* claimableIterator (data) /* : Saga<void> */ {
    const status = (yield call(claimableGetStatus)) || {};
    const { newestBlock, oldestBlock, newestIndex, oldestIndex } = status;
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    // whoooohw... :(
    // while (!(yield select(externalProcessSelectors.getCurrentBlockNumber))) {
    //     yield call([reduxSaga, reduxSaga.delay], 1000);
    // }

    if (oldestBlock === 0) {
        yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.myVotesIterator, {
            ethAddress,
            toBlock: newestBlock,
            lastIndex: newestIndex,
            limit: CLAIMABLE_LIMIT,
            reversed: true,
            reqId: data.reqId
        });
    } else {
        const toBlock = oldestBlock || (yield select(externalProcessSelectors.getCurrentBlockNumber));
        yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.myVotesIterator, {
            ethAddress,
            toBlock,
            lastIndex: oldestIndex,
            limit: CLAIMABLE_LIMIT,
            reqId: data.reqId
        });
    }
}

export function* watchClaimableActions () /* : Saga<void> */ {
    yield takeEvery(types.CLAIMABLE_DELETE_ENTRY, claimableDeleteEntry);
    yield takeEvery(types.CLAIMABLE_GET_ENTRIES, claimableGetEntries);
    yield takeEvery(types.CLAIMABLE_ITERATOR, claimableIterator);
}
