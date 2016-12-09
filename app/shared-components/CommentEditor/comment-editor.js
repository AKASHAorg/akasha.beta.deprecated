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
            editorState: editorStateFromRaw(null)
        };
    }
    _handleCommentChange = (editorState) => {
        this.setState({
            editorState
        });
    }
    _handleCommentCreate = () => {
        this.props.onCommentCreate(editorStateToJSON(this.state.editorState));
        this._resetEditorState();
    }
    _handleCommentCancel = () => {
        this._resetEditorState();
    }
    _resetEditorState = () => {
        this.setState({
            editorState: editorStateFromRaw(null)
        });
    }
    render () {
        const { profileAvatar, profileUserInitials, intl } = this.props;
        return (
          <div className={`${styles.comment_writer}`}>
            <div className={`${styles.avatar_image}`}>
              <Avatar
                image={profileAvatar}
                userInitials={profileUserInitials}
                radius={48}
              />
            </div>
            <div className={`${styles.comment_editor}`}>
              <MegadraftEditor
                placeholder={`${intl.formatMessage(entryMessages.writeComment)}...`}
                editorState={this.state.editorState}
                onChange={this._handleCommentChange}
                sidebarRendererFn={() => null}
              />
            </div>
            {this.state.editorState.getCurrentContent().hasText() &&
            <div className={`${styles.comment_publish_actions} end-xs`}>
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
    intl: React.PropTypes.shape()
};
export default injectIntl(CommentEditor);
