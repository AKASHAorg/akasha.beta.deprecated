import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, DraftJS,
    createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { MentionDecorators, MentionSuggestions } from '../';
import EditorSidebar from './sidebar/editor-sidebar';
import imagePlugin from './plugins/image/image-plugin';

const { CompositeDecorator, EditorState } = DraftJS;

const getUpdatedEditorState = (editorState, rawContent) =>
    EditorState.push(editorState, editorStateFromRaw(rawContent).getCurrentContent());

class EntryEditor extends Component {
    constructor (props) {
        super(props);
        this.decorators = new CompositeDecorator([MentionDecorators.editableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);
        this.state = {
            sidebarOpen: false,
            selectionState: null
        };
    }
    // componentWillReceiveProps (nextProps) {
    //     let { content } = nextProps;
    //     if (typeof content === 'string') {
    //         content = JSON.parse(content);
    //     }
    //     if (content && !this.props.content) {
    //         const newEditorState = this.getUpdatedEditorState(this.state.editorState, content);
    //         this.setState({
    //             editorState: newEditorState,
    //             title: nextProps.title
    //         });
    //     }
    // }

    // shouldComponentUpdate (nextProps, nextState) {
    //     return (nextProps.title !== this.props.title) ||
    //         (nextProps.content !== this.props.content) ||
    //         (nextProps.selectionState !== this.props.selectionState) ||
    //         (nextState.sidebarOpen !== this.state.sidebarOpen);
    // }

    setSuggestionsRef = (el) => {
        this.suggestionsComponent = el;
    };

    _handleImageError = (imageBlockKey, err) => {
        this.setState(prevState => ({
            errors: [prevState.errors, {
                [imageBlockKey]: err
            }]
        }));
    }

    _handleEditorChange = (editorState) => {
        const isOpen = this.suggestionsComponent.getIsOpen();
        if (editorState.getLastChangeType() === 'split-block' && isOpen) {
            return;
        }
        /**
         * Save selectionState locally and contentState in reduxs` state;
         */
        this.props.onChange(editorState);
    };
    _handleKeyPress = (ev) => {
        ev.preventDefault();
        if (ev.key === 'Enter') {
            this._focusEditor();
        }
    }
    _focusEditor = () => {
        const editorContainerNode = this.editor.refs.editor;
        const contentEditableNode = editorContainerNode.querySelector('[contenteditable=true]');
        contentEditableNode.focus();
    }
    _blurEditor = () => {
        const editorContainerNode = this.editor.refs.editor;
        const contentEditableNode = editorContainerNode.querySelector('[contenteditable=true]');
        contentEditableNode.blur();
    }
    _checkEditorFocus = () => {
        if (this.editor) {
            const editorContainerNode = this.editor.refs.editor;
            const contentEditableNode = editorContainerNode.querySelector('[contenteditable=true]');
            return (contentEditableNode && contentEditableNode.isSameNode(document.activeElement));
        }
        return false;
    }
    _handleSidebarToggle = (isOpen) => {
        this.setState({
            sidebarOpen: isOpen
        });
    }
    _renderSidebar = ({ plugins, editorState, onChange }) => {
        const { showSidebar, readOnly, showTerms, onError } = this.props;
        if (showSidebar && !readOnly) {
            return (
              <EditorSidebar
                plugins={plugins}
                editorState={editorState}
                onChange={onChange}
                showTerms={showTerms}
                onError={onError}
                editorHasFocus={this._checkEditorFocus()}
                onSidebarToggle={this._handleSidebarToggle}
              />);
        }
        return null;
    };
    render () {
        const { editorPlaceholder, readOnly, editorState } = this.props;
        const editrState = EditorState.set(editorState, { decorator: this.decorators });
        return (
          <div className="text-entry-editor">
            <div
              className="text-entry-editor__editor-wrapper"
              ref={(el) => { this.container = el; }}
              onClick={this._focusEditor}
            >
              <MegadraftEditor
                ref={(edtr) => {
                    this.editor = edtr;
                    if (this.props.editorRef) {
                        this.props.editorRef(this);
                    }
                }}
                readOnly={readOnly}
                sidebarRendererFn={this._renderSidebar}
                editorState={editrState}
                onChange={this._handleEditorChange}
                plugins={[
                    imagePlugin({
                        onAutosave: this.props.onAutosave,
                        onImageError: this._handleImageError,
                        baseUrl: this.props.baseUrl,
                    })
                ]}
                placeholder={this.state.sidebarOpen ? '' : editorPlaceholder}
                tabIndex="0"
                hasFocus={this._checkEditorFocus()}
              />
              <MentionSuggestions
                ref={this.setSuggestionsRef}
                editorState={editorState}
                onChange={this._handleEditorChange}
                parentRef={this.container}
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
    editorRef: PropTypes.func,
    editorState: PropTypes.shape(),
    readOnly: PropTypes.bool,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    onAutosave: PropTypes.func,
    editorPlaceholder: PropTypes.string,
    showSidebar: PropTypes.bool,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    baseUrl: PropTypes.string,
};

export default EntryEditor;
