import React, { Component, PropTypes } from 'react';
import { TextField, SvgIcon } from 'material-ui';
import { Editor, EditorState, getDefaultKeyBinding, CompositeDecorator, RichUtils } from 'draft-js';
import styles from './style.css';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';
import { handleStrategy } from './strategies';
import { HandleComponent } from './components';

import EditorToolbar from './components/editor-toolbar';
import rendererFn from './components/custom-renderer';

class EntryEditor extends Component {
    constructor(props) {
        super(props);
        const compositeDecorator = new CompositeDecorator([
            {
                strategy: handleStrategy,
                component: HandleComponent
            }
        ])
        this.state = {
            editorState: EditorState.createEmpty(compositeDecorator)
        };
    }
    render () {
        const { editorState } = this.state;
        return (
            <div className = "editor" style = {{position: 'relative', textAlign: 'left'}}>
                {this.state.showAddButton &&
                    <div style = {{position: 'absolute', top: ((this.state.rows - 1) * 24) + 4, left: -32}}>
                        <SvgIcon style={{cursor: 'pointer'}} onClick = {this._handleAddAttach}>
                            <AddCircle color="#DDD" hoverColor = '#444'/>
                        </SvgIcon>
                    </div>
                }
                <Editor
                    ref="editor" 
                    editorState = {editorState}
                    blockRendererFn = {rendererFn}
                    onChange = {this._handleEditorChange}
                    handleReturn = {this._handleReturn}
                    placeholder = "Type your text"
                    handleBeforeInput = {this._handleBeforeInput}
                />
                <EditorToolbar
                    ref = "toolbar"
                    editorState = {editorState}
                    toggleBlockType = {this._toggleBlockType}
                    toggleInlineStyle = {this._toggleInlineStyle}
                    setLink = {this._setLink}
                    focus = {this._focus}
                />
            </div>
        );
    }
    _handleEditorChange = (editorState) => {
        console.log('change');
        this.setState({
            editorState
        });
    }
    _handleBeforeInput(str) {
        console.log(str, 'beforeInput');
    }
    _handleReturn = (ev) => {
        if (e.shiftKey) {
            this.setState({
                editorState: RichUtils.insertSoftNewline(this.state.editorState)
            });
            return true;
        }
        return false;
    }
}

export default EntryEditor;
