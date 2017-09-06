import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { entryMessages } from '../../locale-data/messages';
import { CommentThread, DataLoader } from '../';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectAllComments, selectCommentsFlag, selectLoggedProfileData,
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
        const { comments, fetchingComments, fetchingMoreComments, pendingComments, profiles } = this.props;
        if (
            !nextProps.comments.equals(comments) ||
            nextProps.fetchingComments !== fetchingComments ||
            nextProps.fetchingMoreComments !== fetchingMoreComments ||
            !nextProps.pendingComments.equals(pendingComments) ||
            !nextProps.profiles.equals(profiles) ||
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

    resetReplies = () => {
        this.setState({
            replyTo: null
        });
    };

    render () {
        const { comments, containerRef, entry, fetchingComments, fetchingMoreComments, getTriggerRef, intl,
            loggedProfileData, moreComments, pendingComments, profiles } = this.props;

        return (
          <div className="comment-list">
            {comments.size > 0 &&
              <CommentThread
                actionAdd={this.props.actionAdd}
                comments={comments}
                containerRef={containerRef}
                depth={1}
                entryAuthor={entry.getIn(['entryEth', 'publisher'])}
                entryId={entry.get('entryId')}
                loggedProfileData={loggedProfileData}
                onReply={this.handleReply}
                onReplyClose={this.resetReplies}
                parentId="0"
                pendingComments={pendingComments}
                profiles={profiles}
                replyTo={this.state.replyTo}
              />
            }
            {fetchingComments &&
              <div className="comment-list__loading">
                {`${intl.formatMessage(entryMessages.loadingComments)}...`}
              </div>
            }
            {moreComments &&
              <div className="comment-list__loader-wrapper">
                <DataLoader flag={fetchingMoreComments} size={30}>
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
    actionAdd: PropTypes.func.isRequired,
    comments: PropTypes.shape(),
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape(),
    fetchingComments: PropTypes.bool,
    fetchingMoreComments: PropTypes.bool,
    getTriggerRef: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape().isRequired,
    moreComments: PropTypes.bool,
    pendingComments: PropTypes.shape(),
    profiles: PropTypes.shape(),
};

function mapStateToProps (state) {
    const entry = state.entryState.get('fullEntry');
    return {
        comments: selectAllComments(state),
        entry,
        fetchingComments: entry && selectCommentsFlag(state, 'fetchingComments'),
        fetchingMoreComments: entry && selectCommentsFlag(state, 'fetchingMoreComments'),
        loggedProfileData: selectLoggedProfileData(state),
        moreComments: state.commentsState.get('moreComments'),
        pendingComments: selectPendingComments(state, entry.get('entryId')),
        profiles: state.profileState.get('byId')
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd
    }
)(injectIntl(CommentList));
