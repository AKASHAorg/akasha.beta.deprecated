import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { entryMessages } from '../../locale-data/messages';
import { CommentThread, DataLoader, OptimisticComment } from '../';
import { selectCommentsFlag, selectEntryCommentsForParent, selectLoggedProfileData,
    selectPendingComments } from '../../local-flux/selectors';

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
        const { comments, fetchingComments, fetchingMoreComments, pendingComments } = this.props;
        if (
            !nextProps.comments.equals(comments) ||
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

    render () {
        const { comments, containerRef, fetchingComments, fetchingMoreComments, getTriggerRef, intl,
            loggedProfileData, moreComments, pendingComments } = this.props;
        const optimisticComments = pendingComments
            .filter(action => action.getIn(['payload', 'parent']) === '0')
            .reverse()
            .toArray();
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
            {comments.map(comm => (
              <CommentThread
                comment={comm}
                containerRef={containerRef}
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
            {!fetchingComments && !comments.size && !optimisticComments.length &&
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
    containerRef: PropTypes.shape(),
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
    const entryId = state.entryState.getIn(['fullEntry', 'entryId']);
    return {
        comments: selectEntryCommentsForParent(state, entryId, '0'),
        fetchingComments: selectCommentsFlag(state, 'fetchingComments', '0'),
        fetchingMoreComments: selectCommentsFlag(state, 'fetchingMoreComments', '0'),
        loggedProfileData: selectLoggedProfileData(state),
        moreComments: state.commentsState.getIn(['moreComments', '0']),
        pendingComments: selectPendingComments(state, entryId),
    };
}

export default connect(mapStateToProps)(injectIntl(CommentList));
