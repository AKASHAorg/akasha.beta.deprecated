import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'react-router-dom/Link';
import { injectIntl } from 'react-intl';
import { Card } from 'antd';
import { commentsGetComment } from '../../local-flux/actions/comments-actions';
import { entryGetShort } from '../../local-flux/actions/entry-actions';
import { profileGetData } from '../../local-flux/actions/profile-actions';
import { selectComment, selectEntry, selectLoggedEthAddress, selectPendingComments, selectPendingEntries,
    selectProfile } from '../../local-flux/selectors';
import { generalMessages } from '../../locale-data/messages';
import { CommentThread, EntryCardHeader } from '../';

const ContentPlaceholder = () => (
  <div>
    <div className="content-placeholder entry-card__title_placeholder" style={{ width: '80%' }} />
    <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '16px' }} />
    <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '8px' }} />
  </div>
);

class CommentPage extends Component {
    state = {
        replyTo: null
    };

    componentDidMount () {
        const { entryId, commentId } = this.props.match.params;
        const ethAddress = `0x${this.props.match.params.ethAddress}`;
        const author = { ethAddress };
        const context = 'commentPage';
        this.props.commentsGetComment({ context, entryId, commentId, author });
        this.props.entryGetShort({ context, entryId });
    }

    componentWillReceiveProps (nextProps) {
        const { entry, entryAuthor, pendingComments } = nextProps;
        if (pendingComments.size > this.props.pendingComments.size) {
            this.resetReplies();
        }
        const newEthAddress = entry && entry.getIn(['author', 'ethAddress']);
        if (newEthAddress && !entryAuthor.ethAddress) {
            const context = 'commentPage';            
            this.props.profileGetData({ ethAddress: newEthAddress, context });                    
        }
    }

    getContainerRef = (el) => { this.containerRef = el; };

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

    hasContent = () => {
        const { entry } = this.props;
        const content = entry && entry.get('content');
        const entryType = content && content.get('entryType');
        return (entryType === 1 && content.getIn(['cardInfo', 'title']).length > 0) ||
            (content && !!content.get('title'));
    };

    renderEntryContent = () => {
        const { entry } = this.props;

        return (
          <div>
            <div className="entry-card__title">
              <Link
                className="unstyled-link"
                to={{
                    pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.entryId}`,
                    state: { overlay: true }
                }}
              >
                <span className="content-link">{entry.getIn(['content', 'title'])}</span>
              </Link>
            </div>
            <Link
              className="unstyled-link"
              to={{
                  pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.entryId}`,
                  state: { overlay: true }
              }}
            >
              <div className="entry-card__excerpt">
                <span className="content-link">{entry.getIn(['content', 'excerpt'])}</span>
              </div>
            </Link>            
          </div>
        );
    };

    renderUnresolvedPlaceholder = () => (
      <div style={{ position: 'relative' }}>
        <ContentPlaceholder />
        <div className="entry-card__unresolved">
          <div className="heading flex-center">
            {this.props.intl.formatMessage(generalMessages.noPeersAvailable)}
          </div>
          <div className="flex-center">
            <span className="content-link entry-card__retry-button" onClick={this.onRetry}>
              {this.props.intl.formatMessage(generalMessages.retry)}
            </span>
          </div>
        </div>
      </div>
    );

    render () { // eslint-disable-line complexity
        const { comment, entry, entryAuthor, history, loggedEthAddress, match, pendingComments,
            pendingEntries, parentComment } = this.props;
        const { commentId, entryId } = match.params;
        if (!comment) {
            return null;
        }
        const isOwnEntry = entryAuthor.ethAddress === loggedEthAddress;
        const isPending = pendingEntries && pendingEntries.get(entryId);
        const hasContent = this.hasContent();

        return (
          <div className="comment-page" ref={this.getContainerRef}>
            <div className="comment-page__inner">
              <Card
                className="comment-page__entry-card"
                title={
                  <EntryCardHeader
                    author={entryAuthor}
                    containerRef={this.containerRef}
                    entry={entry}
                    fullWidth
                    isOwnEntry={isOwnEntry}
                    onEntryVersionNavigation={history.push}
                    onDraftNavigation={history.push}
                    loading={isPending}
                  />
                }
              >
                {isPending && <ContentPlaceholder />}
                {!hasContent && !isPending && this.renderUnresolvedPlaceholder()}
                {hasContent && !isPending && this.renderEntryContent()}
              </Card>
              <div className="comment-page__comments">
                <CommentThread
                  context="commentPage"
                  comment={parentComment || comment}
                  entryId={entryId}
                  highlightComment={commentId}
                  containerRef={this.containerRef}
                  onlyReply={parentComment ? comment.commentId : null}
                  onReply={this.handleReply}
                  onReplyClose={this.resetReplies}
                  pendingComments={pendingComments}
                  replyTo={this.state.replyTo}
                />
              </div>
            </div>
          </div>
        );
    }
}

CommentPage.propTypes = {
    comment: PropTypes.shape(),
    commentsGetComment: PropTypes.func.isRequired,
    entry: PropTypes.shape(),
    entryAuthor: PropTypes.shape(),
    entryGetShort: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
    match: PropTypes.shape().isRequired,
    parentComment: PropTypes.shape(),
    pendingComments: PropTypes.shape(),
    pendingEntries: PropTypes.shape(),    
    profileGetData: PropTypes.func.isRequired,    
};

function mapStateToProps (state, ownProps) {
    let { entryId, commentId } = ownProps.match.params;
    const comment = selectComment(state, commentId);
    const entry = selectEntry(state, entryId);
    const parentComment = comment && comment.parent !== '0' ? selectComment(state, comment.parent) : null;
    return {
        comment,
        commentAuthor: comment && selectProfile(state, comment.author.ethAddress),
        entry,
        entryAuthor: entry && selectProfile(state, entry.author.ethAddress),
        loggedEthAddress: selectLoggedEthAddress(state),
        parentComment,
        pendingComments: selectPendingComments(state, entryId),
        pendingEntries: selectPendingEntries(state, 'commentPage'),
    };
}

export default connect(
    mapStateToProps,
    {
        commentsGetComment,
        entryGetShort,
        profileGetData
    }
)(injectIntl(CommentPage));
