import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Comment, CommentEditor, OptimisticComment } from '../';
import { entryMessages } from '../../locale-data/messages';

class CommentThread extends Component {
    componentDidUpdate (prevProps) {
        if (this.props.replyTo && prevProps.replyTo !== this.props.replyTo &&
                this.commentEditorRef) {
            this.commentEditorRef.baseNodeRef.scrollIntoViewIfNeeded(false);
        }
    }

    shouldComponentUpdate (nextProps) {
        const { comments, pendingComments, profiles, replyTo } = nextProps;
        if (
            !comments.equals(this.props.comments) ||
            !pendingComments.equals(this.props.pendingComments) ||
            !profiles.equals(this.props.profiles) ||
            replyTo !== this.props.replyTo
        ) {
            return true;
        }
        return false;
    }

    getEditorRef = (editor) => {
        this.commentEditorRef = editor && editor.refs.clickAwayableElement;
    };

    render () {
        const { actionAdd, comments, containerRef, depth, entryAuthor, entryId, intl,
            loggedProfileData, onReply, onReplyClose, parentId, pendingComments,
            profiles, replyTo } = this.props;
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
                containerRef={containerRef}
                key={commAction.id}
                loggedAkashaId={loggedProfileData.get('akashaId')}
              />
            ));
        const comms = filteredComments.map(comment => (
          <Comment
            comment={comment}
            containerRef={containerRef}
            entryAuthor={entryAuthor}
            key={`${comment.commentId}-fetchedComments`}
            loggedAkashaId={loggedProfileData.get('akashaId')}
            onReply={onReply}
            profiles={profiles}
            showReplyButton={(depth <= 2)}
          >
            <CommentThread
              actionAdd={actionAdd}
              comments={comments}
              containerRef={containerRef}
              depth={(depth + 1)}
              entryAuthor={entryAuthor}
              entryId={entryId}
              intl={intl}
              loggedProfileData={loggedProfileData}
              onReply={onReply}
              onReplyClose={onReplyClose}
              parentId={`${comment.commentId}`}
              pendingComments={pendingComments}
              profiles={profiles}
              replyTo={replyTo}
            />
            {replyTo === comment.commentId && (() => {
                const author = profiles.get(comment.getIn(['data', 'profile']));
                return (
                  <div>
                    <CommentEditor
                      actionAdd={actionAdd}
                      containerRef={containerRef}
                      entryId={entryId}
                      intl={intl}
                      isReply
                      loggedProfileData={loggedProfileData}
                      onClose={onReplyClose}
                      parent={comment.commentId}
                      placeholder={intl.formatMessage(entryMessages.writeReplyTo, {
                          name: `@${author.get('akashaId')}`
                      })}
                      ref={this.getEditorRef}
                    />
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
    actionAdd: PropTypes.func.isRequired,
    comments: PropTypes.shape(),
    containerRef: PropTypes.shape(),
    depth: PropTypes.number,
    entryAuthor: PropTypes.string,
    entryId: PropTypes.string,
    loggedProfileData: PropTypes.shape(),
    intl: PropTypes.shape(),
    onReply: PropTypes.func.isRequired,
    onReplyClose: PropTypes.func.isRequired,
    parentId: PropTypes.string,
    pendingComments: PropTypes.shape(),
    profiles: PropTypes.shape(),
    replyTo: PropTypes.string,
};

export default injectIntl(CommentThread);
