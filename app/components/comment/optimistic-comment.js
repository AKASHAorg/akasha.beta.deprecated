import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import DraftJS from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import classNames from 'classnames';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import decorateComponentWithProps from 'decorate-component-with-props';
import { Spin } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { entryMessages } from '../../locale-data/messages';
import { ProfilePopover, VotePopover } from '../';
import CommentImage from './comment-image';
import createHighlightPlugin from './plugins/highlight-plugin';

const { convertFromRaw, EditorState } = DraftJS;

class OptimisticComment extends Component {
    constructor (props) {
        super(props);

        this.editorState = EditorState.createEmpty();
        const rawContent = JSON.parse(props.comment.getIn(['payload', 'content']));
        const content = convertFromRaw(rawContent);
        this.state = {
            editorState: EditorState.createWithContent(content),
            isExpanded: null
        };

        const wrappedComponent = decorateComponentWithProps(CommentImage, {
            readOnly: true
        });
        this.emojiPlugin = createEmojiPlugin({ imagePath: 'images/emoji-svg/' });
        this.highlightPlugin = createHighlightPlugin();
        this.imagePlugin = createImagePlugin({ imageComponent: wrappedComponent });
    }

    componentDidMount () {
        let { isExpanded } = this.state;
        let contentHeight;
        if (this.editorWrapperRef) {
            contentHeight = this.editorWrapperRef.getBoundingClientRect().height;
        }
        if (contentHeight > 170) {
            isExpanded = false;
        }
        return this.setState({ // eslint-disable-line react/no-did-mount-set-state
            isExpanded
        });
    }

    toggleExpanded = (ev, isExpanded) => {
        ev.preventDefault();
        this.setState({
            isExpanded
        });
    };

    onChange = (editorState) => { this.setState({ editorState }); };

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

    render () {
        const { comment, containerRef, intl, loggedAkashaId } = this.props;
        const { editorState, isExpanded } = this.state;
        const { date } = comment.payload.toJS();
        const authorClass = classNames('content-link comment__author-name', 'comment__author-name_logged');
        const bodyClass = classNames('comment__body', {
            comment__body_collapsed: isExpanded === false,
            comment__body_expanded: isExpanded === true
        });
        const iconClassName = 'comment__vote-icon';
        const voteProps = { iconClassName, votePending: false, voteWeight: 0 };

        return (
          <div id={`comment-${comment.get('commentId')}`} className="comment">
            <div className="comment__inner">
              <div className="comment__votes">
                <VotePopover
                  disabled
                  onSubmit={() => {}}
                  type={actionTypes.commentUpvote}
                  {...voteProps}
                />
                <span className="comment__score">0</span>
                <VotePopover
                  disabled
                  onSubmit={() => {}}
                  type={actionTypes.commentDownvote}
                  {...voteProps}
                />
              </div>
              <div className="comment__main">
                <div className="flex-center-y comment__header">
                  <ProfilePopover akashaId={loggedAkashaId} containerRef={containerRef}>
                    <div className={authorClass}>
                      {loggedAkashaId}
                    </div>
                  </ProfilePopover>
                  <span className="comment__publish-date">
                    {date && intl.formatRelative(new Date(date))}
                  </span>
                  <Spin className="flex-center" delay={200} />
                </div>
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
                {isExpanded !== null && this.renderExpandButton()}
              </div>
            </div>
          </div>
        );
    }
}

OptimisticComment.propTypes = {
    containerRef: PropTypes.shape(),
    comment: PropTypes.shape(),
    intl: PropTypes.shape(),
    loggedAkashaId: PropTypes.string,
};

export default injectIntl(OptimisticComment);
