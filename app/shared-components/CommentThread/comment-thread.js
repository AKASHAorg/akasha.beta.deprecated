import React, { Component } from 'react';
import { Comment, CommentEditor } from '../';
import { Divider } from 'material-ui';
import { entryMessages } from '../../locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions

class CommentThread extends Component {
    componentDidUpdate (prevProps) {
        if (this.props.replyTo && prevProps.replyTo !== this.props.replyTo && this.commentEditorRef) {
            this.commentEditorRef.getBaseNode().scrollIntoViewIfNeeded(false);
        }
    }

    _onReply = (ev, commentId) => {
        if (this.props.onReply) this.props.onReply(ev, commentId);
    };

    render () {
        const { comments, parentId, replyTo, loggedProfile, entryAuthorProfile, profileAvatar,
            profileUserInitials, onReplyCreate, intl, depth, onReplyCancel, onAuthorNameClick,
            profiles, profileActions } = this.props;
        let filteredComments = comments.filter(comm => comm.data.parent === parentId);
        if (depth > 1) {
            filteredComments = filteredComments.reverse();
        }
        const comms = filteredComments.map(comment =>
          <Comment
            key={`${comment.commentId || comment.tempTx}-fetchedComments`}
            comment={comment}
            entryAuthorProfile={entryAuthorProfile}
            intl={intl}
            isPublishing={comment.get('isPublishing')}
            loggedProfile={loggedProfile}
            onAuthorNameClick={onAuthorNameClick}
            onReply={ev => this._onReply(ev, comment.commentId)}
            showReplyButton={(depth <= 2)}
          >
            <CommentThread
              comments={comments}
              parentId={`${comment.commentId}`}
              replyTo={replyTo}
              loggedProfile={loggedProfile}
              entryAuthorProfile={entryAuthorProfile}
              profileAvatar={profileAvatar}
              profileUserInitials={profileUserInitials}
              onReply={this._onReply}
              onReplyCreate={onReplyCreate}
              onAuthorNameClick={onAuthorNameClick}
              intl={intl}
              depth={(depth + 1)}
              onReplyCancel={onReplyCancel}
              profiles={profiles}
              profileActions={profileActions}
            />
            {replyTo === comment.commentId && comment.commentId &&
              <div>
                <CommentEditor
                  profileAvatar={profileAvatar}
                  profileUserInitials={profileUserInitials}
                  profileactions={profileActions}
                  onCommentCreate={editorState => onReplyCreate(editorState, `${comment.commentId}`)}
                  placeholder={intl.formatMessage(entryMessages.writeReplyTo, {
                      name: `@${comment.getIn(['data', 'profile', 'akashaId'])}`
                  })}
                  ref={(editor) => { this.commentEditorRef = editor; }}
                  intl={intl}
                  showPublishActions
                  onCancel={onReplyCancel}
                />
                <Divider />
              </div>
              }
          </Comment>
        );
        return (
          <div className="comment-thread">
            {comms.toJS()}
          </div>
        );
    }
}
CommentThread.propTypes = {
    comments: React.PropTypes.shape(),
    parentId: React.PropTypes.string,
    replyTo: React.PropTypes.number,
    loggedProfile: React.PropTypes.shape(),
    entryAuthorProfile: React.PropTypes.string,
    profileAvatar: React.PropTypes.string,
    profileUserInitials: React.PropTypes.string,
    onReplyCreate: React.PropTypes.func,
    onReply: React.PropTypes.func,
    intl: React.PropTypes.shape(),
    depth: React.PropTypes.number,
    onReplyCancel: React.PropTypes.func,
    onAuthorNameClick: React.PropTypes.func,
    profileActions: React.PropTypes.shape(),
    profiles: React.PropTypes.shape()
};
export default CommentThread;
