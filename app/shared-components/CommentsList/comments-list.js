import React, { Component } from 'react';
import imageCreator from 'utils/imageUtils';
import Comment from '../Comment/comment';

class CommentsList extends Component {
    renderComment = (comment, key) => {
        const { loggedProfile, entryAuthorProfile } = this.props;
        const { data } = comment;
        const content = JSON.parse(data.content);
        const { profile } = data;
        const authorName = `${profile.get('firstName')} ${profile.get('lastName')}`;
        const authorAvatar = profile.get('avatar');
        const viewerIsAuthor = loggedProfile.get('profile') === profile.get('profile');
        const isEntryAuthor = entryAuthorProfile === profile.get('profile');
        return (
          <Comment
            key={key}
            authorName={authorName}
            viewerIsAuthor={viewerIsAuthor}
            publishDate={'3 days ago'}
            avatar={authorAvatar}
            rawContent={content}
            onReply={ev => this._handleReply(ev, 'comment')}
            repliesLimit={3}
            stats={{ upvotes: '', downvotes: '', replies: '' }}
            isPublishing={!!comment.get('tempTx')}
            isEntryAuthor={isEntryAuthor}
          />
        );
    }
    render () {
        const { comments } = this.props;
        const publishingCommentList = comments.filter(comm => comm.get('tempTx'))
          .map((comment, key) =>
            this.renderComment(comment, key)
          );
        const commentList = comments.filter(comm =>
                (!comm.get('tempTx') && comm.getIn(['data', 'active'])))
            .map((comment, key) =>
                this.renderComment(comment, key)
            );
        return (
          <div>
            {publishingCommentList}
            {commentList}
          </div>
        );
    }
}
CommentsList.propTypes = {
    comments: React.PropTypes.shape(),
    loggedProfile: React.PropTypes.shape(),
    entryAuthorProfile: React.PropTypes.string
};
export default CommentsList;
