import React, { Component, PropTypes } from 'react';
import { IconButton, TextField } from 'material-ui';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from "megadraft";
import { stateToHTML } from 'draft-js-export-html';
import { convertToRaw } from 'draft-js';
import { getResizedImages } from '../../utils/imageUtils';
import clickAway from '../../utils/clickAway';
import styles from './style.css';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';
import imagePlugin from './plugins/image/image-plugin';

class EntryEditor extends Component {
    constructor (props) {
        super(props);

        this.state = {
            editorState: editorStateFromRaw(null)
        };
    }
    componentDidMount () {
        if (!this.state.readOnly && this.props.title) {
            this.titleInput.focus();
        } else if (this.state.readOnly) {
            this.editor.focus();
        }
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
    render () {
        return (
          <div className="editor" style={{ textAlign: 'left' }}>
            <div>
              <MegadraftEditor
                ref={(edtr) => {
                    this.editor = edtr;
                    if (this.props.editorRef) {
                        this.props.editorRef(this);
                    }
                }}
                editorState={this.state.editorState}
                onChange={this._handleEditorChange}
                plugins={[imagePlugin]}
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
