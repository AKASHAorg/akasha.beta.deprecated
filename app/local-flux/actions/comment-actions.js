import { CommentService } from '../services';
import { commentActionCreators } from './action-creators';

let commentActions = null;

class CommentActions {
    constructor (dispatch) {
        if (!commentActions) {
            commentActions = this;
        }
        this.dispatch = dispatch;
        this.commentService = new CommentService();
        return commentActions;
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
