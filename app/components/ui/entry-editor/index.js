import React, { Component, PropTypes } from 'react';
import { IconButton } from 'material-ui';
import {
    Editor,
    EditorState,
    getDefaultKeyBinding,
    CompositeDecorator,
    convertToRaw,
    AtomicBlockUtils,
    RichUtils,
    Entity } from 'draft-js';
import { getResizedImages } from '../../../utils/imageUtils';
import styles from './style.css';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';
import PhotoCircle from 'material-ui/svg-icons/image/add-a-photo';
import { handleStrategy } from './strategies';
import { HandleComponent } from './components';

import EditorToolbar from './components/editor-toolbar';
import rendererFn from './components/custom-renderer';

const { dialog } = require('electron').remote;

class EntryEditor extends Component {
    constructor (props) {
        super(props);
        const compositeDecorator = new CompositeDecorator([
            {
                strategy: handleStrategy,
                component: HandleComponent
            }
        ]);
        this.state = {
            editorState: EditorState.createEmpty(compositeDecorator),
            showAddButton: false,
            toolbarVisible: false
        };
    }
    getContent = () => {
        const rawData = convertToRaw(this.state.editorState.getCurrentContent());
        return rawData;
    }
    _handleEditorChange = (editorState) => {
        this.setState({
            editorState,
        }, () => {
            if (this.props.onChange) {
                return this.props.onChange(editorState.getCurrentContent().getPlainText());
            }
        });
    }
    _handleAddClick = () => {
        this.setState({
            lastSelection: this.state.editorState.getSelection().getAnchorKey(),
            showAddButton: !this.state.showAddButton,
        });
    }
    _handleBeforeInput = (str) => {
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
    render () {
        const { editorState } = this.state;
        const addButtonStyles = this._getAddButtonStyles();

        return (
            <div className = "editor" style = {{ textAlign: 'left' }}>
                <div style = {addButtonStyles}>
                    <IconButton
                      onMouseDown = {this._handleAddClick}
                      style = {{
                          transform: this.state.showAddButton ? 'rotate(135deg)' : 'rotate(-180deg)'
                      }}
                    >
                        <AddCircle color={this.state.showAddButton ? 'rgb(3, 169, 244)' : '#DDD'} />
                    </IconButton>
                    {this.state.showAddButton &&
                        <IconButton onClick = {this._addImage} >
                            <PhotoCircle />
                        </IconButton>
                    }
                </div>
                <div>
                    <Editor
                      ref="editor"
                      editorState = {editorState}
                      blockRendererFn = {rendererFn}
                      onClick = {this._handleEditorClick}
                      onChange = {this._handleEditorChange}
                      handleReturn = {this._handleReturn}
                      placeholder = {this.state.showAddButton ? '' : 'Type your text'}
                      handleBeforeInput = {this._handleBeforeInput}
                    />
                </div>
                <EditorToolbar
                  ref = "toolbar"
                  editorState = {editorState}
                  toggleVisibility = {this._handleToolbarVisibility}
                  toggleBlockType = {this._toggleBlockType}
                  toggleInlineStyle = {this._toggleInlineStyle}
                  setLink = {this._setLink}
                />
            </div>
        );
    }
}

EntryEditor.propTypes = {
    onChange: PropTypes.func
};

export default EntryEditor;
