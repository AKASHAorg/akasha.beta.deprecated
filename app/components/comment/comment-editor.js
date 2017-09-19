import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MegadraftIcons } from 'megadraft';
import DraftJS from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import classNames from 'classnames';
import decorateComponentWithProps from 'decorate-component-with-props';
import { Avatar, ProfilePopover } from '../';
import * as actionTypes from '../../constants/action-types';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import clickAway from '../../utils/clickAway';
import { getMentionsFromEditorState } from '../../utils/editorUtils';
import AddImage from './add-image';
import CommentImage from './comment-image';

const { convertToRaw, EditorState, RichUtils, SelectionState } = DraftJS;
const { handleKeyCommand, toggleInlineStyle, toggleBlockType } = RichUtils;

const config = {
    theme: {
        emoji: 'draftJsEmojiPlugin__emoji__2oqBk',
        emojiSuggestions: 'draftJsEmojiPlugin__emojiSuggestions__2ffcV',
        emojiSuggestionsEntry: 'draftJsEmojiPlugin__emojiSuggestionsEntry__2-2p_',
        emojiSuggestionsEntryFocused: 'draftJsEmojiPlugin__emojiSuggestionsEntryFocused__XDntY',
        emojiSuggestionsEntryText: 'draftJsEmojiPlugin__emojiSuggestionsEntryText__2sPjk',
        emojiSuggestionsEntryIcon: 'draftJsEmojiPlugin__emojiSuggestionsEntryIcon__1qC2V',
        emojiSelect: 'comment-editor__emoji-select',
        emojiSelectButton: 'comment-editor__emoji-select-button',
        emojiSelectButtonPressed: 'comment-editor__emoji-select-button_pressed',
        emojiSelectPopover: 'comment-editor__emoji-select-popover',
        emojiSelectPopoverClosed: 'comment-editor__emoji-select-popover-closed',
        emojiSelectPopoverTitle: 'comment-editor__emoji-select-popover-title',
        emojiSelectPopoverGroups: 'comment-editor__emoji-select-popover-groups',
        emojiSelectPopoverGroup: 'draftJsEmojiPlugin__emojiSelectPopoverGroup__2J_ye',
        emojiSelectPopoverGroupTitle: 'draftJsEmojiPlugin__emojiSelectPopoverGroupTitle__2gFs6',
        emojiSelectPopoverGroupList: 'draftJsEmojiPlugin__emojiSelectPopoverGroupList__IYtlu',
        emojiSelectPopoverGroupItem: 'draftJsEmojiPlugin__emojiSelectPopoverGroupItem__2hlBb',
        emojiSelectPopoverToneSelect: 'draftJsEmojiPlugin__emojiSelectPopoverToneSelect__2GSYa',
        emojiSelectPopoverToneSelectList: 'draftJsEmojiPlugin__emojiSelectPopoverToneSelectList__2iPME',
        emojiSelectPopoverToneSelectItem: 'draftJsEmojiPlugin__emojiSelectPopoverToneSelectItem__3VVdN',
        emojiSelectPopoverEntry: 'draftJsEmojiPlugin__emojiSelectPopoverEntry__3nQtJ',
        emojiSelectPopoverEntryFocused: 'draftJsEmojiPlugin__emojiSelectPopoverEntryFocused__GHigP',
        emojiSelectPopoverEntryIcon: 'draftJsEmojiPlugin__emojiSelectPopoverEntryIcon__3SzrH',
        emojiSelectPopoverNav: 'comment-editor__emoji-select-popover-nav',
        emojiSelectPopoverNavItem: 'draftJsEmojiPlugin__emojiSelectPopoverNavItem__14K42',
        emojiSelectPopoverNavEntry: 'draftJsEmojiPlugin__emojiSelectPopoverNavEntry__2bPuZ',
        emojiSelectPopoverNavEntryActive: 'draftJsEmojiPlugin__emojiSelectPopoverNavEntryActive__2G0lt',
        emojiSelectPopoverScrollbar: 'draftJsEmojiPlugin__emojiSelectPopoverScrollbar__QWjCt',
        emojiSelectPopoverScrollbarThumb: 'draftJsEmojiPlugin__emojiSelectPopoverScrollbarThumb__1J-ig'
    },
    imagePath: 'images/emoji-svg/'
};

// TODO Remove this temporary "hack"
const Underline = () => (
  <div
    className="flex-center"
    style={{ fontWeight: '800', textDecoration: 'underline', width: '20px', height: '20px', lineHeight: 1 }}
  >
    U
  </div>
);

const inlineStyleActions = [{
    icon: MegadraftIcons.BoldIcon,
    style: 'BOLD'
}, {
    icon: MegadraftIcons.ItalicIcon,
    style: 'ITALIC'
}, {
    icon: Underline,
    style: 'UNDERLINE'
}];

const blockStyleActions = [{
    icon: MegadraftIcons.BlockQuoteIcon,
    style: 'blockquote'
}];

class CommentEditor extends Component {
    constructor (props) {
        super(props);

        this.editor = null;

        this.state = {
            editorFocused: !!props.parent,
            editorState: EditorState.createEmpty(),
        };

        const wrappedComponent = decorateComponentWithProps(CommentImage, {
            removeImage: this.removeImage
        });

        this.emojiPlugin = createEmojiPlugin(config);
        this.imagePlugin = createImagePlugin({ imageComponent: wrappedComponent });
    }

    componentDidMount () {
        if (this.props.parent && this.editor) {
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
        const { editorFocused, editorState } = this.state;
        if (!editorFocused) {
            return;
        }
        const shouldCloseEditor = parent && !editorState.getCurrentContent().hasText();
        if (shouldCloseEditor) {
            onClose();
        } else {
            this.setState({
                editorFocused: false
            });
        }
    };

    getBaseNodeRef = (baseNode) => { this.baseNodeRef = baseNode; };

    getEditorRef = (el) => { this.editor = el; };

    onWrapperClick = () => {
        if (this.editor) {
            setTimeout(this.editor.focus, 0);
        }
        this.setState({
            editorFocused: true
        });
    };

    onChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    removeImage = (blockKey) => {
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
    }

    handleCommentCreate = () => {
        const { actionAdd, entryId, loggedProfileData, parent = '0' } = this.props;
        const { editorState } = this.state;
        const mentions = getMentionsFromEditorState(editorState);
        const rawContent = convertToRaw(editorState.getCurrentContent());
        const payload = {
            content: JSON.stringify(rawContent),
            date: new Date().toISOString(),
            entryId,
            mentions,
            parent,
            nonPersistentFields: ['content', 'mentions']
        };
        actionAdd(loggedProfileData.get('akashaId'), actionTypes.comment, payload);
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
    }

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
    }

    actionHandler = (style) => {
        if (this.isInlineAction(style)) {
            this.onChange(toggleInlineStyle(this.state.editorState, style));
        } else {
            this.onChange(toggleBlockType(this.state.editorState, style));
        }
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
            <action.icon />
          </div>
        );
    };

    renderToolbarActions = () => (
      <div className="flex-center-y comment-editor__toolbar-actions">
        {inlineStyleActions.map(this.renderAction)}
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

    render () {
        const { containerRef, intl, loggedProfileData } = this.props;
        let { placeholder } = this.props;
        const { editorFocused, editorState } = this.state;
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
          <div
            className="comment-editor"
            ref={this.getBaseNodeRef}
          >
            <div className="comment-editor__avatar">
              <ProfilePopover
                akashaId={loggedProfileData.get('akashaId')}
                containerRef={containerRef}
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
              onClick={this.onWrapperClick}
              ref={this.getContainerRef}
            >
              <div className="comment-editor__editor-area">
                <div className={wrapperClass}>
                  <Editor
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    placeholder={placeholder}
                    plugins={[this.emojiPlugin, this.imagePlugin]}
                    ref={this.getEditorRef}
                  />
                </div>
                <EmojiSelect />
                <EmojiSuggestions />
              </div>
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
    entryId: PropTypes.string,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    onClose: PropTypes.func,
    parent: PropTypes.string,
    placeholder: PropTypes.string,
    replyTo: PropTypes.string
};

export default clickAway(CommentEditor);
