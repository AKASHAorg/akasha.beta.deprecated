import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MegadraftEditor, DraftJS, createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { RaisedButton } from 'material-ui';
import { Avatar, MentionDecorators, MentionSuggestions } from '../';
import { entryMessages, generalMessages } from '../../locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './comment-editor.scss';

const { CompositeDecorator, EditorState } = DraftJS;

class CommentEditor extends Component {
    constructor (props) {
        super(props);

        this.container = null;
        this.editor = null;

        this.decorators = new CompositeDecorator([MentionDecorators.editableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);

        this.state = {
            editorState: EditorState.createEmpty(this.decorators),
        };
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextState.editorState !== this.state.editorState;
    }

    setSuggestionsRef = (el) => {
        this.suggestionsComponent = el;
    };

    getBaseNode = () => this.baseNodeRef;

    getEditorRef = (el) => {
        this.editor = el;
    }

    getContainerRef = (el) => {
        this.container = el;
    }

    resetContent = () => {
        this._resetEditorState();
    };

    _handleCommentChange = (editorState) => {
        // Ignore "Enter" key press if suggestions list is opened
        const isOpen = this.suggestionsComponent.getIsOpen();
        if (editorState.getLastChangeType() === 'split-block' && isOpen) {
            return;
        }
        this.setState({
            editorState,
        });
    };

    _handleCommentCreate = () => {
        this.props.onCommentCreate(this.state.editorState);
    };

    _handleCommentCancel = () => {
        this._resetEditorState();
        if (this.props.onCancel) this.props.onCancel();
    };

    _resetEditorState = () => {
        this.setState({
            editorState: EditorState.createEmpty(this.decorators)
        });
    };

    render () {
        const { profileAvatar, profileUserInitials, intl, showPublishActions } = this.props;
        let { placeholder } = this.props;
        if (!placeholder) placeholder = `${intl.formatMessage(entryMessages.writeComment)}...`;

        return (
          <div className={`${styles.comment_writer} row`} ref={(baseNode) => { this.baseNodeRef = baseNode; }}>
            <div className={`${styles.avatar_image} col-xs-1 start-xs`}>
              <Avatar
                image={profileAvatar}
                userInitials={profileUserInitials}
                radius={48}
                userInitialsStyle={{ fontSize: 22, textTransform: 'uppercase', fontWeight: 500 }}
              />
            </div>
            <div className={`${styles.comment_editor} col-xs-11`}>
              <div
                className={`${styles.comment_editor_inner}`}
                ref={this.getContainerRef}
                onFocus={this.onContainerFocus}
              >
                <MegadraftEditor
                  ref={this.getEditorRef}
                  placeholder={placeholder}
                  editorState={this.state.editorState}
                  onChange={this._handleCommentChange}
                  sidebarRendererFn={() => null}
                />
                <MentionSuggestions
                  ref={this.setSuggestionsRef}
                  editorState={this.state.editorState}
                  onChange={this._handleCommentChange}
                  parentRef={this.container}
                />
              </div>
            </div>
            {(this.state.editorState.getCurrentContent().hasText() || showPublishActions) &&
            <div className={`${styles.comment_publish_actions} col-xs-12 end-xs`}>
              <RaisedButton
                label={intl.formatMessage(generalMessages.cancel)}
                onClick={this._handleCommentCancel}
              />
              <RaisedButton
                label={intl.formatMessage(generalMessages.publish)}
                onClick={this._handleCommentCreate}
                primary
                style={{ marginLeft: 8 }}
              />
            </div>
            }
          </div>
        );
    }
}
CommentEditor.propTypes = {
    profileAvatar: PropTypes.string,
    profileUserInitials: PropTypes.string,
    onCommentCreate: PropTypes.func,
    intl: PropTypes.shape(),
    placeholder: PropTypes.string,
    showPublishActions: PropTypes.bool,
    onCancel: PropTypes.func,
};

export default CommentEditor;
