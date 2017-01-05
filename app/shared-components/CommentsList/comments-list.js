import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { entryMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import Comment from '../Comment/comment';
import { CommentEditor } from 'shared-components';

class CommentsList extends Component {
    constructor (props) {
        super(props);
        this.requestSent = false;
        this.state = {
            loadedCommentsCount: this.props.comments.size,
            loadMoreReq: false,
            publishingComments: this.props.publishingComments
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
    _handleNavigation = (to) => {
        const { loggedProfile } = this.props;
        this.context.router.push(`${loggedProfile.get('akashaId')}/${to}`);
    }
    _handleReply = (ev, parentCommentId) => {
        this.setState({
            replyTo: parentCommentId
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
        const { comments, publishingComments, newlyCreatedComments, intl,
            fetchingComments } = this.props;
        const { loggedProfile, entryAuthorProfile } = this.props;
        return (
          <div>
            {publishingComments.map((comment, key) =>
              <Comment
                key={`${key}-publishingComments`}
                comment={comment}
                loggedProfile={loggedProfile}
                entryAuthorProfile={entryAuthorProfile}
                isPublishing
                onAuthorNameClick={this._handleNavigation}
                onReply={ev => this._handleReply(ev, 'comment')}
              />
            )}
            {newlyCreatedComments.map((comment, key) =>
              <Comment
                key={`${key}-newComments`}
                comment={comment}
                loggedProfile={loggedProfile}
                entryAuthorProfile={entryAuthorProfile}
                onReply={ev => this._handleReply(ev, 'comment')}
                onAuthorNameClick={this._handleNavigation}
              />
            )}
            {comments.filter(comm => comm.getIn(['data', 'parent']) === '0').map((comment, key) =>
              <Comment
                key={`${key}-fetchedComments`}
                comment={comment}
                loggedProfile={loggedProfile}
                entryAuthorProfile={entryAuthorProfile}
                onReply={ev => this._handleReply(ev, comment.get('commentId'))}
                onAuthorNameClick={this._handleNavigation}
              >
                {this.state.replyTo === comment.get('commentId') &&
                  <CommentEditor
                    profileAvatar={this.props.profileAvatar}
                    profileUserInitials={this.props.profileUserInitials}
                    onCommentCreate={this.props.onReplyCreate}
                  />
                }
              </Comment>
            )}
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
    entryAuthorProfile: React.PropTypes.string,
    publishingComments: React.PropTypes.shape(),
    newlyCreatedComments: React.PropTypes.shape(),
    onLoadMoreRequest: React.PropTypes.func,
    commentsCount: React.PropTypes.number,
    fetchLimit: React.PropTypes.number,
    fetchingComments: React.PropTypes.bool,
    entryId: React.PropTypes.number,
    intl: React.PropTypes.shape()
};
CommentsList.contextTypes = {
    router: React.PropTypes.shape()
};
export default injectIntl(CommentsList);
