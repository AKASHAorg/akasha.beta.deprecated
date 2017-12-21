import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MegadraftEditor, DraftJS, createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { MentionDecorators, MentionSuggestions } from '../';
import EditorSidebar from './sidebar/editor-sidebar';
import imagePlugin from './plugins/image/image-plugin';
import { Tooltip } from 'antd';

const { CompositeDecorator, EditorState } = DraftJS;

class EntryEditor extends Component {
    constructor (props) {
        super(props);
        this.decorators = new CompositeDecorator([MentionDecorators.editableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);
        this.state = {
            selectionState: null,
            imageErr: null
        };
    }
    updateCaretPosition = (newSelectionState) => {
        const anchorKey = newSelectionState.getAnchorKey();
        const dataKey = `${anchorKey}-0-0`;
        const targetNode = document.querySelector(`div[data-offset-key='${dataKey}']`);

        if (targetNode) {
            targetNode.scrollIntoViewIfNeeded();
        }
    };

    _handleImageError = (err) => {
        this.setState({
            imageErr: err
        });
    }

    componentDidUpdate (prevProps) {
        const prevSelection = prevProps.editorState.getSelection();
        const currSelection = this.props.editorState.getSelection();
        if (prevSelection.getAnchorKey() !== currSelection.getAnchorKey()) {
            this.updateCaretPosition(currSelection);
        }
    }
    _handleEditorChange = (editorState) => {
        this.props.onChange(editorState);
    };
    _handleSidebarToggle = (isOpen) => {
        this.setState({
            sidebarOpen: isOpen,
            imageErr: null,
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
        return '';
    }
    _renderSidebar = ({ plugins, editorState, onChange }) => {
        const { showSidebar, readOnly, showTerms, onError, sidebarReposition } = this.props;
        if (showSidebar && !readOnly) {
            return (
              <EditorSidebar
                plugins={plugins}
                editorState={editorState}
                onChange={onChange}
                showTerms={showTerms}
                onError={onError}
                onSidebarToggle={this._handleSidebarToggle}
                sidebarOpen={this.state.sidebarOpen}
                sidebarReposition={sidebarReposition}
                error={this.state.imageErr}
              />
            );
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
                        this.props.editorRef(edtr);
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
                spellCheck
                blockStyleFn={this.blockStyleFn}
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
    sidebarReposition: PropTypes.bool,
};

export default EntryEditor;
