// @flow
import { all, apply, call, put, select, takeEvery,
    takeLatest } from 'redux-saga/effects';
// import * as actionActions from '../actions/action-actions';
// import * as appActions from '../actions/app-actions';
import * as actions from '../actions/entry-actions';
// import * as claimableActions from '../actions/claimable-actions';
import * as profileActions from '../actions/profile-actions';
import * as tagActions from '../actions/tag-actions';
// import * as types from '../constants';
import { profileSelectors, externalProcessSelectors, dashboardSelectors, entrySelectors, draftSelectors,
    listSelectors } from '../selectors';
import { isEthAddress } from '../../utils/dataModule';
import ChReqService from '../services/channel-request-service';
import { ENTRY_MODULE } from '@akashaproject/common/constants';

/*::
    import type { Saga } from 'redux-saga'; // eslint-disable-line
 */

const ALL_STREAM_LIMIT = 3;
const ITERATOR_LIMIT = 3;
const ENTRY_LIST_ITERATOR_LIMIT = 3;

/* eslint-disable no-use-before-define */

function* entryCanClaim ({ entryIds })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.canClaim, {
            entryId: entryIds
        }
    )
}

function* entryCanClaimVote ({ entryIds })/* : Saga<void> */ {
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.canClaimVote, {
            entries: entryIds,
            ethAddress
        }
    );
}

function* entryClaim ({ actionId, entryId, entryTitle })/* : Saga<void> */ {
    const token = yield select(profileSelectors.getToken);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.claim, {
            actionId, token, entryId, entryTitle
        }
    );
}

// function* entryClaimSuccess ({ data })/* : Saga<void> */ {
//     const { entryId } = data;
//     yield put(actions.entryCanClaim([entryId]));
//     yield put(actions.entryGetBalance([entryId]));
//     yield put(appActions.showNotification({
//         id: 'claimSuccess',
//         duration: 4,
//         values: { entryTitle: data.entryTitle }
//     }));
//     yield put(actionActions.actionUpdateClaim(data));
// }

function* entryClaimVote ({ actionId, entryId, entryTitle })/* : Saga<void> */ {
    const token = yield select(profileSelectors.getToken);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.claimVote, {
            actionId, token, entryId, entryTitle
        }
    );
}

// function* entryClaimVoteSuccess ({ data })/* : Saga<void> */ {
//     const { entryId } = data;
//     yield put(actions.entryCanClaimVote([entryId]));
//     yield put(actions.entryGetVoteOf([entryId]));
//     yield put(appActions.showNotification({
//         id: 'claimVoteSuccess',
//         duration: 4,
//         values: { entryTitle: data.entryTitle }
//     }));
//     yield put(actionActions.actionUpdateClaimVote(data));
// }

function* entryDownvote ({ actionId, entryId, entryTitle, ethAddress, weight, value })/* : Saga<void> */ {
    const token = yield select(profileSelectors.getToken);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.downvote, {
            actionId, token, entryId, entryTitle, ethAddress, weight, value
        }
    );
}

// function* entryDownvoteSuccess ({ data })/* : Saga<void> */ {
//     yield call(entryVoteSuccess, data.entryId); // eslint-disable-line no-use-before-define
//     yield put(appActions.showNotification({
//         id: 'downvoteEntrySuccess',
//         duration: 4,
//         values: { entryTitle: data.entryTitle }
//     }));
//     yield put(claimableActions.claimableIterator());
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         ENTRY_MODULE, ENTRY_MODULE.getVoteRatio, {
//             entryId: data.entryId
//         }
//     );
// }

function* entryGetBalance ({ entryIds, claimable })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.getEntryBalance, {
            list: entryIds, claimable
        }
    );
}

function* entryGetEndPeriod ({ entryIds })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.getVoteEndPeriod,
        entryIds
    );
}
// @todo refactor/remove this and use actions
// function* entryGetExtraOfEntry (entryId, ethAddress)/* : Saga<void> */ {
//     const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
//     const isOwnEntry = ethAddress && loggedEthAddress === ethAddress;
//     yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getVoteOf, {
//         list: [{ ethAddress: loggedEthAddress, entryId }]
//     });
//     yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getVoteRatio, {
//         entryId
//     });
//     if (isOwnEntry) {
//         yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getEntryBalance, {
//             list: [entryId]
//         });
//         yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.canClaim, {
//             entryId: [entryId]
//         });
//     } else {
//         const isFollower = yield select(state => profileSelectors.selectIsFollower(state, { ethAddress }));
//         if (isFollower === undefined) {
//             yield put(profileActions.profileIsFollower([ethAddress]));
//         }
//     }
// }
// @todo refactor/remove this. use actions!
export function* entryGetExtraOfList (collection, columnId, asDrafts, batching)/* : Saga<void> */ { // eslint-disable-line
    const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const allEntries = [];
    const ownEntries = [];
    const ethAddresses = [];
    collection.forEach((entry) => {
        const { ethAddress } = entry.author;
        allEntries.push({ ethAddress: loggedEthAddress, entryId: entry.entryId });
        if (!ethAddress) {
            console.error('entry with no author found', entry); //eslint-disable-line
        }
        if (ethAddress && !ethAddresses.includes(ethAddress)) {
            ethAddresses.push(ethAddress);
        }
        if (ethAddress && loggedEthAddress === ethAddress) {
            ownEntries.push(entry.entryId);
        }
    });

    if (ethAddresses.length) {
        yield put(profileActions.profileIsFollower(ethAddresses));
    }

    if (allEntries.length) {
        yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getVoteOf, {
            list: allEntries
        });
    }

    if (ownEntries.length) {
        yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getEntryBalance, {
            list: ownEntries
        });
        yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.canClaim, {
            entryId: ownEntries
        });
    }
    yield all([
        ...ethAddresses.map(ethAddress => put(profileActions.profileGetData({ ethAddress, batching }))),
        ...collection.map(entry => put(actions.entryGetShort({
            entryId: entry.entryId,
            ethAddress: entry.author.ethAddress,
            context: columnId,
            batching
        })))
    ]);
}

function* entryGetFull ({
    akashaId, entryId, ethAddress, version, asDraft, revert, publishedDateOnly, latestVersion
})/* : Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getEntry, {
        akashaId,
        entryId,
        ethAddress,
        full: true,
        version,
        asDraft,
        revert,
        publishedDateOnly,
        latestVersion
    });
    if (!asDraft && ethAddress) {
        yield put(profileActions.profileGetData({ ethAddress }));
    }
}

function* entryGetLatestVersion ({ entryId })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.getEntry, {
            entryId,
            full: true,
            latestVersion: true
        });
}

function* entryGetScore ({ entryId })/* : Saga<void> */ {
    yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getScore, {
        entryId
    });
}

// function* entryGetShort ({ context, entryId, ethAddress, batching, includeVotes })/* : Saga<void> */ {
//     yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getEntry, {
//         context, entryId, ethAddress, batching, includeVotes
//     });
// }

function* entryGetVoteOf ({ entryIds, claimable })/* : Saga<void> */ {
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const request = entryIds.map(id => ({ entryId: id, ethAddress }));
    yield call([ChReqService, ChReqService.sendRequest], ENTRY_MODULE, ENTRY_MODULE.getVoteOf, {
        list: request, claimable
    });
}

function* entryListIterator ({ column, batching })/* : Saga<void> */ {
    const { id, value, limit = ENTRY_LIST_ITERATOR_LIMIT } = column;
    const collection = yield select(state => listSelectors.getListEntries(state, { listId: value, limit }));
    yield call(entryGetExtraOfList, collection, id, null, batching);
    yield put(actions.entryListIteratorSuccess({ collection }, { columnId: id, value, limit }));
}

// function* entryMoreListIterator ({ column, batching })/* : Saga<void> */ {
//     const { value, id, limit = ENTRY_LIST_ITERATOR_LIMIT } = column;
//     const collection = yield select(state =>
//         listSelectors.selectListNextEntries(state, { listId: value, limit }));
//     yield call(entryGetExtraOfList, collection, id, null, batching);
//     yield put(actions.entryMoreListIteratorSuccess({ collection }, { columnId: id, value, limit }));
// }

// function* entryMoreNewestIterator ({ column, batching })/* : Saga<void> */ {
//     const { id, lastIndex, lastBlock } = column;
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         ENTRY_MODULE, ENTRY_MODULE.allStreamIterator,
//         {columnId: id, limit: ALL_STREAM_LIMIT, toBlock: lastBlock, lastIndex, more: true, batching}
//     );
// }

// function* entryMoreProfileIterator ({ column, batching })/* : Saga<void> */ {
//     const { id, itemsList, value } = column;
//     const isProfileEntries = id === 'profileEntries';
//     const toBlock = !isProfileEntries ?
//         yield select(state => dashboardSelectors.selectColumnLastBlock(state, { columnId: id })) :
//         yield select(state => entrySelectors.getProfileEntriesLastBlock(state, { ethAddress: value }));
//     const lastIndex = !isProfileEntries ?
//         yield select(state => dashboardSelectors.selectColumnLastIndex(state, { columnId: id })) :
//         yield select(state => entrySelectors.getProfileEntriesLastIndex(state, { ethAddress: value }));
//     let akashaId, ethAddress; // eslint-disable-line
//     if (isEthAddress(value)) {
//         ethAddress = value;
//     } else {
//         akashaId = value;
//     }
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         ENTRY_MODULE, ENTRY_MODULE.entryProfileIterator,
//         {
//             columnId: id,
//             ethAddress, akashaId, limit: ITERATOR_LIMIT, toBlock, lastIndex,
//             totalLoaded: itemsList.size,
//             more: true,
//             batching
//         }
//     );
// }

// function* entryMoreStreamIterator ({ column, batching })/* : Saga<void> */ {
//     const { lastBlock, lastIndex, id } = column;
//     const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         ENTRY_MODULE, ENTRY_MODULE.followingStreamIterator,
//         {
//             columnId: id,
//             ethAddress,
//             limit: ITERATOR_LIMIT,
//             toBlock: lastBlock,
//             lastIndex,
//             more: true,
//             batching
//         }
//     );
// }

// function* entryMoreTagIterator ({ column, batching })/* : Saga<void> */ {
//     const { id, value, lastBlock, lastIndex } = column;
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         ENTRY_MODULE, ENTRY_MODULE.entryTagIterator,
//         {
//             columnId: id,
//             limit: ITERATOR_LIMIT,
//             toBlock: lastBlock,
//             lastIndex,
//             tagName: value,
//             more: true,
//             batching
//         }
//     );
// }

// function* entryNewestIterator ({ column, batching })/* : Saga<void> */ {
//     const { id, firstBlock, firstIndex, reversed } = column;
//     const toBlock = reversed ? firstBlock : yield select(externalProcessSelectors.getBlockNumber);
//     const lastIndex = reversed ? firstIndex : 0;
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         ENTRY_MODULE, ENTRY_MODULE.allStreamIterator,
//         {
//             columnId: id,
//             limit: ALL_STREAM_LIMIT,
//             reversed,
//             toBlock,
//             lastIndex,
//             batching
//         }
//     );
// }

function* entryProfileIterator ({ column, batching })/* : Saga<void> */ {
    const { id, value, asDrafts, reversed, limit = ITERATOR_LIMIT, entryType, firstIndex } = column;
    if (value && !isEthAddress(value)) {
        yield put(profileActions.profileExists(value));
    }
    let akashaId, ethAddress, lastIndex, toBlock, totalLoaded; // eslint-disable-line
    if (asDrafts) {
        toBlock = (yield select(draftSelectors.getDraftsLastBlock)) ||
            (yield select(externalProcessSelectors.getBlockNumber));
        lastIndex = yield select(draftSelectors.getDraftsLastIndex);
        totalLoaded = yield select(draftSelectors.getDraftsTotalLoaded);
    } else {
        toBlock = reversed ?
            yield select(state => dashboardSelectors.selectColumnFirstBlock(state, { columnId: id })) :
            yield select(externalProcessSelectors.getBlockNumber);
        lastIndex = reversed ? firstIndex : column.lastIndex;
    }
    if (isEthAddress(value)) {
        ethAddress = value;
    } else {
        akashaId = value;
    }
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.entryProfileIterator,
        {
            columnId: id, limit, akashaId,
            ethAddress, asDrafts, toBlock, reversed,
            lastIndex, entryType, totalLoaded, batching
        }
    );
}

function* entryResolveIpfsHash ({ entryId, ipfsHash })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.resolveEntriesIpfsHash,
        { ipfsHash: [ipfsHash], entryId, full: true }
    );
}

function* entryStreamIterator ({ column, batching })/* : Saga<void> */ {
    const { id, reversed, firstIndex } = column;
    const toBlock = reversed ?
        yield select(state => dashboardSelectors.selectColumnFirstBlock(state, id)) :
        yield select(externalProcessSelectors.getBlockNumber);
    const lastIndex = reversed ? firstIndex : column.lastIndex;
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.followingStreamIterator,
        {
            columnId: id,
            ethAddress,
            limit: ITERATOR_LIMIT,
            toBlock,
            lastIndex,
            reversed,
            batching
        }
    );
}

function* entryTagIterator ({ column, batching })/* : Saga<void> */ {
    const { id, value, reversed, firstBlock, firstIndex } = column;
    yield put(tagActions.tagExists({ tagName: value }));
    const toBlock = reversed ?
        firstBlock :
        yield select(externalProcessSelectors.getBlockNumber);
    const lastIndex = reversed ? firstIndex : column.lastIndex;
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.entryTagIterator,
        {
            columnId: id,
            limit: ITERATOR_LIMIT,
            tagName: value,
            toBlock,
            lastIndex,
            reversed,
            batching
        }
    );
}

// function* entryVoteSuccess (entryId)/* : Saga<void> */ {
//     yield put(actions.entryGetScore(entryId));
//     yield put(actions.entryGetVoteOf([entryId]));
// }

function* entryUpvote ({ actionId, entryId, entryTitle, ethAddress, weight, value })/* : Saga<void> */ {
    const token = yield select(profileSelectors.getToken);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.upvote,
        {
            actionId, token, entryId, entryTitle, ethAddress, weight, value
        }
    );
}

// function* entryUpvoteSuccess ({ data })/* : Saga<void> */ {
//     yield call(entryVoteSuccess, data.entryId);
//     yield put(appActions.showNotification({
//         id: 'upvoteEntrySuccess',
//         duration: 4,
//         values: { entryTitle: data.entryTitle }
//     }));
//     yield put(claimableActions.claimableIterator());
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         ENTRY_MODULE, ENTRY_MODULE.getVoteRatio,
//         { entryId: data.entryId }
//     );
// }

function* entryVoteCost ()/* : Saga<void> */ {
    const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    yield call(
        [ChReqService, ChReqService.sendRequest],
        ENTRY_MODULE, ENTRY_MODULE.voteCost,
        { weights }
    );
}

export function* watchEntryActions ()/* : Saga<void> */ { // eslint-disable-line max-statements
    yield takeEvery(ENTRY_MODULE.canClaim, entryCanClaim);
    yield takeEvery(ENTRY_MODULE.canClaimVote, entryCanClaimVote);
    yield takeEvery(ENTRY_MODULE.claim, entryClaim);
    // yield takeEvery(types.ENTRY_CLAIM_SUCCESS, entryClaimSuccess);
    yield takeEvery(ENTRY_MODULE.claimVote, entryClaimVote);
    // yield takeEvery(types.ENTRY_CLAIM_VOTE_SUCCESS, entryClaimVoteSuccess);
    yield takeEvery(ENTRY_MODULE.downVote, entryDownvote);
    // yield takeEvery(types.ENTRY_DOWNVOTE_SUCCESS, entryDownvoteSuccess);
    yield takeEvery(ENTRY_MODULE.getEntryBalance, entryGetBalance);
    yield takeEvery(ENTRY_MODULE.getVoteEndPeriod, entryGetEndPeriod);
    yield takeEvery(ENTRY_MODULE.getEntry, entryGetFull);
    yield takeLatest(ENTRY_MODULE.getLatestEntryVersion, entryGetLatestVersion);
    yield takeEvery(ENTRY_MODULE.getScore, entryGetScore);
    // yield takeEvery(types.ENTRY_GET_SHORT, entryGetShort);
    yield takeEvery(ENTRY_MODULE.getVoteOf, entryGetVoteOf);
    yield takeEvery(ENTRY_MODULE.getEntryList, entryListIterator);
    // yield takeEvery(types.ENTRY_MORE_LIST_ITERATOR, entryMoreListIterator);
    // yield takeEvery(types.ENTRY_MORE_NEWEST_ITERATOR, entryMoreNewestIterator);
    // yield takeEvery(types.ENTRY_MORE_PROFILE_ITERATOR, entryMoreProfileIterator);
    // yield takeEvery(types.ENTRY_MORE_STREAM_ITERATOR, entryMoreStreamIterator);
    // yield takeEvery(types.ENTRY_MORE_TAG_ITERATOR, entryMoreTagIterator);
    // yield takeEvery(types.ENTRY_NEWEST_ITERATOR, entryNewestIterator);
    yield takeEvery(ENTRY_MODULE.entryProfileIterator, entryProfileIterator);
    yield takeEvery(ENTRY_MODULE.resolveEntriesIpfsHash, entryResolveIpfsHash);
    yield takeEvery(ENTRY_MODULE.allStreamIterator, entryStreamIterator);
    yield takeEvery(ENTRY_MODULE.entryTagIterator, entryTagIterator);
    yield takeEvery(ENTRY_MODULE.upVote, entryUpvote);
    // yield takeEvery(types.ENTRY_UPVOTE_SUCCESS, entryUpvoteSuccess);
    yield takeEvery(ENTRY_MODULE.voteCost, entryVoteCost);
}

/* eslint-enable no-use-before-define */
