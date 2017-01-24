import React from 'react';
import { Avatar } from 'shared-components';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import { RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { entryMessages, generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './comment-editor.scss';

class CommentEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            editorState: editorStateFromRaw(this.props.initialEditorContent)
        };
    }
    shouldComponentUpdate (nextProps, nextState) {
        return nextState.editorState !== this.state.editorState;
    }
    getBaseNode = () => this.baseNodeRef
    resetContent = () => {
        this._resetEditorState();
    }
    _handleCommentChange = (editorState) => {
        this.setState({
            editorState
        });
    }
    _handleCommentCreate = () => {
        this.props.onCommentCreate(editorStateToJSON(this.state.editorState));
    }
    _handleCommentCancel = () => {
        this._resetEditorState();
        if (this.props.onCancel) this.props.onCancel();
    }
    _resetEditorState = () => {
        this.setState({
            editorState: editorStateFromRaw(null)
        });
    }
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
              <div className={`${styles.comment_editor_inner}`}>
                <MegadraftEditor
                  placeholder={placeholder}
                  editorState={this.state.editorState}
                  onChange={this._handleCommentChange}
                  sidebarRendererFn={() => null}
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
                onClick={() => this._handleCommentCreate(null)}
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
    profileAvatar: React.PropTypes.string,
    profileUserInitials: React.PropTypes.string,
    onCommentCreate: React.PropTypes.func,
    intl: React.PropTypes.shape(),
    placeholder: React.PropTypes.string,
    showPublishActions: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
    initialEditorContent: React.PropTypes.shape()
};
export default CommentEditor;
