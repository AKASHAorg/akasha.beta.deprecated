import React, { Component, PropTypes } from 'react';
import { IconButton, TextField } from 'material-ui';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from "megadraft";
import { stateToHTML } from 'draft-js-export-html';
import { convertToRaw } from 'draft-js';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';
import { getResizedImages } from '../../utils/imageUtils';
import EditorSidebar from './sidebar/editor-sidebar';
import clickAway from '../../utils/clickAway';
import styles from './style.scss';
import imagePlugin from './plugins/image/image-plugin';

class EntryEditor extends Component {
    constructor (props) {
        super(props);
        const { content, title } = this.props;
        let editorState = editorStateFromRaw(null);
        if (content) {
            editorState = editorStateFromRaw(content);
        }

        this.state = {
            editorState,
            title
        };
    }
    getRawContent = () => convertToRaw(this.state.editorState.getCurrentContent());
    getContent = () => this.state.editorState.getCurrentContent();
    getHtmlContent = () => stateToHTML(this.state.editorState.getCurrentContent());
    getTitle = () => this.state.title;
    componentClickAway = () => {};
    focus = () => {};
    blur = () => {};
    _handleEditorChange = (editorState) => {
        this.setState({
            editorState,
        });
        if (this.props.onAutosave) {
            this.props.onAutosave();
        }
    };
    _addImage = () => {};
    _handleTitleChange = (ev) => {
        this.setState({
            title: ev.target.value
        });
    };
    _handleKeyPress = (ev) => {
        if (ev.charCode === 13) {
            this.editor.focus();
        }
    }
    _renderSidebar = ({ plugins, editorState, onChange }) =>
      <EditorSidebar
        plugins={plugins}
        editorState={editorState}
        onChange={onChange}
      />;

    render () {
        const { showTitle } = this.props;
        return (
          <div className="editor" style={{ textAlign: 'left' }}>
            <div>
              {showTitle &&
                <div className={styles.title}>
                  <div className={styles.titleInner}>
                    <textarea
                      type="text"
                      className={styles.inputField}
                      placeholder={`Write a title`}
                      onChange={this._handleTitleChange}
                      value={this.state.title}
                      onKeyPress={this._handleKeyPress}
                    />
                  </div>
                </div>
              }
              <MegadraftEditor
                ref={(edtr) => {
                    this.editor = edtr;
                    if (this.props.editorRef) {
                        this.props.editorRef(this);
                    }
                }}
                sidebarRendererFn={this._renderSidebar}
                editorState={this.state.editorState}
                onChange={this._handleEditorChange}
                plugins={[imagePlugin]}
                placeholder="write something"
              />
            </div>
          </div>
        );
    }
}

EntryEditor.propTypes = {
    onChange: PropTypes.func,
    title: PropTypes.string,
    showTitleField: PropTypes.bool,
    editorRef: PropTypes.func,
    onTitleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    content: PropTypes.object,
    textHint: PropTypes.string
};

export default EntryEditor;
