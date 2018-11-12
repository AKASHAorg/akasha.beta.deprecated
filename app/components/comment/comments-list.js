import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { entryMessages } from '../../locale-data/messages';
import { CommentThread, DataLoader, OptimisticComment } from '../';
import { commentsIterator } from '../../local-flux/actions/comments-actions';
import { getCommentsFlag, selectEntryCommentsByParent, getLoggedProfileData,
    getEntryPendingComments } from '../../local-flux/selectors';

class CommentList extends Component {
    state = {
        replyTo: null
    };

    componentWillReceiveProps (nextProps) {
        const { pendingComments } = nextProps;
        if (pendingComments.size > this.props.pendingComments.size) {
            this.resetReplies();
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        const { comments, commentsCount, commentsFetched, fetchingComments, fetchingMoreComments,
            pendingComments } = this.props;
        if (
            !nextProps.comments.equals(comments) ||
            nextProps.commentsCount !== commentsCount ||
            nextProps.commentsFetched !== commentsFetched ||
            nextProps.fetchingComments !== fetchingComments ||
            nextProps.fetchingMoreComments !== fetchingMoreComments ||
            !nextProps.pendingComments.equals(pendingComments) ||
            nextProps.noCommentsPlaceholderVisible !== this.props.noCommentsPlaceholderVisible ||
            nextState.replyTo !== this.state.replyTo
        ) {
            return true;
        }
        return false;
    }

    handleReply = (parentCommentId) => {
        this.setState({
            replyTo: parentCommentId
        });
    };
    _handleNewComment = () => {
        if (this.props.onNewCommentButtonClick) {
            this.props.onNewCommentButtonClick();
        }
    }
    resetReplies = () => {
        this.setState({
            replyTo: null
        });
    };

    loadComments = () => {
        const { entryId } = this.props;
        this.props.commentsIterator({ context: 'entryPage', entryId, parent: '0' });
    };

    render () { // eslint-disable-line complexity
        const { comments, commentsCount, commentsFetched, containerRef, entryId, fetchingComments,
            fetchingMoreComments, getTriggerRef, intl, loggedProfileData, moreComments,
            pendingComments } = this.props;
        const optimisticComments = pendingComments
            .filter(action => action.getIn(['payload', 'parent']) === '0')
            .reverse()
            .toArray();
        if (!commentsFetched && !fetchingComments && commentsCount) {
            return (
              <div className="comment-list">
                <div
                  className="flex-center-x content-link comment-list__load-comments"
                  onClick={this.loadComments}
                >
                  {intl.formatMessage(entryMessages.loadComments, { commentsCount })}
                </div>
              </div>
            )
        }

        return (
          <div className="comment-list">
            {optimisticComments && optimisticComments.map(commAction => (
              <OptimisticComment
                comment={commAction}
                containerRef={containerRef}
                key={commAction.id}
                loggedProfileData={loggedProfileData}
              />
            ))}
            {!fetchingComments && comments.map(comm => (
              <CommentThread
                comment={comm}
                containerRef={containerRef}
                entryId={entryId}
                key={comm.commentId}
                onReply={this.handleReply}
                onReplyClose={this.resetReplies}
                pendingComments={pendingComments}
                replyTo={this.state.replyTo}
              />
            ))}
            {fetchingComments &&
              <div className="flex-center comment-list__loader-wrapper">
                <Spin />
              </div>
            }
            {!fetchingComments && !commentsCount && !optimisticComments.length &&
              <div className="comment-list__placeholder">
                <div>{intl.formatMessage(entryMessages.noCommentsFound)}</div>
                <div>
                  <div
                    className="comment-list__placeholder-link"
                    onClick={this._handleNewComment}
                  >
                    {intl.formatMessage(entryMessages.leaveAComment)}
                  </div>
                </div>
              </div>
            }
            {moreComments &&
              <div className="comment-list__loader-wrapper_more">
                <DataLoader flag={fetchingMoreComments} size="small">
                  <div className="flex-center">
                    <div className="comment-list__trigger" ref={getTriggerRef} />
                  </div>
                </DataLoader>
              </div>
            }
          </div>
        );
    }
}

CommentList.propTypes = {
    comments: PropTypes.shape().isRequired,
    commentsCount: PropTypes.number,
    commentsFetched: PropTypes.bool,
    commentsIterator: PropTypes.func.isRequired,
    containerRef: PropTypes.shape(),
    entryId: PropTypes.string,
    fetchingComments: PropTypes.bool,
    fetchingMoreComments: PropTypes.bool,
    getTriggerRef: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape().isRequired,
    moreComments: PropTypes.bool,
    pendingComments: PropTypes.shape(),
    onNewCommentButtonClick: PropTypes.func,
};

function mapStateToProps (state) {
    const entry = state.entryState.get('fullEntry');
    const entryId = entry && entry.entryId;
    return {
        comments: selectEntryCommentsByParent(state, entryId, '0'),
        commentsCount: entry && entry.commentsCount,
        commentsFetched: state.commentsState.getIn(['flags', 'commentsFetched', 'entryPage']),
        entryId,
        fetchingComments: getCommentsFlag(state, 'fetchingComments', '0'),
        fetchingMoreComments: getCommentsFlag(state, 'fetchingMoreComments', '0'),
        loggedProfileData: getLoggedProfileData(state),
        moreComments: state.commentsState.getIn(['moreComments', '0']),
        pendingComments: getEntryPendingComments(state, entryId),
    };
}

export default connect(
    mapStateToProps,
    {
        commentsIterator,
    }
)(injectIntl(CommentList));
