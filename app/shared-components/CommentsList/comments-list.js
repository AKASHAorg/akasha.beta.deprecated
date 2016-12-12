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
        if (comments.size > this.props.comments.size) {
            this.requestSent = false;
        }
    }
    componentWillUnmount () {
        window.removeEventListener('scroll', this._handleScroll);
    }
    _handleNavigation = (to) => {
        const { loggedProfile } = this.props;
        this.context.router.push(`${loggedProfile.get('akashaId')}/${to}`);
    }
    _handleScroll = () => {
        const { comments, fetchLimit, commentsCount, onLoadMoreRequest, entryId } = this.props;
        const { scrollY, innerHeight } = window;
        const { scrollHeight } = document.body;
        const bottomOffset = 500;
        const shouldTriggerEvent = (scrollY + innerHeight + bottomOffset) >= scrollHeight;

        if (shouldTriggerEvent && (commentsCount > fetchLimit) && !this.requestSent) {
            const lastLoadedCommentId = comments.getIn([(this.state.loadedCommentsCount - 1), 'commentId']);
            if (onLoadMoreRequest && lastLoadedCommentId > 1) {
                onLoadMoreRequest(entryId, lastLoadedCommentId);
                this.requestSent = true;
            }
        }
    }
    renderComment = (comment, key) => {
        const { loggedProfile, entryAuthorProfile } = this.props;
        const { data } = comment;
        const { profile } = data;
        const content = JSON.parse(data.content);
        const authorName = `${profile.get('firstName')} ${profile.get('lastName')}`;
        const authorAvatar = (profile.get('avatar') === `${profile.get('baseUrl')}/`) ?
            null : profile.get('avatar');
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
            onAuthorNameClick={() => this._handleNavigation(`profile/${profile.get('profile')}`)}
          />
        );
    }
    render () {
        const { comments, publishingComments, newlyCreatedComments } = this.props;
        console.log(newlyCreatedComments, 'created comments');
        console.log(publishingComments, 'publishingComments');
        return (
          <div>
            {publishingComments.map((comment, key) =>
                this.renderComment(comment, key)
            )}
            {newlyCreatedComments.map((comment, key) =>
                this.renderComment(comment, key)
            )}
            {comments.map((comment, key) =>
                this.renderComment(comment, key)
            )}
          </div>
        );
    }
}
CommentsList.propTypes = {
    comments: React.PropTypes.shape(),
    loggedProfile: React.PropTypes.shape(),
    entryAuthorProfile: React.PropTypes.string,
    publishingComments: React.PropTypes.shape(),
    newlyCreatedComments: React.PropTypes.shape(),
    onLoadMoreRequest: React.PropTypes.func,
    commentsCount: React.PropTypes.number,
    fetchLimit: React.PropTypes.number,
    entryId: React.PropTypes.number
};
CommentsList.contextTypes = {
    router: React.PropTypes.shape()
};
export default CommentsList;
