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
            editorState = editorStateFromRaw(content.toJS());
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
    // _handleKeyPress = (ev) => {
    //     if (ev.key === 'Enter') {
    //         this.editor.focus();
    //     }
    // }
    _renderSidebar = ({ plugins, editorState, onChange }) => {
        const { showSidebar, readOnly, showTerms } = this.props;
        if (showSidebar && !readOnly) {
            return (
              <EditorSidebar
                plugins={plugins}
                editorState={editorState}
                onChange={onChange}
                showTerms={showTerms}
              />);
        }
        return null;
    };

    render () {
        const { showTitle, titlePlaceholder, editorPlaceholder, readOnly } = this.props;
        return (
          <div className="editor" style={{ textAlign: 'left' }}>
            <div>
              {showTitle && !readOnly &&
                <div className={styles.title}>
                  <div className={styles.titleInner}>
                    <textarea
                      type="text"
                      className={styles.inputField}
                      placeholder={titlePlaceholder}
                      onChange={this._handleTitleChange}
                      value={this.state.title}
                      onKeyPress={this._handleKeyPress}
                      tabIndex="0"
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
                readOnly={readOnly}
                sidebarRendererFn={this._renderSidebar}
                editorState={this.state.editorState}
                onChange={this._handleEditorChange}
                plugins={[imagePlugin]}
                placeholder={editorPlaceholder}
                tabIndex="0"
              />
            </div>
          </div>
        );
    }
}
EntryEditor.defaultProps = {
    showSidebar: true,
    showTitle: true,
    readOnly: false,
    editorPlaceholder: 'write something',
    titlePlaceholder: 'write a title'
};

EntryEditor.propTypes = {
    showTerms: PropTypes.func,
    title: PropTypes.string,
    editorRef: PropTypes.func,
    readOnly: PropTypes.bool,
    content: PropTypes.shape(),
    showTitle: PropTypes.bool,
    onAutosave: PropTypes.func,
    editorPlaceholder: PropTypes.string,
    titlePlaceholder: PropTypes.string,
    showSidebar: PropTypes.bool
};

export default EntryEditor;
