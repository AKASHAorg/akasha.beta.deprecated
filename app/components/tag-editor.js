import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, Button } from 'antd';
import * as actionTypes from '../constants/action-types';
import { tagMessages, generalMessages } from '../locale-data/messages';

const tagCreatorKeycodes = [
    13, // enter
    32, // space
    44, // ,
    59, // ;
];

const suggestionsControlKeys = [
    9, // tab => coder skillz
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
            existentTags: [],
            tagInputWidth: this._getTextWidth(intl.formatMessage(tagMessages.addTag)),
            selectedSuggestionIndex: 0,
            canCreateTags: false,
        };
        this._openedChannels = [];
    }
    componentDidMount () {
        const { tags } = this.props;
        if (tags && tags.size > 0) {
            this._checkTagExistence(tags);
        }
    }
    componentWillReceiveProps (nextProps) {
        const { tags, match } = nextProps;
        const { draftId } = match.params;
        if (draftId !== this.props.match.params.draftId) {
            if (this.channelCb) {
                this.removeExistsListener();
            }
            this.setState({
                partialTag: ''
            }, () => {
                if (tags && tags.size > 0) {
                    this._checkTagExistence(tags);
                }
            });
        }
    }
    // capture up and down keys.
    // when input is in focus and suggestions are visible,
    // prevent default behaviour and navigate through results
    _handleArrowKeyPress = (ev) => {
        const { inputHasFocus } = this.state;
        const { tagSuggestionsCount, tagSuggestions } = this.props;
        const controllingSuggestions = suggestionsControlKeys.includes(ev.which);
        if (inputHasFocus && controllingSuggestions && tagSuggestionsCount > 0) {
            switch (ev.which) {
                case 9: // tab
                case 13: // enter
                    this._addNewTag(
                        tagSuggestions.get(this.state.selectedSuggestionIndex),
                        tagSuggestions.get(this.state.selectedSuggestionIndex)
                    );
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
    openChannel = (channel, manager, cb) => {
        if (!this._openedChannels.includes(channel.channel)) {
            manager.on(() => {
                cb();
                this._openedChannels.push(channel.channel);
            });
            return channel.enable();
        }
        return cb();
    }
    _checkTagCreationAllowance = () => {
        const { ethAddress } = this.props;
        const serverChannel = self.Channel.server.tags.canCreate;
        const clientChannel = self.Channel.client.tags.canCreate;
        const manager = self.Channel.client.tags.manager;
        this.openChannel(serverChannel, manager, () => {
            clientChannel.on((ev, data) => {
                this.setState({
                    canCreateTags: data.can
                });
            });
            serverChannel.send({ ethAddress });
        });
    }
    _checkTagExistence = (tagList) => {
        const serverChannel = window.Channel.server.tags.exists;
        const clientChannel = window.Channel.client.tags.exists;
        if (!this.channelCb) {
            this.channelCb = (ev, response) => {
                if (response.data.exists) {
                    return this.setState({
                        existentTags: [...this.state.existentTags, response.data.tagName],
                    });
                }
                if (!response.data.exists) {
                    return this._checkTagCreationAllowance();
                }
                return null;
            };
        }
        clientChannel.on(this.channelCb);
        tagList.forEach((tagName) => {
            if (!this.state.existentTags.includes(tagName)) {
                serverChannel.send({ tagName });
            }
        });
    }
    removeExistsListener = () => {
        window.Channel.client.tags.exists.removeListener(this.channelCb);
    }
    componentWillUnmount () {
        if (this.channelCb) {
            this.removeExistsListener();
        }
    }
    _addNewTag = (tagName, existent) => {
        const { tags } = this.props;
        this.setState({
            existentTags: existent ? [...this.state.existentTags, existent] : this.state.existentTags,
            partialTag: '',
            tagInputWidth: 0
        }, () => {
            this.props.onTagUpdate(tags.push(tagName));
            this.props.searchResetResults();
            this.tagInput.focus();
        });
    }
    _detectTagCreationKeys = (ev) => {
        if (tagCreatorKeycodes.includes(ev.which)) {
            if (this.state.partialTag.length > 2) {
                this._checkTagExistence([this.state.partialTag]);
                this._addNewTag(this.state.partialTag);
                this.props.searchResetResults();
            }
            ev.preventDefault();
        }
    }

    _deleteTag = tagName =>
        () => {
            const { tags } = this.props;
            this.props.onTagUpdate(tags.filter(tag => tag !== tagName));
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
                `tag-editor__suggestion-item ${tag}
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
            if (this.state.partialTag.length >= 1) {
                this.props.searchTags(this.state.partialTag);
            } else {
                this.props.searchResetResults();
            }
        });
    }
    _handleTagRegister = tagName =>
        (ev) => {
            const { actionAdd, ethAddress } = this.props;
            const payload = {
                ethAddress,
                tagName
            };
            actionAdd(ethAddress, actionTypes.tagCreate, payload);
            ev.preventDefault();
        }
    _changeInputFocus = focusState =>
        () => setTimeout(() => this.setState({
            inputHasFocus: focusState
        }, () => {
            if (this.state.inputHasFocus) {
                if (this.state.partialTag.length >= 1) {
                    this.props.searchTags(this.state.partialTag);
                }
            }
            if (!this.state.inputHasFocus) {
                this.props.searchResetResults();
            }
        }), 100);
    _getTagPopoverContent = (tag) => {
        const { intl } = this.props;
        const { canCreateTags } = this.state;
        return (
          <div
            className="tag-editor__tag-item-popover-content"
          >
            <p className="tag-editor__tag-item-popover-message">
              {canCreateTags && intl.formatMessage(tagMessages.tagNotCreated)}
              {!canCreateTags && intl.formatMessage(tagMessages.notEnoughKarma)}
            </p>
            <div
              className="tag-editor__tag-item-popover-actions"
            >
              <Button
                onClick={this._deleteTag(tag)}
                size="small"
                className="tag-editor__tag-item-popover-actions-button"
              >
                {intl.formatMessage(generalMessages.cancel)}
              </Button>
              {canCreateTags &&
                <Button
                  type="primary"
                  size="small"
                  className="tag-editor__tag-item-popover-actions-button"
                  onClick={this._handleTagRegister(tag)}
                >
                  {intl.formatMessage(generalMessages.create)}
                </Button>
              }
            </div>
          </div>
        );
    }
    render () {
        const { tagInputWidth, inputHasFocus, existentTags } = this.state;
        const { tagSuggestionsCount, intl, tags } = this.props;
        return (
          <div
            className={`tag-editor ${this.props.className}`}
            ref={this.props.nodeRef}
          >
            { /* eslint-disable react/no-array-index-key */ }
            {tags.map((tag, index) => (
              <Popover
                key={`${tag}-${index}`}
                placement="topLeft"
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
                  {existentTags.includes(tag) &&
                    <span
                      className="tag-item__delete-button"
                      onClick={this._deleteTag(tag)}
                    >
                      <Icon
                        type="close"
                      />
                    </span>
                  }
                  {!existentTags.includes(tag) &&
                    <span
                      className="tag-item__info-button"
                    >
                      <Icon
                        type="question"
                      />
                    </span>
                  }
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
                disabled={
                    !tags.every(tag => existentTags.includes(tag)) ||
                    (tags.size >= 10)
                }
              />
            </Popover>
          </div>
        );
    }
}

TagEditor.propTypes = {
    actionAdd: PropTypes.func,
    className: PropTypes.string,
    ethAddress: PropTypes.string,
    intl: PropTypes.shape(),
    match: PropTypes.shape(),
    nodeRef: PropTypes.func,
    onTagUpdate: PropTypes.func,
    searchTags: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    tags: PropTypes.shape(),
    searchResetResults: PropTypes.func,
};

export default TagEditor;
