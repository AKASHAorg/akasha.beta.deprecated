import { CommentService } from '../services';
import { commentActionCreators } from './action-creators';

let commentActions = null;

class CommentActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (commentActions) {
            return commentActions;
        }
        this.dispatch = dispatch;
        this.commentService = new CommentService();
        commentActions = this;
    }
    getCommentsByEntry (entryId, options) {
        return this.commentService.getCommentsByEntry(entryId, options).then(comments =>
            this.dispatch(
                commentActionCreators.getCommentsByEntrySuccess(entryId, comments)
            )
        );
    }
}

export { CommentActions };
