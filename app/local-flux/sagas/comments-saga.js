// @flow
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/comments-actions';
import * as appActions from '../actions/app-actions';
import * as profileActions from '../actions/profile-actions';
import * as types from '../constants';
import { externalProcessSelectors, commentSelectors, profileSelectors } from '../selectors';
import { COMMENTS_MODULE } from '@akashaproject/common/constants';
import ChReqService from '../services/channel-request-service';

/*::
    import type { Saga, CallEffect } from 'redux-saga';
    import type { CommentsCheckNewPayload 
        } from '../../flow-typed/actions/comments-actions';
 */

const COMMENT_FETCH_LIMIT = 50;
const REPLIES_FETCH_LIMIT = 25;

function* commentsCheckNew ({ entryId }/*: CommentsCheckNewPayload */)/* : Saga<void> */ {
    const toBlock = yield select(commentSelectors.selectNewCommentsBlock);
    yield call(commentsIterator, { entryId, toBlock, reversed: true, checkNew: true, more: false, parent: null, context: null }); // eslint-disable-line
}

function* commentsDownvote ({ actionId, commentId, entryId, weight })/* : Saga<void> */ {
    const token = yield select(profileSelectors.getToken);
    yield call([ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.downVote, {
            actionId, token, commentId, entryId, weight
        });
}

// function* commentsDownvoteSuccess ({ data })/* : Saga<void> */ {
//     yield call(commentsVoteSuccess, data.commentId); // eslint-disable-line no-use-before-define
//     yield put(appActions.showNotification({ id: 'downvoteCommentSuccess', duration: 4 }));
// }

function* commentsGet ({ context, entryId, commentId, isParent })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.getComment, {
            context, entryId, commentId, isParent
        });
}

function* commentsGetCount ({ entryId })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.commentsCount, {
            entryId
        });
}

// function* commentsGetExtra (collection, request)/* : Saga<void> */ {
//     const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
//     const commentIds = [];
//     const ethAddresses = [];
//     const ipfsHashes = [];
//     const voteOf = [];
//     collection.forEach((comment) => {
//         const { ethAddress } = comment.author;
//         if (!ethAddresses.includes(ethAddress)) {
//             ethAddresses.push(ethAddress);
//         }
//         ipfsHashes.push(comment.ipfsHash);
//         commentIds.push(comment.commentId);
//         voteOf.push({ commentId: comment.commentId, ethAddress: loggedEthAddress });
//     });
//     if (ipfsHashes.length) {
//         yield put(actions.commentsResolveIpfsHash(ipfsHashes, commentIds));
//         yield put(actions.commentsGetVoteOf(voteOf));
//     }
//     for (let i = 0; i < ethAddresses.length; i++) {
//         yield put(profileActions.profileGetData({ ethAddress: ethAddresses[i] }));
//     }
//     const { entryId, parent } = request;
//     if (parent === '0') {
//         for (let i = 0; i < commentIds.length; i++) {
//             yield put(actions.commentsIterator({ entryId, parent: commentIds[i] }));
//         }
//     }
// }

function* commentsGetScore ({ commentId })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.getScore,
        { commentId }
    );
}

function* commentsGetVoteOf ({ data })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.getVoteOf,
        data
    )
}

function* commentsIterator (
    { context, entryId, parent, reversed, toBlock, more, checkNew }
)/* : Saga<void> */ {
    let block;
    if (toBlock) {
        block = toBlock;
    } else {
        block = yield select(externalProcessSelectors.getCurrentBlockNumber);
    }
    const limit = parent === '0' ? COMMENT_FETCH_LIMIT : REPLIES_FETCH_LIMIT;
    const lastIndex = reversed ? '0' : undefined;
    yield call(
        [ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.commentsIterator, {
            context, entryId, toBlock: block, lastIndex, limit, reversed, parent, more, checkNew 
        }
    );
}

// function* commentsMoreIterator ({ entryId, parent })/* : Saga<void> */ {
//     const toBlock = yield select(state => commentSelectors.selectCommentLastBlock(state, { parent }));
//     const lastIndex = yield select(state => commentSelectors.selectCommentLastIndex(state, { parent }));
//     yield call(
//         [ChReqService, ChReqService.sendRequest],
//         COMMENTS_MODULE, COMMENTS_MODULE.commentsIterator,
//         { entryId, toBlock, lastIndex, limit: COMMENT_FETCH_LIMIT, parent, more: true }
//     );
// }

function* commentsPublish ({ actionId, ...payload })/* : Saga<void> */ {
    const token/* : string */ = yield select(profileSelectors.getToken);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.comment,
        { actionId, token, ...payload }
    );
}

function* commentsPublishSuccess ()/* : Saga<void> */ {
    yield put(appActions.showNotification({ id: 'publishCommentSuccess', duration: 4 }));
}

function* commentsResolveIpfsHash ({ ipfsHashes, commentIds })/* : Saga<void> */ {
    yield call(
        [ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.resolveCommentsIpfsHash,
        { ipfsHashes, commentIds }
    )
}

function* commentsUpvote ({ actionId, commentId, entryId, weight })/* : Saga<void> */ {
    const token/* : string */ = yield select(profileSelectors.getToken);
    yield call(
        [ChReqService, ChReqService.sendRequest],
        COMMENTS_MODULE, COMMENTS_MODULE.upvote,
        { actionId, token, commentId, entryId, weight }
    );
}

function* commentsUpvoteSuccess ({ data })/* : Saga<void> */ {
    yield call(commentsVoteSuccess, data.commentId); // eslint-disable-line no-use-before-define
    yield put(appActions.showNotification({ id: 'upvoteCommentSuccess', duration: 4 }));
}

function* commentsVoteSuccess (commentId)/* : Saga<void> */ {
    const ethAddress = yield select(profileSelectors.selectLoggedEthAddress);
    yield put(actions.commentsGetScore(commentId));
    yield put(actions.commentsGetVoteOf([{ commentId, ethAddress }]));
}

export function* watchCommentsActions ()/* : Saga<void> */ {
    yield takeEvery(COMMENTS_MODULE.downVote, commentsDownvote);
    // yield takeEvery(types.COMMENTS_DOWNVOTE_SUCCESS, commentsDownvoteSuccess);
    yield takeEvery(types.COMMENTS_CHECK_NEW, commentsCheckNew);
    yield takeEvery(COMMENTS_MODULE.getComment, commentsGet);
    yield takeEvery(COMMENTS_MODULE.commentsCount, commentsGetCount);
    yield takeEvery(COMMENTS_MODULE.getScore, commentsGetScore);
    yield takeEvery(COMMENTS_MODULE.getVoteOf, commentsGetVoteOf);
    yield takeEvery(COMMENTS_MODULE.commentsIterator, commentsIterator);
    yield takeEvery(types.COMMENTS_MORE_ITERATOR, commentsMoreIterator);
    yield takeEvery(COMMENTS_MODULE.comment, commentsPublish);
    // yield takeEvery(types.COMMENTS_PUBLISH_SUCCESS, commentsPublishSuccess);
    yield takeEvery(COMMENTS_MODULE.resolveCommentsIpfsHash, commentsResolveIpfsHash);
    yield takeEvery(COMMENTS_MODULE.upvote, commentsUpvote);
    // yield takeEvery(types.COMMENTS_UPVOTE_SUCCESS, commentsUpvoteSuccess);
}
