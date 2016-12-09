import React, { Component } from 'react';
import Comment from '../Comment/comment';

class CommentsList extends Component {
    constructor (props) {
        super(props);
        this.requestSent = false;
        this.state = {
            loadedCommentsCount: this.props.comments.size
        };
    }
    componentDidMount () {
        window.addEventListener('scroll', this._handleScroll);
    }
    componentWillReceiveProps (nextProps) {
        const { comments } = nextProps;
        this.setState({
            loadedCommentsCount: comments.size
        });
    }
    componentWillUnmount () {
        window.removeEventListener('scroll', this._handleScroll);
    }
    _handleScroll = () => {
        const { comments, fetchLimit, commentsCount, onLoadMoreRequest } = this.props;
        const { scrollY, innerHeight } = window;
        const { scrollHeight } = document.body;
        const bottomOffset = 350;
        const shouldTriggerEvent = (scrollY + innerHeight + bottomOffset) >= scrollHeight;

        if (shouldTriggerEvent && !this.requestSent && (commentsCount > fetchLimit)) {
            const lastLoadedCommentId = comments.getIn([(this.state.loadedCommentsCount - 1), 'commentId']) - 1;
            if (onLoadMoreRequest) {
                onLoadMoreRequest(lastLoadedCommentId);
                this.requestSent = true;
            }
        }
    }
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
            publishDate={comment.getIn(['data', 'date'])}
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
        const { comments, publishingComments } = this.props;
        const publishingCommentList = publishingComments.map((comment, key) =>
          this.renderComment(comment, key)
        );
        const commentList = comments.map((comment, key) =>
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
    entryAuthorProfile: React.PropTypes.string,
    publishingComments: React.PropTypes.shape(),
    onLoadMoreRequest: React.PropTypes.func,
    commentsCount: React.PropTypes.number,
    fetchLimit: React.PropTypes.number
};
export default CommentsList;
