import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataLoader } from 'shared-components';
import { entryMessages } from '../../locale-data/messages';
import { CommentThread } from '../';
import { commentsAddPublishAction } from '../../local-flux/actions/comments-actions';
import { selectAllComments, selectCommentsFlag, selectLoggedProfileData,
    selectPendingComments } from '../../local-flux/selectors';
import { getInitials } from '../../utils/dataModule';

class CommentsList extends Component {
    state = {
        replyTo: null
    };

    componentWillReceiveProps (nextProps) {
        const { pendingComments } = nextProps;
        if (pendingComments.size > this.props.pendingComments.size) {
            this.resetReplies();
        }
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
        const { comments, entry, fetchingComments, fetchingMoreComments, getTriggerRef, intl,
            loggedProfileData, moreComments, pendingComments, profiles } = this.props;
        const initials = getInitials(loggedProfileData.firstName, loggedProfileData.lastName);
        return (
          <div>
            {comments.size > 0 &&
              <CommentThread
                comments={comments}
                commentsAddPublishAction={this.props.commentsAddPublishAction}
                depth={1}
                entryAuthorProfile={entry.getIn(['entryEth', 'publisher'])}
                entryId={entry.get('entryId')}
                loggedProfile={loggedProfileData}
                onReply={this.handleReply}
                onReplyCancel={this.resetReplies}
                parentId="0"
                pendingComments={pendingComments}
                profileAvatar={loggedProfileData.get('avatar')}
                profiles={profiles}
                profileUserInitials={initials}
                replyTo={this.state.replyTo}
              />
            }
            {fetchingComments &&
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                {`${intl.formatMessage(entryMessages.loadingComments)}...`}
              </div>
            }
            {moreComments &&
              <div style={{ height: '35px' }}>
                <DataLoader flag={fetchingMoreComments} size={30}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div ref={getTriggerRef} style={{ height: 0 }} />
                  </div>
                </DataLoader>
              </div>
            }
          </div>
        );
    }
}

CommentsList.propTypes = {
    comments: PropTypes.shape(),
    commentsAddPublishAction: PropTypes.func.isRequired,
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
        commentsAddPublishAction
    }
)(injectIntl(CommentsList));
