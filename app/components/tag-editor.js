import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'antd';
import { tagMessages } from '../locale-data/messages';

const tagCreatorKeycodes = [
    13, // enter
    32, // space
    44, // ,
    59, // ;
];

const suggestionsControlKeys = [
    13, // enter
    38, // arrow up
    40, // arrow down
];
class TagEditor extends Component {
    constructor (props) {
        super(props);
        const { intl } = this.props;
        this.state = {
            partialTag: '',
            createdTags: [],
            existentTags: [],
            tagInputWidth: this._getTextWidth(intl.formatMessage(tagMessages.addTag)),
            selectedSuggestionIndex: 0,
        };
    }

    getTags = () =>
        this.state.createdTags;
    // capture up and down keys.
    // when input is in focus and suggestions are visible,
    // prevent default behaviour and navigate through results
    _handleArrowKeyPress = (ev) => {
        const { inputHasFocus } = this.state;
        const { tagSuggestionsCount, tagSuggestions } = this.props;
        const controllingSuggestions = suggestionsControlKeys.includes(ev.which);
        if (inputHasFocus && controllingSuggestions && tagSuggestionsCount > 0) {
            switch (ev.which) {
                case 13:
                    this._addNewTag(tagSuggestions.get(this.state.selectedSuggestionIndex), tagSuggestions.get(this.state.selectedSuggestionIndex));
                    break;
                case 38:
                    this.setState((prevState) => {
                        if (prevState.selectedSuggestionIndex === 0) {
                            return { selectedSuggestionIndex: tagSuggestions.size - 1 };
                        }
                        return { selectedSuggestionIndex: prevState.selectedSuggestionIndex - 1 };
                    });
                    break;
                case 40:
                    this.setState((prevState) => {
                        if (prevState.selectedSuggestionIndex === (tagSuggestions.size - 1)) {
                            return { selectedSuggestionIndex: 0 };
                        }
                        return { selectedSuggestionIndex: prevState.selectedSuggestionIndex + 1 };
                    });
                    break;
                default:
                    break;
            }
            if (!ev.defaultPrevented) {
                ev.preventDefault();
            }
        }
    }
    _checkTagExistence = (tagName) => {
        const serverChannel = window.Channel.server.tags.exists;
        const clientChannel = window.Channel.client.tags.exists;
        return new Promise((resolve) => {
            clientChannel.on((ev, response) => {
                if (response.data.exists) {
                    return resolve(response.data.tagName);
                }
                return resolve(null);
            });
            serverChannel.send({ tagName });
        });
    }

    _addNewTag = (tagName, existent) => {
        this.setState({
            createdTags: [...this.state.createdTags, tagName],
            existentTags: existent ? [...this.state.existentTags, existent] : this.state.existentTags,
            partialTag: '',
            tagInputWidth: 0
        }, () => {
            this.props.onTagUpdate(this.state.createdTags);
            this.tagInput.focus();
            this.props.searchResetResults();
        });
    }
    _detectTagCreationKeys = (ev) => {
        if (tagCreatorKeycodes.includes(ev.which)) {
            if (this.state.partialTag.length > 2) {
                this._checkTagExistence(this.state.partialTag).then((existentTag) => {
                    if (existentTag) {
                        this._addNewTag(this.state.partialTag, existentTag);
                    } else {
                        this._addNewTag(this.state.partialTag);
                    }
                });
                this.props.searchResetResults();
            }
            ev.preventDefault();
        }
    }

    _deleteTag = tagName =>
        () => {
            this.setState({
                createdTags: [...this.state.createdTags.filter(tag => tag !== tagName)]
            }, () => {
                this.props.onTagUpdate(this.state.createdTags);
            });
        }

    _getTextWidth = (text) => {
        let txtNode = document.createElement('div');
        document.body.appendChild(txtNode);
        txtNode.style.position = 'absolute';
        txtNode.style.left = -10000;
        txtNode.style.top = -10000;

        txtNode.innerText = text;

        const res = {
            width: Math.round(txtNode.clientWidth),
        };
        document.body.removeChild(txtNode);
        txtNode = null;
        return res;
    }

    _getTagSuggestions = () => {
        const { tagSuggestions } = this.props;
        /* eslint-disable react/no-array-index-key */
        return tagSuggestions.map((tag, index) => (
          <div
            key={`suggested-${tag}-${index}`}
            onClick={() => this._addNewTag(tag, tag)}
            className={
                `tag-editor__suggestion-item
                tag-editor__suggestion-item${this.state.selectedSuggestionIndex === index ? '_selected' : ''}`
            }
          >
            {tag}
          </div>
        ));
        /* eslint-enable react/no-array-index-key */
    }

    _handleTagChange = (ev) => {
        if (this.state.partialTag.length === 32 && ev.target.value.length > 32) {
            return;
        }
        this.setState({
            partialTag: ev.target.value,
            tagInputWidth: this._getTextWidth(ev.target.value).width + 20,
        }, () => {
            if (this.state.partialTag.length > 2) {
                this.props.tagSearch({
                    tag: this.state.partialTag,
                    localOnly: true
                });
            } else {
                this.props.searchResetResults();
            }
        });
    }

    _changeInputFocus = focusState =>
        () => setTimeout(() => this.setState({
            inputHasFocus: focusState
        }, () => {
            if (this.state.inputHasFocus) {
                if (this.state.partialTag.length > 2) {
                    this.props.tagSearch({
                        tag: this.state.partialTag,
                        localOnly: true,
                    });
                }
            }
            if (!this.state.inputHasFocus) {
                this.props.searchResetResults();
            }
        }), 100);
    _getTagPopoverContent = (tag) => {
        const { existentTags } = this.state;
        if (!existentTags.includes(tag)) {
            return (
              <div>
                <p>This is a new tag that wasn`t created by anyone before!</p>
                <div>
                  <span>Cancel</span>
                  <span>Create</span>
                </div>
              </div>
            );
        }
        return null;
    }
    render () {
        const { createdTags, tagInputWidth, inputHasFocus, existentTags } = this.state;
        const { tagSuggestionsCount, intl, tags } = this.props;
        console.log(tags, '!!!!!! replace createdTags with "tags" !!!!!!!!!!!!!!!!!!!!');
        return (
          <div
            className="tag-editor"
            ref={this.props.nodeRef}
          >
            { /* eslint-disable react/no-array-index-key */ }
            {createdTags.map((tag, index) => (
              <Popover
                key={`${tag}-${index}`}
                content={this._getTagPopoverContent(tag)}
                overlayClassName="tag-editor__tag-item-popover"
                visible={!existentTags.includes(tag)}
              >
                <div
                  className={
                    `tag-editor__tag-item
                    tag-editor__tag-item${existentTags.includes(tag) ? '' : '_should-register'}`
                    }
                >
                  { tag }
                  <span
                    className="tag-item__delete-button"
                    onClick={this._deleteTag(tag)}
                  >
                    <Icon
                      type="close"
                    />
                  </span>
                </div>
              </Popover>
            ))}
            { /* eslint-enable react/no-array-index-key */ }
            <Popover
              content={this._getTagSuggestions()}
              placement="topLeft"
              visible={tagSuggestionsCount > 0 && inputHasFocus}
              overlayClassName="tag-editor__suggestions-container"
            >
              <input
                ref={(node) => { this.tagInput = node; }}
                type="text"
                className="tag-editor__input"
                placeholder={intl.formatMessage(tagMessages.addTag)}
                onKeyPress={this._detectTagCreationKeys}
                onKeyDown={this._handleArrowKeyPress}
                onChange={this._handleTagChange}
                style={{
                    width: tagInputWidth,
                }}
                value={this.state.partialTag}
                onFocus={this._changeInputFocus(true)}
                onBlur={this._changeInputFocus(false)}
                disabled={!createdTags.every(tag => existentTags.includes(tag))}
              />
            </Popover>
          </div>
        );
    }
}

TagEditor.propTypes = {
    intl: PropTypes.shape(),
    nodeRef: PropTypes.func,
    onTagUpdate: PropTypes.func,
    tagSearch: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    searchResetResults: PropTypes.func,
};

export default TagEditor;
