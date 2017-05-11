import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Divider } from 'material-ui';
import { Comment, CommentEditor, OptimisticComment } from '../';
import { entryMessages } from '../../locale-data/messages';

class CommentThread extends Component {
    componentDidUpdate (prevProps) {
        if (this.props.replyTo && prevProps.replyTo !== this.props.replyTo &&
                this.commentEditorRef) {
            this.commentEditorRef.baseNodeRef.scrollIntoViewIfNeeded(false);
        }
    }

    render () {
        const { comments, commentsAddPublishAction, depth, entryAuthorProfile, entryId, intl,
            loggedProfile, onReply, onReplyCancel, parentId, pendingComments, profileAvatar,
            profiles, profileUserInitials, replyTo } = this.props;
        const loggedProfileData = profiles.get(loggedProfile.get('profile'));
        let filteredComments = comments.filter(comm => comm.data.parent === parentId);
        let optimisticComments = pendingComments.filter(action =>
            action.getIn(['payload', 'parent']) === parentId);
        if (depth > 1) {
            filteredComments = filteredComments.reverse();
        } else {
            optimisticComments = optimisticComments.reverse();
        }
        optimisticComments = optimisticComments
            .toArray()
            .map(commAction => (
              <OptimisticComment
                comment={commAction}
                key={commAction.id}
                loggedProfileData={loggedProfileData}
              />
            ));
        const comms = filteredComments.map(comment => (
          <Comment
            comment={comment}
            entryAuthorProfile={entryAuthorProfile}
            key={`${comment.commentId}-fetchedComments`}
            loggedProfile={loggedProfile}
            onReply={onReply}
            profiles={profiles}
            showReplyButton={(depth <= 2)}
          >
            <CommentThread
              comments={comments}
              commentsAddPublishAction={commentsAddPublishAction}
              depth={(depth + 1)}
              entryAuthorProfile={entryAuthorProfile}
              entryId={entryId}
              intl={intl}
              loggedProfile={loggedProfile}
              onReply={onReply}
              onReplyCancel={onReplyCancel}
              parentId={`${comment.commentId}`}
              pendingComments={pendingComments}
              profileAvatar={profileAvatar}
              profiles={profiles}
              profileUserInitials={profileUserInitials}
              replyTo={replyTo}
            />
            {replyTo === comment.commentId && (() => {
                const author = profiles.get(comment.getIn(['data', 'profile']));
                return (
                  <div>
                    <CommentEditor
                      commentsAddPublishAction={commentsAddPublishAction}
                      entryId={entryId}
                      intl={intl}
                      loggedProfileData={loggedProfileData}
                      onCancel={onReplyCancel}
                      parent={comment.commentId}
                      placeholder={intl.formatMessage(entryMessages.writeReplyTo, {
                          name: `@${author.get('akashaId')}`
                      })}
                      ref={editor => (this.commentEditorRef = editor)}
                      showPublishActions
                    />
                    <Divider />
                  </div>
                );
            })()}
          </Comment>
        ));

        return (
          <div className="comment-thread">
            {depth <= 1 && optimisticComments}
            {comms.toJS()}
            {depth > 1 && optimisticComments}
          </div>
        );
    }
}

CommentThread.propTypes = {
    comments: PropTypes.shape(),
    commentsAddPublishAction: PropTypes.func.isRequired,
    depth: PropTypes.number,
    entryAuthorProfile: PropTypes.string,
    entryId: PropTypes.string,
    loggedProfile: PropTypes.shape(),
    intl: PropTypes.shape(),
    onReply: PropTypes.func.isRequired,
    onReplyCancel: PropTypes.func.isRequired,
    parentId: PropTypes.string,
    pendingComments: PropTypes.shape(),
    profileAvatar: PropTypes.string,
    profiles: PropTypes.shape(),
    profileUserInitials: PropTypes.string,
    replyTo: PropTypes.string,
};

export default injectIntl(CommentThread);
