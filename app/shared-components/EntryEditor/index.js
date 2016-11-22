import React, { Component, PropTypes } from 'react';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import { stateToHTML } from 'draft-js-export-html';
import { convertToRaw } from 'draft-js';
import EditorSidebar from './sidebar/editor-sidebar';
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
        const { showTitle, textHint } = this.props;
        return (
          <div className="editor" style={{ textAlign: 'left' }}>
            <div>
              {showTitle &&
                <div className={styles.title}>
                  <div className={styles.titleInner}>
                    <textarea
                      type="text"
                      className={styles.inputField}
                      placeholder={textHint}
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
    title: PropTypes.string,
    editorRef: PropTypes.func,
    readOnly: PropTypes.bool,
    content: PropTypes.shape(),
    textHint: PropTypes.string,
    showTitle: PropTypes.bool,
    onAutosave: PropTypes.func
};

export default EntryEditor;
