import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { createTypeStrategy, DraftJS, editorStateFromRaw, MegadraftEditor } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import { Popover } from 'antd';
import throttle from 'lodash.throttle';
import { entryMessages } from '../../locale-data/messages';
import { MentionDecorators } from '../../shared-components';
import readOnlyImagePlugin from '../../shared-components/EntryEditor/plugins/readOnlyImage/read-only-image-plugin'; // eslint-disable-line
import clickAway from '../../utils/clickAway';
import { getContentStateFragment } from '../../utils/editorUtils';

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

    saveHighlight = () => {
        const { highlightSave } = this.props;
        const { editorState } = this.state;
        const selectionState = this.getSelectionState(editorState);
        const contentState = editorState.getCurrentContent();
        const fragment = getContentStateFragment(contentState, selectionState);
        const fragmentContent = ContentState.createFromBlockArray(fragment.toArray());
        // const fragmentState = EditorState.createWithContent(fragmentContent);
        // const raw = editorStateToJSON(fragmentState);
        const text = fragmentContent.getPlainText();
        this.setState({
            range: null,
            showPopover: false
        });
        highlightSave(text);
    };

    renderPopover = () => {
        const { intl } = this.props;
        if (!this.editorWrapper) {
            return null;
        }
        const { top, left } = this.getPopoverPosition();

        const content = (
          <div>
            <div
              className="content-link"
              onClick={this.saveHighlight}
            >
              {intl.formatMessage(entryMessages.saveHighlight)}
            </div>
          </div>
        );

        return (
          <div
            style={{
                width: '200px',
                height: '0px',
                position: 'absolute',
                top,
                left,
            }}
          >
            <Popover placement="bottom" content={content} visible>
              <div style={{ height: '100%', width: '100%' }} />
            </Popover>
          </div>
        );
    };

    render () {
        const { showPopover } = this.state;

        return (
          <div
            onMouseDown={this.hidePopover}
            onMouseUp={this.checkSelection}
            style={{ position: 'relative' }}
          >
            <div ref={(el) => { this.editorWrapper = el; }}>
              <MegadraftEditor
                readOnly
                editorState={this.state.editorState}
                onChange={this.handleChange}
                plugins={[readOnlyImagePlugin]}
              />
            </div>
            {showPopover && this.renderPopover()}
          </div>
        );
    }
}

SelectableEditor.propTypes = {
    draft: PropTypes.shape().isRequired,
    highlightSave: PropTypes.func.isRequired,
    intl: PropTypes.shape()
};

export default injectIntl(clickAway(SelectableEditor));
