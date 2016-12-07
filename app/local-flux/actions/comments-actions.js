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
            onSuccess: data => this.dispatch(commentsActionCreators.getEntryCommentsSuccess(data, {
                fetchingComments: false
            })),
            onError: error => this.dispatch(commentsActionCreators.getEntryCommentsError(error, {
                fetchingComments: false
            }))
        });
    }
    publishComment = (commentPayload, gas) => {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const token = loggedProfile.get('token');
            const flagOn = { entryId: commentPayload.entryId, value: true };
            const flagOff = { entryId: commentPayload.entryId, value: false };
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
                        entryId: data.entryId,
                    }]);
                    this.appActions.showNotification({
                        id: 'publishingComment',
                        duration: 3000
                    });
                },
                onError: error => dispatch(commentsActionCreators.publishCommentError(error, {
                    registerPending: flagOff
                }))
            });
        });
    }
    publishCommentSuccess = (entryId) => {
        this.dispatch(commentsActionCreators.publishCommentSuccess({
            registerPending: { entryId, value: false }
        }));
        this.appActions.showNotification({
            id: 'commentPublishedSuccessfully'
        });
    }
}

export { CommentsActions };
