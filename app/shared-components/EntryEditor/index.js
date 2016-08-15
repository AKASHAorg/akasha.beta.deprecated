import React, { Component, PropTypes } from 'react';
import { IconButton, TextField } from 'material-ui';
import {
    Editor,
    EditorState,
    SelectionState,
    ContentState,
    getDefaultKeyBinding,
    CompositeDecorator,
    convertToRaw,
    convertFromRaw,
    AtomicBlockUtils,
    RichUtils,
    Entity } from 'draft-js';
import { getResizedImages } from '../../utils/imageUtils';
import clickAway from '../../utils/clickAway';
import styles from './style.css';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';
import PhotoCircle from 'material-ui/svg-icons/image/add-a-photo';
import { handleStrategy } from './strategies';
import { HandleComponent } from './components';

import EditorToolbar from './components/editor-toolbar';
import rendererFn from './components/custom-renderer';
import { remote } from 'electron';
const { dialog } = remote;

const compositeDecorator = new CompositeDecorator([
    {
        strategy: handleStrategy,
        component: HandleComponent
    }
]);

class EntryEditor extends Component {
    constructor (props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(compositeDecorator),
            showAddButton: false,
            toolbarVisible: false,
            editorEnabled: true,
            readOnly: props.readOnly || false,
            title: ''
        };
    }
    componentDidMount () {
        const readOnly = this.state.readOnly;
        if (!readOnly) {
            this.refs.titleInput.focus();
        }
    }
    getContent = () => convertToRaw(this.state.editorState.getCurrentContent());
    getTitle = () => this.state.title;
    setContent = (content) => {
        this.setState({
            editorState: EditorState.createWithContent(convertFromRaw(content), compositeDecorator)
        });
    }
    setTitle = (title) => this.setState({ title });
    componentClickAway = () => {
        const selection = this.state.editorState.getSelection();
        if (selection.getAnchorKey()) {
            EditorState.forceSelection(this.state.editorState, SelectionState.createEmpty());
        }
    }
    focus = () => {
        if (this.state.toolbarVisible) {
            this._toggleToolbarVisibility(false);
        }
        this.editor.focus();
    }
    blur = () => {
        this.editor.blur();
    }
    toggleAddButton = () => {
        this.setState({
            showAddButton: !this.state.showAddButton
        });
    }
    _handleEditorChange = (editorState) => {
        this.setState({
            editorState,
        }, () => {
            if (this.props.onChange) {
                return this.props.onChange(editorState.getCurrentContent().getPlainText());
            }
            return null;
        });
    }
    _handleEditorContainerClick = (ev) => {
        ev.preventDefault();
        this.focus();
    }
    _handleAddClick = () => {
        this.setState({
            lastSelection: this.state.editorState.getSelection().getAnchorKey(),
            showAddButton: !this.state.showAddButton,
        });
    }
    _handleBeforeInput = () => {
        this.setState({
            showAddButton: false
        });
    }
    _toggleBlockType = (blockType, src) => {
        const entityKey = Entity.create(blockType, 'IMMUTABLE', src[0]);
        this.setState({
            showAddButton: false
        });
        this._handleEditorChange(
            AtomicBlockUtils.insertAtomicBlock(this.state.editorState, entityKey, ' ')
        );
    }
    _addImage = () => {
        dialog.showOpenDialog({
            title: 'Select Image',
            properties: ['openFile'],
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
        }, files => {
            if (!files) {
                return;
            }
            const outputFilePromises = getResizedImages(files, {
                minWidth: 1280,
                imageWidths: ['mlarge']
            });
            Promise.all(outputFilePromises).then(results => {
                this._toggleBlockType('image', results[0]);
            }).catch(err => {
                this.setState({
                    error: err
                });
            });
        });
    }
    _handleReturn = (ev) => {
        if (ev.shiftKey) {
            this.setState({
                editorState: RichUtils.insertSoftNewline(this.state.editorState)
            });
            return true;
        }
        return false;
    }
    _getAddButtonStyles = () => {
        const { editorState } = this.state;
        const startKey = this.state.startKey || editorState.getSelection().getStartKey();
        const selectionContent = editorState.getCurrentContent().getBlockForKey(startKey).getText();

        const addButtonStyles = {
            position: 'absolute',
            opacity: 0,
            left: -200,
            zIndex: 5,
            transition: 'opacity 0.218s ease-in-out, top 0.1s ease-in-out'
        };

        if (this._canShowAddButton(selectionContent, editorState)) {
            const node = document.querySelector(`span[data-offset-key="${startKey}-0-0"]`);
            let anchorNode = window.getSelection().anchorNode;

            addButtonStyles.opacity = 1;
            if (node) {
                addButtonStyles.top = node.getBoundingClientRect().top - 12 + window.scrollY;
                addButtonStyles.left = node.getBoundingClientRect().left - 48;
            } else if (anchorNode && anchorNode.getBoundingClientRect) {
                addButtonStyles.top = anchorNode.getBoundingClientRect().top + 20 + window.scrollY;
                addButtonStyles.left = anchorNode.getBoundingClientRect().left - 48;
            } else if (anchorNode && anchorNode.parentElement) {
                anchorNode = anchorNode.parentElement;
                addButtonStyles.top = anchorNode.getBoundingClientRect().top + 20 + window.scrollY;
                addButtonStyles.left = anchorNode.getBoundingClientRect().left - 48;
            }
        }
        return addButtonStyles;
    }
    _canShowAddButton = (selectionContent, editorState) => this.state.showAddButton ||
        (selectionContent.length === 0 && editorState.getSelection().getHasFocus())
    _testFocus = () => {
        this.setState({
            showAddButton: false,
        });
    }
    _handleTitleKeyPress = (ev) => {
        if (ev.charCode === 13) {
            this.editor.focus();
        }
    }
    _handleTitleChange = (ev) => {
        this.setState({ title: ev.target.value });
        if (this.props.onTitleChange) this.props.onTitleChange(ev);
    }
    _toggleToolbarVisibility = (visible) => {
        if (visible) {
            return this.setState({
                toolbarVisible: visible
            });
        }
        return this.setState({
            toolbarVisible: !this.state.toolbarVisible
        });
    }
    render () {
        const { editorState } = this.state;
        const addButtonStyles = this._getAddButtonStyles();

        return (
          <div className="editor" style={{ textAlign: 'left' }}>
            <div style={addButtonStyles}>
              <IconButton
                onMouseDown={this._handleAddClick}
                style={{
                    transform: this.state.showAddButton ? 'rotate(135deg)' : 'rotate(-180deg)'
                }}
              >
                <AddCircle color={this.state.showAddButton ? 'rgb(3, 169, 244)' : '#DDD'} />
              </IconButton>
                {this.state.showAddButton &&
                  <IconButton onClick={this._addImage} >
                    <PhotoCircle />
                  </IconButton>
                }
            </div>
            <div>
              <TextField
                ref="titleInput"
                hintText="Title"
                underlineShow={false}
                hintStyle={{ fontSize: 32 }}
                inputStyle={{ fontSize: 32 }}
                onKeyPress={this._handleTitleKeyPress}
                onChange={this._handleTitleChange}
                value={this.state.title}
                fullWidth
              />
              <div onClick={this._handleEditorContainerClick}>
                <Editor
                  ref={(editor) => {
                      this.editor = editor;
                      if (this.props.editorRef) {
                          this.props.editorRef(this);
                      }
                  }}
                  editorState={editorState}
                  blockRendererFn={rendererFn}
                  onChange={this._handleEditorChange}
                  handleReturn={this._handleReturn}
                  placeholder={this.state.showAddButton ? '' : 'Type your text'}
                  handleBeforeInput={this._handleBeforeInput}
                />
              </div>
            </div>
            <EditorToolbar
              ref="toolbar"
              editorState={editorState}
              isVisible={this.state.toolbarVisible}
              toggleVisibility={this._toggleToolbarVisibility}
              toggleBlockType={this._toggleBlockType}
              toggleInlineStyle={this._toggleInlineStyle}
              setLink={this._setLink}
            />
          </div>
        );
    }
}

EntryEditor.propTypes = {
    onChange: PropTypes.func,
    editorRef: PropTypes.func,
    onTitleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    content: PropTypes.object,
};

export default clickAway(EntryEditor);
