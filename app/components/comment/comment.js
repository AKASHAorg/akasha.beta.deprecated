import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import DraftJS from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import classNames from 'classnames';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import decorateComponentWithProps from 'decorate-component-with-props';
import { Icon, Tooltip } from 'antd';
import { ProfilePopover, VotePopover } from '../';
import { EntryCommentReply } from '../svg';
import * as actionTypes from '../../constants/action-types';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';
import CommentImage from './comment-image';
import createHighlightPlugin from './plugins/highlight-plugin';

const { convertFromRaw, EditorState } = DraftJS;

class Comment extends Component {
    constructor (props) {
        super(props);

        const content = props.comment.content && convertFromRaw(props.comment.content);
        const editorState = content ? EditorState.createWithContent(content) : EditorState.createEmpty();
        this.state = {
            editorState,
            isExpanded: null,
        };

        const wrappedComponent = decorateComponentWithProps(CommentImage, {
            readOnly: true
        });
        this.emojiPlugin = createEmojiPlugin({ imagePath: 'images/emoji-svg/' });
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

    componentDidMount () {
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
    }

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

    renderExpandButton = () => {
        const { intl } = this.props;
        const label = this.state.isExpanded ?
            intl.formatMessage(entryMessages.showLess) :
            intl.formatMessage(entryMessages.showMore);
        return (
          <div className="flex-center comment__expand-button">
            <div className="content-link" onClick={this.toggleExpanded}>
              {label}
            </div>
          </div>
        );
    };

    renderPlaceholder = () => {
        return (
            <div>PLACEHOLDER</div>
        );
    };

    render () {
        const { comment, containerRef, children, intl, onReply, profiles, resolvingComment,
            showReplyButton } = this.props;

        if (resolvingComment) {
            return this.renderPlaceholder();
        }

        const { editorState, isExpanded } = this.state;
        const publishDate = comment.publishDate;
        const content = comment.content;
        const ethAddress = comment.author.ethAddress;
        const author = profiles.get(ethAddress);
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
        const voteProps = { containerRef, iconClassName, votePending: false, voteWeight: 0 };

        return (
          <div id={`comment-${comment.get('commentId')}`} className="comment">
            <div className="comment__inner">
              <div className="comment__votes">
                <VotePopover
                  onSubmit={() => {}}
                  type={actionTypes.commentUpvote}
                  {...voteProps}
                />
                <span className="comment__score">
                  {comment.score}
                </span>
                <VotePopover
                  onSubmit={() => {}}
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
                {!content &&
                  <div className="comment__placeholder-icon">
                    <Tooltip
                      getPopupContainer={() => containerRef || document.body}
                      title={intl.formatMessage(entryMessages.unresolvedComment)}
                    >
                      <Icon className="comment__placeholder-icon" type="share-alt" />
                    </Tooltip>
                  </div>
                }
                {!content &&
                  <div className="comment__placeholder">Cannot resolve content</div>
                }
                {isExpanded !== null && this.renderExpandButton()}
                {showReplyButton && content &&
                  <div className="flex-center-y comment__actions">
                    <div
                      className="content-link flex-center-y comment__reply-button"
                      onClick={() => onReply(comment.commentId)}
                    >
                      <svg viewBox="0 0 20 20">
                        <EntryCommentReply />
                      </svg>
                      <span>{intl.formatMessage(generalMessages.reply)}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
            {children &&
              <div className="comment__replies">
                {children}
              </div>
            }
          </div>
        );
    }
}

Comment.propTypes = {
    children: PropTypes.node,
    comment: PropTypes.shape(),
    containerRef: PropTypes.shape(),
    ethAddress: PropTypes.string,
    intl: PropTypes.shape(),
    loggedEthAddress: PropTypes.string,
    onReply: PropTypes.func,
    profiles: PropTypes.shape(),
    resolvingComment: PropTypes.bool,
    showReplyButton: PropTypes.bool,
};

export default injectIntl(Comment);
