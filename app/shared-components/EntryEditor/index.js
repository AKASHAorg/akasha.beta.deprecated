import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, DraftJS, createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { MentionDecorators, MentionSuggestions } from '../';
import EditorSidebar from './sidebar/editor-sidebar';
import styles from './style.scss';
import imagePlugin from './plugins/image/image-plugin';

const { CompositeDecorator, EditorState } = DraftJS;

class EntryEditor extends Component {
    constructor (props) {
        super(props);

        const decorators = new CompositeDecorator([MentionDecorators.editableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);
        this.state = {
            editorState: EditorState.createEmpty(decorators),
            title: '',
            sidebarOpen: false
        };
    }

    componentWillMount () {
        let { content } = this.props;
        if (typeof content === 'string') {
            content = JSON.parse(this.props.content);
        }
        const newEditorState = this.getUpdatedEditorState(this.state.editorState, content);
        this.setState({
            editorState: newEditorState,
            title: this.props.title
        });
    }
    componentDidMount () {
        if (this.props.showTitle) {
            this.titleRef.focus();
        }
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
        const { showTitle, titlePlaceholder, editorPlaceholder, readOnly } = this.props;
        return (
          <div className="editor" style={{ textAlign: 'left' }}>
            <div>
              {showTitle && !readOnly &&
                <div className={styles.title}>
                  <div className={styles.titleInner}>
                    <textarea
                      ref={(title) => { this.titleRef = title; }}
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
              <div style={{ position: 'relative' }} ref={(el) => { this.container = el; }}>
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
    showTitle: PropTypes.bool,
    onAutosave: PropTypes.func,
    editorPlaceholder: PropTypes.string,
    titlePlaceholder: PropTypes.string,
    showSidebar: PropTypes.bool,
    onChange: PropTypes.func,
    onError: PropTypes.func
};

export default EntryEditor;
