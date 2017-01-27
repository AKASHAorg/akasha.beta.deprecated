import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Comment, CommentEditor } from 'shared-components';
import { Divider } from 'material-ui';
import { entryMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './comment-thread.scss';

class CommentThread extends Component {
    componentDidUpdate () {
        if (this.props.replyTo && this.commentEditorRef) {
            this.commentEditorRef.getBaseNode().scrollIntoViewIfNeeded(false);
        }
    }
    _onReply = (ev, commentId) => {
        if (this.props.onReply) this.props.onReply(ev, commentId);
    }
    render () {
        const { comments, parentId, replyTo, loggedProfile, entryAuthorProfile, profileAvatar,
            profileUserInitials, onReplyCreate, intl, depth, onReplyCancel, onAuthorNameClick,
            onTip, onFollow, onUnfollow, followingsList } = this.props;
        let filteredComments = comments.filter(comm => comm.data.parent === parentId);
        if (depth > 1) {
            filteredComments = filteredComments.reverse();
        }
        const comms = filteredComments.map(comment =>
          <Comment
            key={`${comment.commentId}-fetchedComments`}
            comment={comment}
            loggedProfile={loggedProfile}
            followingsList={followingsList}
            entryAuthorProfile={entryAuthorProfile}
            onReply={ev => this._onReply(ev, comment.commentId)}
            onAuthorNameClick={onAuthorNameClick}
            onTip={onTip}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            showReplyButton={(depth <= 2)}
            isPublishing={comment.get('isPublishing')}
            intl={intl}
          >
            <CommentThread
              comments={comments}
              parentId={`${comment.commentId}`}
              replyTo={replyTo}
              loggedProfile={loggedProfile}
              followingsList={followingsList}
              entryAuthorProfile={entryAuthorProfile}
              profileAvatar={profileAvatar}
              profileUserInitials={profileUserInitials}
              onReply={this._onReply}
              onReplyCreate={onReplyCreate}
              onAuthorNameClick={onAuthorNameClick}
              onTip={onTip}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
              intl={intl}
              depth={(depth + 1)}
              onReplyCancel={onReplyCancel}
            />
            {replyTo === comment.commentId && comment.commentId &&
              <div>
                <CommentEditor
                  profileAvatar={profileAvatar}
                  profileUserInitials={profileUserInitials}
                  onCommentCreate={editorState => onReplyCreate(editorState, `${comment.commentId}`)}
                  placeholder={intl.formatMessage(entryMessages.writeReplyTo, {
                      name: `${comment.getIn(['data', 'profile', 'firstName'])} ${comment.getIn(['data', 'profile', 'lastName'])}`
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
    followingsList: React.PropTypes.shape(),
    entryAuthorProfile: React.PropTypes.string,
    profileAvatar: React.PropTypes.string,
    profileUserInitials: React.PropTypes.string,
    onReplyCreate: React.PropTypes.func,
    onReply: React.PropTypes.func,
    intl: React.PropTypes.shape(),
    depth: React.PropTypes.number,
    onReplyCancel: React.PropTypes.func,
    onAuthorNameClick: React.PropTypes.func,
    onTip: React.PropTypes.func,
    onFollow: React.PropTypes.func,
    onUnfollow: React.PropTypes.func
};
export default CommentThread;
