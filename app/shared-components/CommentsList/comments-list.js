import React, { Component } from 'react';
import { entryMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { CommentThread } from 'shared-components';

class CommentsList extends Component {
    constructor (props) {
        super(props);
        this.requestSent = false;
        this.state = {
            loadedCommentsCount: this.props.comments.size,
            loadMoreReq: false,
        };
    }
    componentDidMount () {
        window.addEventListener('scroll', this._handleScroll, { pasive: true });
    }
    componentWillReceiveProps (nextProps) {
        const { comments } = nextProps;
        this.setState({
            loadedCommentsCount: comments.size
        });
        if (comments.last()) {
            this.setState({
                lastLoadedCommentId: comments.last().get('commentId')
            });
        }
        if (comments.size > this.props.comments.size) {
            this.setState({
                loadMoreReq: false
            });
        }
    }
    componentWillUnmount () {
        window.removeEventListener('scroll', this._handleScroll);
    }
    resetReplies = () => {
        this._resetReplyTo();
    }
    _handleNavigation = (to) => {
        const { loggedProfile } = this.props;
        this.context.router.push(`${loggedProfile.get('akashaId')}/${to}`);
    }
    _handleReply = (ev, parentCommentId) => {
        this.setState({
            replyTo: parentCommentId
        });
    }
    _handleReplyCancel = () => {
        this._resetReplyTo();
    }
    _resetReplyTo = () => {
        this.setState({
            replyTo: null
        });
    }
    _handleScroll = () => {
        const { fetchLimit, commentsCount, onLoadMoreRequest, entryId } = this.props;
        const { lastLoadedCommentId } = this.state;
        const { scrollY, innerHeight } = window;
        const { scrollHeight } = document.body;
        const bottomOffset = 500;
        const shouldTriggerEvent = (scrollY + innerHeight + bottomOffset) >= scrollHeight;
        if (shouldTriggerEvent && (commentsCount > fetchLimit) && !this.state.loadMoreReq) {
            if (onLoadMoreRequest && lastLoadedCommentId > 1) {
                this.setState({
                    loadMoreReq: true
                }, () => {
                    onLoadMoreRequest(entryId, lastLoadedCommentId);
                });
            }
        }
    }
    render () {
        const { comments, intl, loggedProfile, entryAuthorProfile, fetchingComments, profileAvatar,
            profileUserInitials, onReplyCreate, onCommenterClick, profiles,
            profileActions } = this.props;
        return (
          <div>
            {comments.size > 0 &&
              <CommentThread
                parentId="0"
                depth={1}
                comments={comments}
                replyTo={this.state.replyTo}
                loggedProfile={loggedProfile}
                entryAuthorProfile={entryAuthorProfile}
                profileAvatar={profileAvatar}
                profileUserInitials={profileUserInitials}
                onReply={this._handleReply}
                onReplyCreate={onReplyCreate}
                onReplyCancel={this._handleReplyCancel}
                intl={intl}
                onAuthorNameClick={onCommenterClick}
                profiles={profiles}
                profileActions={profileActions}
              />
            }
            {(!this.state.loadMoreReq && fetchingComments) &&
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                {`${intl.formatMessage(entryMessages.loadingComments)}...`}
              </div>
            }
            {(this.state.loadMoreReq && fetchingComments) &&
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                {`${intl.formatMessage(entryMessages.loadingMoreComments)}...`}
              </div>
            }
          </div>
        );
    }
}
CommentsList.propTypes = {
    comments: React.PropTypes.shape(),
    loggedProfile: React.PropTypes.shape(),
    profiles: React.PropTypes.shape(),
    profileActions: React.PropTypes.shape(),
    entryAuthorProfile: React.PropTypes.string,
    onLoadMoreRequest: React.PropTypes.func,
    commentsCount: React.PropTypes.number,
    fetchLimit: React.PropTypes.number,
    fetchingComments: React.PropTypes.bool,
    entryId: React.PropTypes.number,
    intl: React.PropTypes.shape(),
    profileAvatar: React.PropTypes.string,
    profileUserInitials: React.PropTypes.string,
    onReplyCreate: React.PropTypes.func,
    onCommenterClick: React.PropTypes.func,
};
CommentsList.contextTypes = {
    router: React.PropTypes.shape()
};
export default CommentsList;
