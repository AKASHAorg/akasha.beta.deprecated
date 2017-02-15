import { AppActions, TransactionActions } from 'local-flux';
import { CommentService } from '../services';
import { commentsActionCreators } from './action-creators';

let commentActions = null;

class CommentsActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (commentActions) {
            return commentActions;
        }
        this.dispatch = dispatch;
        this.commentService = new CommentService();
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
                        data.collection.forEach((comment) => {
                            if (comment.data.parent === '0') {
                                this.dispatch(
                                    commentsActionCreators.fetchNewCommentsSuccess(comment, options)
                                );
                            } else {
                                const parentLoaded = entryComments.findIndex(comm => comm.get('commentId') === parseInt(comment.data.parent, 10)) > -1;
                                if (parentLoaded) {
                                    this.dispatch(
                                        commentsActionCreators.fetchNewCommentsSuccess(comment, options)
                                    );
                                }
                            }
                        });
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
                    }]);
                    this.appActions.showNotification({
                        id: 'publishingComment',
                        duration: 3000
                    });
                    dispatch(commentsActionCreators.publishCommentOptimistic({
                        commentId: 'temp',
                        data: {
                            active: true,
                            content: commentPayload.get('content'),
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

export { CommentsActions };
