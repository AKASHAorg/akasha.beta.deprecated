// @flow
import { call, select, takeEvery, getContext } from 'redux-saga/effects';
import * as types from '../constants';
import { externalProcessSelectors, commentSelectors, profileSelectors } from '../selectors';
import { COMMENTS_MODULE } from '@akashaproject/common/constants';

/*::
    import type { Saga, CallEffect } from 'redux-saga';
 */

/* import type {
        CommentsCheckNewPayload
    } from '../../flow-typed/actions/comments-actions';
  */

const COMMENT_FETCH_LIMIT = 50;
const REPLIES_FETCH_LIMIT = 25;

function* commentsCheckNew ({ entryId } /* CommentsCheckNewPayload */) /* : Saga<void> */ {
    const toBlock = yield select(commentSelectors.selectNewCommentsBlock);
    yield call(commentsIterator, {
        entryId,
        toBlock,
        reversed: true,
        checkNew: true,
        more: false,
        parent: null,
        context: null
    });
}

function* commentsDownvote ({ actionId, commentId, entryId, weight, reqId }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.downVote, {
        actionId,
        token,
        commentId,
        entryId,
        weight,
        reqId
    });
}

function* commentsGet ({ context, entryId, commentId, isParent, reqId }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.getComment, {
        context,
        entryId,
        commentId,
        isParent,
        reqId
    });
}

function* commentsGetCount ({ entryId, reqId }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.commentsCount, {
        entryId,
        reqId
    });
}

function* commentsGetScore ({ commentId, reqId }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.getScore, {
        commentId,
        reqId
    });
}

function* commentsGetVoteOf ({ data }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.getVoteOf, data);
}

function* commentsIterator ({
    context,
    entryId,
    parent,
    reversed,
    toBlock,
    more,
    checkNew
}) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    let block;
    if (toBlock) {
        block = toBlock;
    } else {
        block = yield select(externalProcessSelectors.getCurrentBlockNumber);
    }
    const limit = parent === '0' ? COMMENT_FETCH_LIMIT : REPLIES_FETCH_LIMIT;
    const lastIndex = reversed ? '0' : undefined;
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.commentsIterator, {
        context,
        entryId,
        toBlock: block,
        lastIndex,
        limit,
        reversed,
        parent,
        more,
        checkNew
    });
}

function* commentsMoreIterator ({ entryId, parent }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const toBlock = yield select(state => commentSelectors.selectCommentLastBlock(state, { parent }));
    const lastIndex = yield select(state => commentSelectors.selectCommentLastIndex(state, { parent }));
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.commentsIterator, {
        entryId,
        toBlock,
        lastIndex,
        limit: COMMENT_FETCH_LIMIT,
        parent,
        more: true
    });
}

function* commentsPublish ({ actionId, ...payload }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token /* : string */ = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.comment, {
        actionId,
        token,
        ...payload
    });
}

function* commentsResolveIpfsHash ({ ipfsHashes, commentIds }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.resolveCommentsIpfsHash, {
        ipfsHashes,
        commentIds
    });
}

function* commentsUpvote ({ actionId, commentId, entryId, weight }) /* : Saga<void> */ {
    const service = yield getContext('reqService');
    const token /* : string */ = yield select(profileSelectors.getToken);
    yield call([service, service.sendRequest], COMMENTS_MODULE, COMMENTS_MODULE.upvote, {
        actionId,
        token,
        commentId,
        entryId,
        weight
    });
}

export function* watchCommentsActions () /* : Saga<void> */ {
    yield takeEvery(COMMENTS_MODULE.downVote, commentsDownvote);
    yield takeEvery(types.COMMENTS_CHECK_NEW, commentsCheckNew);
    yield takeEvery(COMMENTS_MODULE.getComment, commentsGet);
    yield takeEvery(COMMENTS_MODULE.commentsCount, commentsGetCount);
    yield takeEvery(COMMENTS_MODULE.getScore, commentsGetScore);
    yield takeEvery(COMMENTS_MODULE.getVoteOf, commentsGetVoteOf);
    yield takeEvery(COMMENTS_MODULE.commentsIterator, commentsIterator);
    yield takeEvery(types.COMMENTS_MORE_ITERATOR, commentsMoreIterator);
    yield takeEvery(COMMENTS_MODULE.comment, commentsPublish);
    yield takeEvery(COMMENTS_MODULE.resolveCommentsIpfsHash, commentsResolveIpfsHash);
    yield takeEvery(COMMENTS_MODULE.upvote, commentsUpvote);
}
