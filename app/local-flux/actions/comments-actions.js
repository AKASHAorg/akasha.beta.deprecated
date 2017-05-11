import { AppActions, TransactionActions } from './';
import { CommentService, ProfileService } from '../services';
import { commentsActionCreators } from './action-creators';
import * as types from '../constants';
import { action } from './helpers';

let commentActions = null;

class CommentsActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (commentActions) {
            return commentActions;
        }
        this.dispatch = dispatch;
        this.commentService = new CommentService();
        this.profileService = new ProfileService();
        this.appActions = new AppActions(dispatch);
        this.transactionActions = new TransactionActions(dispatch);
        commentActions = this;
    }
    getEntryComments (entryId, start, limit, reverse) {
        this.dispatch(commentsActionCreators.getEntryComments({
            fetchingComments: true
        }));
        this.commentService.getEntryComments({
            entryId,
            start,
            limit,
            reverse,
            onSuccess: (data) => {
                this.dispatch((dispatch, getState) => {
                    const akashaIds = [];
                    let newCollection = [];
                    if (data.collection) {
                        newCollection = data.collection.map((comm) => {
                            if (comm.data.profile && comm.data.profile.akashaId) {
                                akashaIds.push({ akashaId: comm.data.profile.akashaId });
                            }
                            comm.data.content = JSON.parse(comm.data.content);
                            return comm;
                        });
                    }
                    data.collection = newCollection;
                    this.profileService.saveAkashaIds(akashaIds);
                    const isfetchingComments = getState().commentsState.getIn(['flags', 'fetchingComments']);
                    if (isfetchingComments) {
                        dispatch(commentsActionCreators.getEntryCommentsSuccess(data,
                            { reverse, start, entryId },
                            { fetchingComments: false }
                        ));
                    }
                });
            },
            onError: error => this.dispatch(commentsActionCreators.getEntryCommentsError(error, {
                fetchingComments: false
            }))
        });
    }
    fetchNewComments (entryId, options) {
        this.dispatch((dispatch, getState) => {
            const entryComments = getState().commentsState.get('entryComments')
                    .filter(comm => (comm.get('entryId') === parseInt(entryId, 10)) && comm.get('commentId') && !comm.get('tempTx'));
            const fetchingComments = getState().commentsState.getIn(['flags', 'fetchingComments']);
            let lastCommentId;
            if (entryComments.size > 0) {
                lastCommentId = entryComments.first().get('commentId');
            } else {
                lastCommentId = 0;
            }
            // we need a separate channel to have a different listener for this
            if (!fetchingComments) {
                this.commentService.getNewEntryComments({
                    entryId,
                    start: lastCommentId,
                    limit: null,
                    reverse: true,
                    onSuccess: (data) => {
                        const akashaIds = [];
                        data.collection.forEach((comment) => {
                            if (comment.data.profile && comment.data.profile.akashaId) {
                                akashaIds.push({ akashaId: comment.data.profile.akashaId });
                            }
                            comment.data.content = JSON.parse(comment.data.content);
                            if (comment.data.parent === '0') {
                                this.dispatch(
                                    commentsActionCreators.fetchNewCommentsSuccess(comment, options)
                                );
                            } else {
                                const parentLoaded = entryComments.findIndex(comm =>
                                    comm.get('commentId') === parseInt(comment.data.parent, 10)) > -1;
                                if (parentLoaded) {
                                    this.dispatch(
                                        commentsActionCreators.fetchNewCommentsSuccess(comment, options)
                                    );
                                }
                            }
                        });
                        this.profileService.saveAkashaIds(akashaIds);
                    },
                    onError: error => this.dispatch(
                        commentsActionCreators.getEntryCommentsError(error, {
                            fetchingComments: false
                        })
                    )
                });
            }
        });
    }
    clearNewCommentsIds () {
        this.dispatch(commentsActionCreators.clearNewCommentsIds());
    }
    getCommentsCount (entryId) {
        this.commentService.getCommentsCount({
            entryId,
            onSuccess: data => this.dispatch(commentsActionCreators.getCommentsCountSuccess(data)),
            onError: error => this.dispatch(commentsActionCreators.getCommentsCountError(error))
        });
    }
    publishComment (commentPayload, gas) {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const loggedProfileData = getState().profileState.get('profiles').find(prf =>
                prf.profile === loggedProfile.get('profile')
            );
            const token = loggedProfile.get('token');
            const flagOn = { entryId: commentPayload.get('entryId'), value: true };
            const flagOff = { entryId: commentPayload.get('entryId'), value: false };
            dispatch(commentsActionCreators.publishComment({
                registerPending: flagOn
            }));
            this.commentService.publishComment({
                token,
                gas,
                ...commentPayload.toJS(),
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'publishComment',
                        entryId: commentPayload.get('entryId'),
                        mentions: commentPayload.get('mentions')
                    }]);
                    this.appActions.showNotification({
                        id: 'publishingComment',
                        duration: 3000
                    });
                    dispatch(commentsActionCreators.publishCommentOptimistic({
                        commentId: 'temp',
                        data: {
                            active: true,
                            content: JSON.parse(commentPayload.get('content')),
                            date: null,
                            ipfsHash: null,
                            parent: commentPayload.get('parent') || '0',
                            profile: loggedProfileData
                        },
                        entryId: commentPayload.get('entryId'),
                        tempTx: data.tx
                    }));
                },
                onError: error => dispatch(commentsActionCreators.publishCommentError(error, {
                    registerPending: flagOff
                }))
            });
        });
    }
    publishCommentSuccess = (tx) => {
        this.dispatch(commentsActionCreators.publishCommentSuccess({
            registerPending: { entryId: tx.entryId, tx, value: false }
        }));
        this.fetchNewComments(tx.entryId, { autoload: true });
        this.appActions.showNotification({
            id: 'commentPublishedSuccessfully'
        });
    }
    unloadComments = (entryId, commentId) => {
        this.dispatch(commentsActionCreators.unloadComments(entryId, commentId));
    }
}

export const commentsAddPublishAction = payload =>
    action(types.COMMENTS_ADD_PUBLISH_ACTION, { payload });
export const commentsCheckNew = entryId => action(types.COMMENTS_CHECK_NEW, { entryId });

export const commentsCheckNewError = (error) => {
    error.code = 'CCNE01';
    error.messageId = 'commentsCheckNew';
    return action(types.COMMENTS_CHECK_NEW_ERROR, { error });
};

export const commentsCheckNewSuccess = data => action(types.COMMENTS_CHECK_NEW_SUCCESS, { data });
export const commentsClean = () => action(types.COMMENTS_CLEAN);
export const commentsGetCount = entryId => action(types.COMMENTS_GET_COUNT, { entryId });

export const commentsGetCountError = (error) => {
    error.code = 'CGCE01';
    error.messageId = 'commentsGetCount';
    return action(types.COMMENTS_GET_COUNT_ERROR, { error });
};

export const commentsGetCountSuccess = data => action(types.COMMENTS_GET_COUNT_SUCCESS, { data });
export const commentsIterator = (entryId, limit, start, reverse) =>
    action(types.COMMENTS_ITERATOR, { entryId, limit, start, reverse });

export const commentsIteratorError = (error) => {
    error.code = 'CIE01';
    error.messageId = 'commentsIterator';
    return action(types.COMMENTS_ITERATOR_ERROR, { error });
};

export const commentsIteratorSuccess = (data, request) =>
    action(types.COMMENTS_ITERATOR_SUCCESS, { data, request });
export const commentsLoadNew = () => action(types.COMMENTS_LOAD_NEW);
export const commentsMoreIterator = entryId => action(types.COMMENTS_MORE_ITERATOR, { entryId });

export const commentsMoreIteratorError = (error) => {
    error.code = 'CMIE01';
    error.messageId = 'commentsMoreIterator';
    return action(types.COMMENTS_MORE_ITERATOR_ERROR, { error });
};

export const commentsMoreIteratorSuccess = (data, request) =>
    action(types.COMMENTS_MORE_ITERATOR_SUCCESS, { data, request });
export const commentsPublish = (payload, gas) => action(types.COMMENTS_PUBLISH, { payload, gas });

export const commentsPublishError = (error) => {
    error.code = 'CPE01';
    error.messageId = 'commentsPublish';
    return action(types.COMMENTS_PUBLISH_ERROR, { error });
};

export const commentsPublishSuccess = data => action(types.COMMENTS_PUBLISH_SUCCESS, { data });

export { CommentsActions };
