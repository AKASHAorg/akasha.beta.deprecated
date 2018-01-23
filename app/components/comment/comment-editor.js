import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DraftJS from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkPlugin from 'draft-js-anchor-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import classNames from 'classnames';
import decorateComponentWithProps from 'decorate-component-with-props';
import { Tooltip } from 'antd';
import { Avatar, Icon, LinkPopover, ProfilePopover } from '../';
import * as actionTypes from '../../constants/action-types';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import clickAway from '../../utils/clickAway';
import { getMentionsFromEditorState, hasEntity } from '../../utils/editorUtils';
import AddImage from './add-image';
import CommentImage from './comment-image';
import createHighlightPlugin from './plugins/highlight-plugin';

const { AtomicBlockUtils, convertToRaw, EditorState, RichUtils, SelectionState } = DraftJS;
const { handleKeyCommand, toggleInlineStyle, toggleBlockType } = RichUtils;

const config = {
    imagePath: 'https://ipfs.io/ipfs/QmdEkyy4pmcmDhAe5XjsAokhXMFMvNTVzoELnxfpUGhmQv/emoji-svg/',
    allowImageCache: true
};

const inlineStyleActions = [{
    icon: 'bold',
    style: 'BOLD'
}, {
    icon: 'italic',
    style: 'ITALIC'
}, {
    icon: 'underline',
    style: 'UNDERLINE'
}];

const blockStyleActions = [{
    icon: 'quote',
    style: 'blockquote'
}];

class CommentEditor extends Component {
    constructor (props) {
        super(props);

        this.editor = null;

        this.state = {
            editorFocused: props.parent !== '0',
            editorState: EditorState.createEmpty(),
            left: null,
            linkPopoverVisible: false,
            top: null
        };

        const wrappedComponent = decorateComponentWithProps(CommentImage, {
            removeImage: this.removeAtomicBlock
        });

        this.linkPlugin = createLinkPlugin();
        this.emojiPlugin = createEmojiPlugin(config);
        this.highlightPlugin = createHighlightPlugin();
        this.imagePlugin = createImagePlugin({ imageComponent: wrappedComponent });
    }

    componentDidMount () {
        if (this.props.parent !== '0' && this.editor) {
            setTimeout(this.editor.focus, 0);
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.replyTo && !this.props.replyTo) {
            this.setState({
                editorFocused: false
            });
        }
    }

    componentClickAway = () => {
        const { onClose, parent } = this.props;
        const { editorFocused } = this.state;
        if (!editorFocused) {
            return;
        }
        const shouldCloseEditor = parent !== '0' && !this.hasText();
        if (shouldCloseEditor) {
            onClose();
        } else {
            this.setState({
                editorFocused: false
            });
        }
    };

    getBaseNodeRef = (el) => { this.baseNodeRef = el; };

    getEditorRef = (el) => { this.editor = el; };

    scrollIntoView = () => this.baseNodeRef && this.baseNodeRef.scrollIntoViewIfNeeded();

    hasText = () => this.state.editorState.getCurrentContent().hasText();

    textSelected = () => {
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 && selection.getRangeAt(0);
        return range.startOffset !== range.endOffset;
    };

    insertHighlight = (highlight) => { // eslint-disable-line consistent-return
        if (this.hasText()) {
            return null;
        }
        const { editorState } = this.state;
        const type = 'highlight';
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', { highlight });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        );
        let newContent = newEditorState.getCurrentContent();
        const firstBlockKey = newContent.getFirstBlock().getKey();
        const blockMap = newContent.getBlockMap().delete(firstBlockKey);
        newContent = newContent.merge({ blockMap });
        const editorWithoutBlock = EditorState.push(newEditorState, newContent);
        this.onChange(editorWithoutBlock, this.scrollIntoView);
    };

    onAddLink = (url) => {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent()
            .createEntity('LINK', 'MUTABLE', { url });
        const entityKey = contentState.getLastCreatedEntityKey();
        const withLink = RichUtils.toggleLink(
            editorState,
            editorState.getSelection(),
            entityKey
        );

        setTimeout(this.editor.focus, 0);
        this.setState({
            editorState: withLink,
            linkPopoverVisible: false
        });
    };

    onWrapperClick = () => {
        if (this.editor) {
            setTimeout(this.editor.focus, 0);
        }
        this.setState({
            editorFocused: true
        });
    };

    onChange = (editorState, cb) => {
        const callback = cb && typeof cb === 'function' ? cb : null;
        const contentState = editorState.getCurrentContent();
        const { anchorKey } = editorState.getSelection().toJS();
        const firstBlock = contentState.getFirstBlock();
        const isFirstBlockAtomic = firstBlock.getType() === 'atomic';
        const isFirstBlockSelected = firstBlock.getKey() === anchorKey;
        const lastChangeType = editorState.getLastChangeType();
        // remove selected atomic block when pressing backspace
        if (isFirstBlockAtomic && isFirstBlockSelected && lastChangeType === 'backspace-character') {
            this.removeAtomicBlock(firstBlock.getKey());
        } else {
            this.setState({
                editorState,
            }, callback);
        }
    };

    showLinkPopover = () => {
        const { top, left } = this.getPopoverPosition();
        this.setState({ linkPopoverVisible: true, top, left });
    };

    hideLinkPopover = () => {
        this.setState({ linkPopoverVisible: false });
    };

    removeAtomicBlock = (blockKey) => {
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();
        const keyAfter = content.getKeyAfter(blockKey);
        const keyBefore = content.getKeyBefore(blockKey);
        let key;
        let offset;
        if (keyAfter) {
            key = keyAfter;
            offset = 0;
        } else if (keyBefore) {
            key = keyBefore;
            offset = content.getBlockForKey(keyBefore).getLength();
        }
        const blockMap = content.getBlockMap().delete(blockKey);
        const withoutAtomicBlock = content.merge({
            blockMap, selectionAfter: selection
        });
        let newState = EditorState.push(
            editorState, withoutAtomicBlock, 'remove-range'
        );
        if (key) {
            const newSelection = new SelectionState({
                anchorKey: key,
                anchorOffset: offset,
                focusKey: key,
                focusOffset: offset
            });
            newState = EditorState.forceSelection(newState, newSelection);
        }
        this.onChange(newState);
    };

    handleCommentCreate = () => {
        const { actionAdd, entryId, entryTitle, ethAddress, loggedProfileData, parent } = this.props;
        const { editorState } = this.state;
        const mentions = getMentionsFromEditorState(editorState);
        const rawContent = convertToRaw(editorState.getCurrentContent());
        this.setState({
            editorFocused: false
        });
        const payload = {
            content: JSON.stringify(rawContent),
            date: new Date().toISOString(),
            entryId,
            entryTitle,
            ethAddress,
            mentions,
            parent,
            nonPersistentFields: ['content', 'mentions']
        };
        actionAdd(loggedProfileData.get('ethAddress'), actionTypes.comment, payload);
    };

    resetEditorState = () => {
        this.setState({
            editorState: EditorState.createEmpty()
        });
    };

    handleKeyCommand = (command) => {
        const { editorState } = this.state;
        const newState = handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    };

    isInlineAction = style => !!inlineStyleActions.find(act => act.style === style);

    isActionActive = (action) => {
        const { editorState } = this.state;
        if (this.isInlineAction(action.style)) {
            return editorState.getCurrentInlineStyle().has(action.style);
        }
        const selection = editorState.getSelection();
        const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();
        return blockType === action.style;
    };

    actionHandler = (style) => {
        if (this.isInlineAction(style)) {
            this.onChange(toggleInlineStyle(this.state.editorState, style));
        } else {
            this.onChange(toggleBlockType(this.state.editorState, style));
        }
    };

    getPopoverPosition = () => {
        if (!window.getSelection().rangeCount) {
            return { top: 0, left: 0 };
        }
        const selection = window.getSelection().getRangeAt(0);
        const selectionRect = selection.getBoundingClientRect();
        const editorWrapperRect = this.editorWrapper.getBoundingClientRect();
        const selectionWidth = selectionRect.right - selectionRect.left;
        const offsetLeft = selectionRect.left - editorWrapperRect.left;
        const top = selectionRect.top - editorWrapperRect.top;
        const left = (offsetLeft + (selectionWidth / 2)) - 100;
        return { top, left };
    };

    removeLink = () => {
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        this.setState({
            editorState: RichUtils.toggleLink(editorState, selection, null)
        });
    };

    renderAction = (action, index) => {
        const className = classNames('content-link comment-editor__toolbar-button', {
            'comment-editor__toolbar-button_active': this.isActionActive(action)
        });
        return (
          <div
            className={className}
            key={action.style || index}
            // Do not remove ev.preventDefault() from "onMouseDown" handler
            // See: https://github.com/facebook/draft-js/issues/696
            onMouseDown={(ev) => { ev.preventDefault(); this.actionHandler(action.style); }}
          >
            <Icon type={action.icon} />
          </div>
        );
    };

    renderToolbarActions = () => {
        const { intl } = this.props;
        const linkDisabled = !this.textSelected() && !this.state.linkPopoverVisible;
        let isLinkSelected;
        if (!linkDisabled) {
            isLinkSelected = hasEntity(this.state.editorState, 'LINK');
        }
        const linkHandler = isLinkSelected ? this.removeLink : this.showLinkPopover;
        const linkClassName = classNames('comment-editor__link-icon', {
            'comment-editor__link-icon_disabled': linkDisabled,
            'content-link': !linkDisabled
        });
        const buttonClass = classNames('comment-editor__toolbar-button', {
            'comment-editor__toolbar-button_active': !linkDisabled && isLinkSelected
        });

        return (
          <div className="flex-center-y comment-editor__toolbar-actions">
            {inlineStyleActions.map(this.renderAction)}
            <div className={buttonClass}>
              <Tooltip title={!linkDisabled ? undefined : intl.formatMessage(entryMessages.linkDisabled)}>
                <Icon
                  className={linkClassName}
                  onClick={!linkDisabled ? linkHandler : undefined}
                  onMouseDown={(ev) => { ev.preventDefault(); }}
                  type="linkEntry"
                />
              </Tooltip>
            </div>
            <div className="comment-editor__separator" />
            <div className="comment-editor__toolbar-button">
              <AddImage
                editorState={this.state.editorState}
                onChange={this.onChange}
              />
            </div>
            {blockStyleActions.map(this.renderAction)}
          </div>
        );
    };

    render () {
        const { containerRef, intl, loggedProfileData } = this.props;
        let { placeholder } = this.props;
        const { editorFocused, editorState, left, linkPopoverVisible, top } = this.state;
        const { EmojiSuggestions, EmojiSelect } = this.emojiPlugin;
        const contentState = editorState.getCurrentContent();
        const hasText = contentState.hasText();
        const showToolbar = editorFocused || hasText;
        const shouldHidePlaceholder = contentState.getBlockMap().first().getType() !== 'unstyled';
        const boxClass = classNames('comment-editor__editor-box', {
            'comment-editor__editor-box_empty': !showToolbar
        });
        const wrapperClass = classNames('comment-editor__editor-wrapper', {
            'comment-editor__editor-wrapper_hide-placeholder': shouldHidePlaceholder
        });
        const publishClass = classNames('comment-editor__publish-button', {
            'comment-editor__publish-button_disabled': !hasText,
            'content-link': hasText
        });

        if (!placeholder) {
            placeholder = `${intl.formatMessage(entryMessages.writeComment)}...`;
        }

        return (
          <div className="comment-editor" ref={this.getBaseNodeRef}>
            <div className="comment-editor__avatar">
              <ProfilePopover
                containerRef={containerRef}
                ethAddress={loggedProfileData.get('ethAddress')}
              >
                <Avatar
                  firstName={loggedProfileData.get('firstName')}
                  image={loggedProfileData.get('avatar')}
                  lastName={loggedProfileData.get('lastName')}
                  size="small"
                />
              </ProfilePopover>
            </div>
            <div
              className={boxClass}
              ref={this.getContainerRef}
            >
              <div
                className="comment-editor__editor-area"
                onClick={this.onWrapperClick}
              >
                <div
                  className={wrapperClass}
                  ref={(el) => { this.editorWrapper = el; }}
                >
                  <Editor
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    placeholder={placeholder}
                    plugins={[this.emojiPlugin, this.highlightPlugin, this.imagePlugin, this.linkPlugin]}
                    ref={this.getEditorRef}
                  />
                </div>
                <EmojiSelect />
                <EmojiSuggestions />
              </div>
              {linkPopoverVisible &&
                <LinkPopover
                  left={left}
                  onClose={this.hideLinkPopover}
                  onSubmit={this.onAddLink}
                  top={top}
                />
              }
              {showToolbar &&
                <div className="comment-editor__toolbar">
                  {this.renderToolbarActions()}
                  <div
                    className={publishClass}
                    onClick={this.handleCommentCreate}
                  >
                    {intl.formatMessage(generalMessages.publish)}
                  </div>
                </div>
              }
            </div>
          </div>
        );
    }
}

CommentEditor.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    containerRef: PropTypes.shape(),
    entryId: PropTypes.string.isRequired,
    entryTitle: PropTypes.string.isRequired,
    ethAddress: PropTypes.string.isRequired,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    onClose: PropTypes.func,
    parent: PropTypes.string,
    placeholder: PropTypes.string,
    replyTo: PropTypes.string
};

export default clickAway(CommentEditor);
