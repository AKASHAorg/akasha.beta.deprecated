import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, DraftJS,
    createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { MentionDecorators, MentionSuggestions } from '../';
import EditorSidebar from './sidebar/editor-sidebar';
import imagePlugin from './plugins/image/image-plugin';

const titlePlaceholderPlugin = {
    type: 'TITLE_PLACEHOLDER',
    blockComponent: () => <div>Type a fucking title!</div>
};

const { CompositeDecorator, EditorState } = DraftJS;


const getEditorState = (props) => {
    const writeATitleMsg = 'Write a title';
    const writeYourStoryMsg = 'Write your story';
    const { content } = props;

    const emptyEditorState = {
        entityMap: [],
        blocks: [{
            key: 'entryTitle',
            text: writeATitleMsg,
            type: 'header-two',
            depth: 0
        }, {
            key: 'abc123',
            text: writeYourStoryMsg,
            type: 'unstyled',
            depth: 0,
        }]
    };

    const decorators = new CompositeDecorator([MentionDecorators.editableDecorator, {
        strategy: createTypeStrategy('LINK'),
        component: Link
    }]);

    if (content && typeof content === 'string') {
        return editorStateFromRaw(JSON.parse(content), decorators);
    } else if (content && typeof content === 'object') {
        return editorStateFromRaw(content, decorators);
    }
    const editorState = editorStateFromRaw(emptyEditorState, decorators);
    const entryTitle = editorState.getCurrentContent().getBlockForKey('entryTitle');
    const entryTitleChList = entryTitle.getCharacterList();
    const newEntryTitleChList = entryTitleChList.map(val =>
        val.merge({
            style: val.get('style').add('PLACEHOLDER')
        })
    );
    const newContentState = editorState.getCurrentContent().setIn(['blockMap', 'entryTitle', 'characterList'],
        newEntryTitleChList
    );
    const newState = EditorState.push(editorState, newContentState);
    return newState;
};


class EntryEditor extends Component {
    constructor (props) {
        super(props);
        this.state = {
            editorState: getEditorState(props),
            title: '',
            sidebarOpen: false
        };
    }

    componentWillMount () {
        let { content } = this.props;
        if (content && (typeof content === 'string')) {
            content = JSON.parse(this.props.content);
        }
        if (content) {
            const newEditorState = this.getUpdatedEditorState(this.state.editorState, content);
            this.setState({
                editorState: newEditorState,
                title: this.props.title
            });
        }
    }
    componentDidMount () {
        // if (this.props.showTitle) {
        //     this.titleRef.focus();
        // }
    }
    componentWillReceiveProps (nextProps) {
        let { content } = nextProps;
        if (typeof content === 'string') {
            content = JSON.parse(content);
        }
        if (content && !this.props.content) {
            const newEditorState = this.getUpdatedEditorState(this.state.editorState, content);
            this.setState({
                editorState: newEditorState,
                title: nextProps.title
            });
        }
    }
    shouldComponentUpdate (nextProps, nextState) {
        return (nextProps.title !== this.props.title) ||
            (nextProps.content !== this.props.content) ||
            (nextState.title !== this.state.title) ||
            (nextState.editorState !== this.state.editorState) ||
            (nextState.sidebarOpen !== this.state.sidebarOpen);
    }

    setSuggestionsRef = (el) => {
        this.suggestionsComponent = el;
    };

    getUpdatedEditorState = (editorState, rawContent) =>
        EditorState.push(editorState, editorStateFromRaw(rawContent).getCurrentContent());

    getRawContent = () => editorStateToJSON(this.state.editorState);
    getContent = () => this.state.editorState.getCurrentContent();
    getTitle = () => this.state.title;
    _handleEditorChange = (editorState) => {
        const isOpen = this.suggestionsComponent.getIsOpen();
        if (editorState.getLastChangeType() === 'split-block' && isOpen) {
            return;
        }
        this.setState({
            editorState,
        });
        if (this.props.onAutosave) {
            this.props.onAutosave();
        }
        if (this.props.onChange) {
            this.props.onChange(editorState);
        }
    };
    _handleTitleChange = (ev) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange();
        }
        this.setState({
            title: ev.target.value
        });
    };
    _handleKeyPress = (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
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
        const { editorPlaceholder, readOnly } = this.props;
        return (
          <div className="text-entry-editor">
            <div
              className="text-entry-editor__editor-wrapper"
              ref={(el) => { this.container = el; }}
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
                editorState={this.state.editorState}
                onChange={this._handleEditorChange}
                plugins={[imagePlugin, titlePlaceholderPlugin]}
                placeholder={this.state.sidebarOpen ? '' : editorPlaceholder}
                tabIndex="0"
                hasFocus={this._checkEditorFocus()}
              />
              <MentionSuggestions
                ref={this.setSuggestionsRef}
                editorState={this.state.editorState}
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
    title: PropTypes.string,
    editorRef: PropTypes.func,
    readOnly: PropTypes.bool,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    onAutosave: PropTypes.func,
    editorPlaceholder: PropTypes.string,
    showSidebar: PropTypes.bool,
    onChange: PropTypes.func,
    onError: PropTypes.func
};

export default EntryEditor;
