import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MegadraftEditor, DraftJS, createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { MentionDecorators, MentionSuggestions } from '../';
import EditorSidebar from './sidebar/editor-sidebar';
import imagePlugin from './plugins/image/image-plugin';

const { CompositeDecorator, EditorState } = DraftJS;

// const getUpdatedEditorState = (editorState, rawContent) =>
//     EditorState.push(editorState, editorStateFromRaw(rawContent).getCurrentContent());

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

    // _handleEditorScroll = (ev) => {
    //     const scrollHeight = ev.target.scrollHeight;
    //     const scrollTop = ev.target.scrollTop;
    //     const rootNode = this.rootNode;
    //     const nodeHeight = parseInt(window.getComputedStyle(rootNode).height, 10);
    //     const scroller = nodeHeight + scrollTop;
    //     if ((scroller >= scrollHeight - 10) && this.lastPos === 'between') {
    //         this.lastPos = 'bottom';
    //         this.props.onScrollBottom();
    //     } else if ((nodeHeight === scroller) && this.lastPos === 'between') {
    //         this.lastPos = 'top';
    //         this.props.onScrollTop();
    //     } else if (scrollTop > 0 && scrollHeight - scroller > 132 && this.lastPos !== 'between') {
    //         this.lastPos = 'between';
    //         this.props.onScrollBetween();
    //     }
    // }

    setSuggestionsRef = (el) => {
        this.suggestionsComponent = el;
    };
    // @TODO: investigate another option to update the scroll position
    // such that the caret should be in viewport
    updateCaretPosition = (newSelectionState) => {
        const anchorKey = newSelectionState.getAnchorKey();
        this.setState({
            caretPosition: anchorKey
        }, () => {
            const dataKey = `${anchorKey}-0-0`;
            const targetNode = Array.from(
                document.querySelectorAll('div[data-offset-key][data-editor][data-block]')
            ).filter(node =>
                node.attributes['data-offset-key'] &&
                    node.attributes['data-offset-key'].nodeValue === dataKey);

            if (targetNode.length) {
                targetNode[0].scrollIntoViewIfNeeded(true);
            }
        });
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

    _changeEditorFocus = (focusState) => {
        const { editorState } = this.props;
        const selectionState = editorState.getSelection();
        const focusedSelection = selectionState.set('hasFocus', focusState);
        return this._handleEditorChange(EditorState.acceptSelection(editorState, focusedSelection));
    }

    _checkEditorFocus = () => {
        const { editorState } = this.props;
        if (this.editor) {
            return editorState.getSelection().getHasFocus();
        }
        return false;
    }

    _handleSidebarToggle = (isOpen) => {
        this.setState({
            sidebarOpen: isOpen
        });
    }
    blockStyleFn = (contentBlock) => {
        const type = contentBlock.getType();
        const data = contentBlock.getData().toObject();
        if (type === 'unstyled') {
            return 'paragraph';
        }
        if (type === 'atomic' && data.type === 'image') {
            return `image-block__${data.media}`;
        }
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
        const { editorPlaceholder, readOnly, editorState, className, style, intl } = this.props;
        const editrState = EditorState.set(editorState, { decorator: this.decorators });
        return (
          <div
            className={`text-entry-editor ${className}`}
            ref={(rootNode) => { this.rootNode = rootNode; }}
            style={style}
          >
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
                editorState={editrState}
                onChange={this._handleEditorChange}
                plugins={[
                    imagePlugin({
                        onAutosave: this.props.onAutosave,
                        onImageError: this._handleImageError,
                        baseUrl: this.props.baseUrl,
                        intl
                    })
                ]}
                placeholder={this.state.sidebarOpen ? '' : editorPlaceholder}
                tabIndex="0"
                hasFocus={this._checkEditorFocus()}
                spellCheck
                blockStyleFn={this.blockStyleFn}
              />
              <MentionSuggestions
                ref={this.setSuggestionsRef}
                editorState={editrState}
                onChange={this._handleEditorChange}
                parentRef={this.container}
              />
            </div>
          </div>
        );
    }
}
EntryEditor.defaultProps = {
    onScrollBetween: () => {},
    onScrollBottom: () => {},
    onScrollTop: () => {},
    showSidebar: true,
    showTitle: true,
    readOnly: false,
    editorPlaceholder: 'write something',
    titlePlaceholder: 'write a title'
};

EntryEditor.propTypes = {
    className: PropTypes.string,
    showTerms: PropTypes.func,
    editorRef: PropTypes.func,
    editorState: PropTypes.shape(),
    readOnly: PropTypes.bool,
    onAutosave: PropTypes.func,
    editorPlaceholder: PropTypes.string,
    intl: PropTypes.shape(),
    showSidebar: PropTypes.bool,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    baseUrl: PropTypes.string,
    style: PropTypes.shape(),
};

export default EntryEditor;
