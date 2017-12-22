import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import DraftJS from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import classNames from 'classnames';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import decorateComponentWithProps from 'decorate-component-with-props';
import { Icon, ProfilePopover, VotesModal, VotePopover } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { commentsResolveIpfsHash } from '../../local-flux/actions/comments-actions';
import { selectBlockNumber, selectComment, selectCommentVote, selectHideCommentSettings,
    selectLoggedEthAddress, selectPendingCommentVote, selectProfile,
    selectResolvingComment } from '../../local-flux/selectors';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';
import CommentImage from './comment-image';
import createHighlightPlugin from './plugins/highlight-plugin';

const { convertFromRaw, EditorState } = DraftJS;

class Comment extends Component {
    constructor (props) {
        super(props);

        const content = props.comment.content && convertFromRaw(JSON.parse(props.comment.content));
        const editorState = content ? EditorState.createWithContent(content) : EditorState.createEmpty();
        this.state = {
            editorState,
            isHidden: true,
            isExpanded: null,
            showVotes: false
        };

        const wrappedComponent = decorateComponentWithProps(CommentImage, {
            readOnly: true
        });
        this.emojiPlugin = createEmojiPlugin({ imagePath: 'https://ipfs.io/ipfs/QmdEkyy4pmcmDhAe5XjsAokhXMFMvNTVzoELnxfpUGhmQv/emoji-svg/', allowImageCache: true });
        this.highlightPlugin = createHighlightPlugin();
        this.imagePlugin = createImagePlugin({ imageComponent: wrappedComponent });
    }

    componentWillReceiveProps (nextProps) {
        const { comment } = nextProps;
        if (comment.content && !this.props.comment.content) {
            try {
                const content = convertFromRaw(JSON.parse(comment.content));
                this.setState({
                    editorState: EditorState.createWithContent(content)
                });
            } catch (error) {
                console.error('comment content is wrong format', error);
            }
        }
    }

    componentDidUpdate (previousProps) {
        const { resolvingComment } = previousProps;
        if (!this.props.resolvingComment && resolvingComment) {
            this.checkIfExpanded();
        }
    }

    checkIfExpanded = () => {
        const { comment } = this.props;
        let { isExpanded } = this.state;
        let contentHeight;
        if (this.editorWrapperRef) {
            contentHeight = this.editorWrapperRef.getBoundingClientRect().height;
        }
        if (!comment.content) {
            isExpanded = null;
        }
        if (contentHeight > 170) {
            isExpanded = false;
        }
        return this.setState({ // eslint-disable-line react/no-did-mount-set-state
            isExpanded
        });
    };

    isLogged = () => {
        const { comment, loggedEthAddress } = this.props;
        return loggedEthAddress === comment.author.ethAddress;
    };

    isEntryAuthor = () => {
        const { comment, ethAddress } = this.props;
        return comment.author.ethAddress === ethAddress;
    }

    onChange = (editorState) => { this.setState({ editorState }); };

    toggleExpanded = (ev) => {
        ev.preventDefault();
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    };

    openVotesPanel = () => {
        this.setState({
            showVotes: true
        });
    };

    closeVotesPanel = () => {
        this.setState({
            showVotes: false
        });
    };

    showHiddenContent = () => {
        this.setState({
            isHidden: false
        });
    };

    handleVote = ({ type, weight }) => {
        const { comment, entryId, loggedEthAddress } = this.props;
        const payload = {
            commentId: comment.commentId,
            entryId,
            weight
        };
        this.props.actionAdd(loggedEthAddress, type, payload);
    };

    onRetry = () => {
        const { comment } = this.props;
        this.props.commentsResolveIpfsHash([comment.get('ipfsHash')], [comment.get('commentId')]);
    };

    renderExpandButton = () => {
        const { intl } = this.props;
        const { isExpanded } = this.state;
        const label = isExpanded ?
            intl.formatMessage(entryMessages.showLess) :
            intl.formatMessage(entryMessages.showMore);
        const className = classNames('flex-center comment__expand-button', {
            'comment__expand-button_active': !isExpanded
        });
        return (
          <div className={className}>
            <div className="flex-center-y content-link" onClick={this.toggleExpanded}>
              <Icon className="comment__expand-button-icon" type={isExpanded ? 'arrowUp' : 'arrowDown'} />
              {label}
            </div>
          </div>
        );
    };

    renderPlaceholder = () => (
      <div className="comment">
        <div className="comment__inner">
          <div className="comment__votes">
            <div className="content-placeholder comment__votes-placeholder" />
          </div>
          <div className="comment__main">
            <div className="flex-center-y comment__header">
              <div className="content-placeholder comment__author-placeholder" />
              <div className="content-placeholder comment__publish-date-placeholder" />
            </div>
            <div className="content-placeholder comment__content-placeholder" />
            <div
              className="content-placeholder comment__content-placeholder"
              style={{ width: '70%', marginTop: '6px' }}
            />
            <div className="flex-center-y comment__actions">
              <div className="content-placeholder comment__reply-button-placeholder" />
            </div>
          </div>
        </div>
      </div>
    );

    renderHiddenContent = voteProps => (
      <div className="comment">
        <div className="comment__inner">
          <div className="comment__votes">
            <VotePopover
              onSubmit={this.handleVote}
              type={actionTypes.commentUpvote}
              {...voteProps}
            />
            <span className="comment__score content-link" onClick={this.openVotesPanel}>
              {this.props.comment.score}
            </span>
            <VotePopover
              onSubmit={this.handleVote}
              type={actionTypes.commentDownvote}
              {...voteProps}
            />
          </div>
          <div className="comment__main" style={{ position: 'relative' }}>
            <div className="content-placeholder comment__content-placeholder" />
            <div
              className="content-placeholder comment__content-placeholder"
              style={{ width: '70%', marginTop: '6px' }}
            />
            <div className="flex-center-y comment__actions">
              <div className="content-placeholder comment__reply-button-placeholder" />
            </div>
            <div className="comment__hidden">
              <div className="heading flex-center">
                {this.props.intl.formatMessage(entryMessages.hiddenContent, {
                    score: this.props.hideCommentSettings.value
                })}
              </div>
              <div className="heading comment__hidden-message">
                {this.props.intl.formatMessage(entryMessages.hiddenContent2)}
                <Link className="comment__settings-link" to="/profileoverview/settings">
                  {this.props.intl.formatMessage(entryMessages.hiddenContent3)}
                </Link>
              </div>
              <div className="flex-center">
                <span className="content-link comment__retry-button" onClick={this.showHiddenContent}>
                  {this.props.intl.formatMessage(entryMessages.showAnyway)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    renderUnresolvedPlaceholder = () => (
      <div style={{ position: 'relative' }}>
        <div className="content-placeholder comment__content-placeholder" />
        <div
          className="content-placeholder comment__content-placeholder"
          style={{ width: '70%', marginTop: '6px' }}
        />
        <div className="flex-center-y comment__actions">
          <div className="content-placeholder comment__reply-button-placeholder" />
        </div>
        <div className="comment__unresolved">
          <div className="heading flex-center">
            {this.props.intl.formatMessage(generalMessages.noPeersAvailable)}
          </div>
          <div className="flex-center">
            <span className="content-link comment__retry-button" onClick={this.onRetry}>
              {this.props.intl.formatMessage(generalMessages.retry)}
            </span>
          </div>
        </div>
      </div>
    );

    render () { // eslint-disable-line max-statements
        const { author, blockNr, comment, containerRef, children, hideCommentSettings, intl,
            onReply, resolvingComment, showReplyButton, vote, votePending } = this.props;
        const { editorState, isExpanded, isHidden } = this.state;
        const hideContent = !this.isLogged() && hideCommentSettings.checked &&
            comment.score < hideCommentSettings.value && isHidden;
        if (resolvingComment) {
            return this.renderPlaceholder();
        }

        const publishDate = comment.publishDate;
        const content = comment.content;
        let commentText = '';
        try {
            commentText = content ? JSON.parse(content).blocks[0].text : '';
        } catch (error) {
            console.error('comment content is wrong format', error);
        }
        const commentTitle = (commentText.length > 25) ?
            `${commentText.slice(0, 25)}...` :
            commentText;
        const ethAddress = comment.author.ethAddress;
        const akashaId = author && author.get('akashaId');
        const authorClass = classNames('content-link comment__author-name', {
            'comment__author-name_logged': this.isLogged(),
            'comment__author-name_author': !this.isLogged() && this.isEntryAuthor()
        });
        const bodyClass = classNames('comment__body', {
            comment__body_collapsed: isExpanded === false,
            comment__body_expanded: isExpanded === true
        });
        const iconClassName = 'comment__vote-icon';
        const voteProps = { containerRef, iconClassName, isOwnEntity: this.isLogged(), votePending, vote };

        if (content && hideContent) {
            return this.renderHiddenContent(voteProps);
        }

        return (
          <div id={`comment-${comment.get('commentId')}`} className="comment">
            <div className="comment__inner">
              <div className="comment__votes">
                <VotePopover
                  onSubmit={this.handleVote}
                  type={actionTypes.commentUpvote}
                  {...voteProps}
                />
                <span className="comment__score content-link" onClick={this.openVotesPanel}>
                  {comment.score}
                </span>
                <VotePopover
                  onSubmit={this.handleVote}
                  type={actionTypes.commentDownvote}
                  {...voteProps}
                />
              </div>
              <div className="comment__main">
                <div className="flex-center-y comment__header">
                  {author &&
                    <ProfilePopover ethAddress={comment.author.ethAddress} containerRef={containerRef}>
                      <div className={authorClass}>
                        {getDisplayName({ akashaId, ethAddress })}
                      </div>
                    </ProfilePopover>
                  }
                  <span className="comment__publish-date">
                    {publishDate && intl.formatRelative(new Date(publishDate * 1000))}
                  </span>
                </div>
                {content &&
                  <div className={bodyClass} ref={(el) => { this.editorWrapperRef = el; }}>
                    <Editor
                      editorState={editorState}
                      // This is needed because draft-js-plugin-editor applies decorators on onChange event
                      // https://github.com/draft-js-plugins/draft-js-plugins/issues/530
                      onChange={this.onChange}
                      plugins={[this.emojiPlugin, this.highlightPlugin, this.imagePlugin]}
                      readOnly
                    />
                  </div>
                }
                {!content && this.renderUnresolvedPlaceholder()}
                {showReplyButton && content &&
                  <div className="flex-center-y comment__actions">
                    <div
                      className="content-link flex-center-y comment__reply-button"
                      onClick={() => onReply(comment.commentId)}
                    >
                      <Icon type="reply" />
                      <span>{intl.formatMessage(generalMessages.reply)}</span>
                    </div>
                    {isExpanded !== null && this.renderExpandButton()}
                  </div>
                }
              </div>
            </div>
            {children &&
              <div className="comment__replies">
                {children}
              </div>
            }
            {this.state.showVotes &&
              <VotesModal
                closeVotesPanel={this.closeVotesPanel}
                content={comment}
                contentTitle={commentTitle}
                blockNr={blockNr}
              />
            }
          </div>
        );
    }
}

Comment.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    author: PropTypes.shape(),
    blockNr: PropTypes.number,
    children: PropTypes.node,
    comment: PropTypes.shape(),
    commentsResolveIpfsHash: PropTypes.func.isRequired,
    containerRef: PropTypes.shape(),
    entryId: PropTypes.string.isRequired,
    ethAddress: PropTypes.string,
    hideCommentSettings: PropTypes.shape().isRequired,
    intl: PropTypes.shape(),
    loggedEthAddress: PropTypes.string,
    onReply: PropTypes.func,
    resolvingComment: PropTypes.bool,
    showReplyButton: PropTypes.bool,
    vote: PropTypes.string,
    votePending: PropTypes.bool
};

function mapStateToProps (state, ownProps) {
    const { commentId } = ownProps;
    const ethAddress = state.entryState.getIn(['fullEntry', 'author', 'ethAddress']);
    const comment = selectComment(state, commentId);
    return {
        author: selectProfile(state, comment.author.ethAddress),
        blockNr: selectBlockNumber(state),
        comment,
        entryId: state.entryState.getIn(['fullEntry', 'entryId']),
        ethAddress,
        hideCommentSettings: selectHideCommentSettings(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        resolvingComment: selectResolvingComment(state, comment.ipfsHash),
        vote: selectCommentVote(state, commentId),
        votePending: !!selectPendingCommentVote(state, commentId)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        commentsResolveIpfsHash
    }
)(injectIntl(Comment));
