import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { createTypeStrategy, DraftJS, editorStateFromRaw, MegadraftEditor } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { Popover } from 'antd';
import throttle from 'lodash.throttle';
import { entryMessages } from '../../locale-data/messages';
import { MentionDecorators } from '../../shared-components';
import readOnlyImagePlugin from '../text-entry-editor/plugins/readOnlyImage/read-only-image-plugin'; // eslint-disable-line
import clickAway from '../../utils/clickAway';
import { getContentStateFragment } from '../../utils/editorUtils';
import { Icon } from '../';

const { CompositeDecorator, ContentState, EditorState } = DraftJS;

class SelectableEditor extends Component {
    constructor (props) {
        super(props);
        const decorators = new CompositeDecorator([MentionDecorators.nonEditableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);
        const emptyState = EditorState.createEmpty(decorators);
        const editorState = EditorState.push(emptyState, editorStateFromRaw(props.draft).getCurrentContent());
        this.state = {
            editorState
        };
    }

    componentDidMount () {
        document.addEventListener('selectionchange', this.throttledHandler);
    }

    componentWillUnmount () {
        document.removeEventListener('selectionchange', this.throttledHandler);
    }

    componentClickAway = () => {
        this.setState({
            range: null,
            showPopover: false
        });
    };
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
    onSelectionChange = () => {
        const { anchorNode, focusNode } = window.getSelection();
        if (!anchorNode || !focusNode) {
            this.setState({
                range: null,
                showPopover: null
            });
        }
    };

    throttledHandler = throttle(this.onSelectionChange, 500);

    getSelectionState = (editorState) => {
        const { range } = this.state;
        const textLength = (node) => {
            if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                return (node.textContent || node.innerText).length;
            }
            return 0;
        };

        const leftSiblingLength = (node) => {
            if (node === null) {
                return 0;
            }
            return textLength(node) + leftSiblingLength(node.previousSibling);
        };

        const getKeyFromBlock = (node) => {
            if (node.attributes['data-block'] && node.attributes['data-block'].value === 'true') {
                const [key, x, y] = node.attributes['data-offset-key'].value.split('-');
                if (x !== '0' || y !== '0') {
                    return null;
                }
                return key;
            }
            return null;
        };

        const iterate = (node, offset) => {
            // out of parents (happens if point lies outside of editor_ component).
            if (!node) {
                return {};
            }

            // no block key - move to parent with current offset plus text length of left siblings.
            const blockkey = getKeyFromBlock(node);
            if (!blockkey) {
                return iterate(node.parentElement, offset + leftSiblingLength(node.previousSibling));
            }

            // block key found - return with current offset.
            return {
                selectionBlock: blockkey,
                selectionOffset: offset
            };
        };

        const mkPoint = (container, offset) =>
            iterate(container.parentElement, offset + leftSiblingLength(container.previousSibling));

        const startpoint = mkPoint(range.startContainer, range.startOffset);
        const endpoint = mkPoint(range.endContainer, range.endOffset);

        return editorState.getSelection().merge({
            anchorKey: startpoint.selectionBlock,
            anchorOffset: startpoint.selectionOffset,
            focusKey: endpoint.selectionBlock,
            focusOffset: endpoint.selectionOffset,
        });
    };

    hidePopover = () => {
        this.setState({ showPopover: false });
    };

    getPopoverPosition = () => {
        const selection = window.getSelection().getRangeAt(0);
        const selectionRect = selection.getBoundingClientRect();
        const editorWrapperRect = this.editorWrapper.getBoundingClientRect();
        const selectionWidth = selectionRect.right - selectionRect.left;
        const offsetLeft = selectionRect.left - editorWrapperRect.left;
        const top = selectionRect.bottom - editorWrapperRect.top;
        const left = (offsetLeft + (selectionWidth / 2)) - 100;
        return { top, left };
    };

    checkSelection = () => {
        const range = window.getSelection().getRangeAt(0);
        if (range.startOffset === range.endOffset) {
            this.setState({
                range: null,
                showPopover: false
            });
            return;
        }

        this.setState({
            range,
            showPopover: true
        });
    };

    getHighlightText = () => {
        const { editorState } = this.state;
        const selectionState = this.getSelectionState(editorState);
        const contentState = editorState.getCurrentContent();
        const fragment = getContentStateFragment(contentState, selectionState);
        const fragmentContent = ContentState.createFromBlockArray(fragment.toArray());
        // const fragmentState = EditorState.createWithContent(fragmentContent);
        // const raw = editorStateToJSON(fragmentState);
        return fragmentContent.getPlainText();
    }

    saveHighlight = () => {
        const { highlightSave } = this.props;
        const text = this.getHighlightText();
        this.setState({
            range: null,
            showPopover: false
        });
        highlightSave(text);
    };

    startComment = () => {
        const { startComment } = this.props;
        const text = this.getHighlightText();
        this.setState({
            range: null,
            showPopover: false
        });
        startComment(text);
    }

    renderPopover = () => {
        const { intl, startComment } = this.props;
        if (!this.editorWrapper) {
            return null;
        }
        const { top, left } = this.getPopoverPosition();
        const content = (
          <div>
            <div
              className="flex-center-y popover-menu__item"
              onClick={this.saveHighlight}
            >
              <Icon className="popover-menu__icon selectable-editor__popover-icon" type="highlight" />
              <span>{intl.formatMessage(entryMessages.saveHighlight)}</span>
            </div>
            <div
              className="flex-center-y popover-menu__item"
              onClick={startComment && this.startComment}
            >
              <Icon className="popover-menu__icon selectable-editor__popover-icon" type="comment" />
              <span>{intl.formatMessage(entryMessages.startComment)}</span>
            </div>
          </div>
        );

        return (
          <div className="selectable-editor__popover-wrapper" style={{ top, left }}>
            <Popover
              content={content}
              overlayClassName="popover-menu"
              placement="bottom"
              visible
            >
              <div className="selectable-editor__popover-inner" />
            </Popover>
          </div>
        );
    };

    render () {
        const { baseUrl } = this.props;
        const { editorState, showPopover } = this.state;

        return (
          <div className="selectable-editor">
            <div
              onMouseDown={this.hidePopover}
              onMouseUp={this.checkSelection}
              ref={(el) => { this.editorWrapper = el; }}
            >
              <MegadraftEditor
                editorState={editorState}
                onChange={this.handleChange}
                plugins={[readOnlyImagePlugin({ baseUrl })]}
                readOnly
                blockStyleFn={this.blockStyleFn}
              />
            </div>
            {showPopover && this.renderPopover()}
          </div>
        );
    }
}

SelectableEditor.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    draft: PropTypes.shape().isRequired,
    highlightSave: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    startComment: PropTypes.func
};

export default injectIntl(clickAway(SelectableEditor));
