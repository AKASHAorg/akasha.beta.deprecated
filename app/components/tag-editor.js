import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, Button } from 'antd';
import { tagMessages, generalMessages } from '../locale-data/messages';
import { Icon } from './';

const tagCreatorKeycodes = [
    13, // enter
    9, // tab
    32, // space
    188, // ,
    186, // ;
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
            existentTags: [],
            tagInputWidth: this._getTextWidth(intl.formatMessage(tagMessages.addTag)),
            selectedSuggestionIndex: 0,
            canCreateTags: false,
        };
    }

    // componentDidMount () {
    //     const { tags } = this.props;
    //     if (tags && tags.size > 0) {
    //         this._checkTagExistence(tags);
    //     }
    //     this._addChannelListener();
    // }
    // _addChannelListener = () => {
    //     const { onTagError } = this.props;
    //     const clientChannel = self.Channel.client.tags.canCreate;
    //     const manager = self.Channel.client.tags.manager;
    //     const serverChannel = self.Channel.server.tags.canCreate;
    //     this.openChannel(serverChannel, manager, () => {
    //         clientChannel.on((ev, res) => {
    //             this.setState({
    //                 canCreateTags: res.data.can
    //             }, () => {
    //                 this.setState({
    //                     editorBusy: false
    //                 }, () => {
    //                     if (!res.data.can) {
    //                         onTagError(true);
    //                     }
    //                 });
    //             });
    //         });
    //     });
    // }
    // getIsBusy = () => this.state.editorBusy;
    // componentWillReceiveProps (nextProps) {
    //     const { tags, match } = nextProps;
    //     const { draftId } = match.params;
    //     if (draftId !== this.props.match.params.draftId) {
    //         if (this.channelCb) {
    //             this.removeExistsListener();
    //         }
    //         this.setState({
    //             partialTag: ''
    //         }, () => {
    //             if (tags && tags.size > 0) {
    //                 this._checkTagExistence(tags);
    //             }
    //         });
    //     } else if (!this.props.tags.size && tags && tags.size > 0) {
    //         this._checkTagExistence(tags);
    //     }
    // }
    // // capture up and down keys.
    // // when input is in focus and suggestions are visible,
    // // prevent default behaviour and navigate through results
    // _handleArrowKeyPress = (ev) => {
    //     const { inputHasFocus } = this.state;
    //     const { tagSuggestionsCount, tagSuggestions } = this.props;
    //     const controllingSuggestions = suggestionsControlKeys.includes(ev.which);
    //     if (inputHasFocus && controllingSuggestions && tagSuggestionsCount > 0) {
    //         switch (ev.which) {
    //             case 9: // tab
    //             case 13: // enter
    //                 this._addNewTag(
    //                     tagSuggestions.get(this.state.selectedSuggestionIndex),
    //                     tagSuggestions.get(this.state.selectedSuggestionIndex)
    //                 );
    //                 break;
    //             case 38:
    //                 this.setState((prevState) => {
    //                     if (prevState.selectedSuggestionIndex === 0) {
    //                         return { selectedSuggestionIndex: tagSuggestions.size - 1 };
    //                     }
    //                     return { selectedSuggestionIndex: prevState.selectedSuggestionIndex - 1 };
    //                 });
    //                 break;
    //             case 40:
    //                 this.setState((prevState) => {
    //                     if (prevState.selectedSuggestionIndex === (tagSuggestions.size - 1)) {
    //                         return { selectedSuggestionIndex: 0 };
    //                     }
    //                     return { selectedSuggestionIndex: prevState.selectedSuggestionIndex + 1 };
    //                 });
    //                 break;
    //             default:
    //                 break;
    //         }
    //         if (!ev.defaultPrevented) {
    //             ev.preventDefault();
    //         }
    //     }
    // }

    // openChannel = (channel, manager, cb) => {
    //     if (!this._openedChannels.includes(channel.channel)) {
    //         manager.on(() => {
    //             cb();
    //             this._openedChannels.push(channel.channel);
    //         });
    //         return channel.enable();
    //     }
    //     return cb();
    // }

    // _checkTagCreationAllowance = () => {
    //     const { ethAddress } = this.props;
    //     const serverChannel = self.Channel.server.tags.canCreate;
    //     serverChannel.send({ ethAddress });
    // }

    // _checkTagExistence = (tagList) => {
    //     const serverChannel = window.Channel.server.tags.exists;
    //     const clientChannel = window.Channel.client.tags.exists;
    //     if (!this.channelCb) {
    //         this.channelCb = (ev, response) => {
    //             if (response.data.exists) {
    //                 return this.setState({
    //                     existentTags: [...this.state.existentTags, response.data.tagName],
    //                     editorBusy: false
    //                 });
    //             }
    //             if (!response.data.exists) {
    //                 return this._checkTagCreationAllowance();
    //             }
    //             return null;
    //         };
    //     }
    //     clientChannel.on(this.channelCb);
    //     tagList.forEach((tagName) => {
    //         serverChannel.send({ tagName });
    //     });
    // }

    // removeExistsListener = () => {
    //     self.Channel.client.tags.exists.removeAllListeners();
    // }

    // componentWillUnmount () {
    //     this.removeExistsListener();
    //     this.props.searchResetResults();
    // }

    // _addNewTag = (tagName, existent) => {
    //     const { tags } = this.props;

    //     this.setState({
    //         existentTags: existent ? [...this.state.existentTags, existent] : this.state.existentTags,
    //         partialTag: '',
    //         tagInputWidth: 0,
    //         selectedSuggestionIndex: 0,
    //     }, () => {
    //         if (tags.includes(tagName.toLowerCase().replace('#', ''))) {
    //             return;
    //         }
    //         this.props.onTagUpdate(tags.push(tagName.toLowerCase().replace('#', '')));
    //         this.props.searchResetResults();
    //         this.tagInput.focus();
    //     });
    // }

    // _detectTagCreationKeys = (ev) => {
    //     if (tagCreatorKeycodes.includes(ev.which)) {
    //         if (this.state.partialTag.length > 2) {
    //             this._checkTagExistence([this.state.partialTag.toLowerCase()]);
    //             this._addNewTag(this.state.partialTag.toLowerCase());
    //             this.props.searchResetResults();
    //         }
    //         ev.preventDefault();
    //     }
    // }

    // _deleteTag = tagName =>
    //     () => {
    //         const { tags, inputDisabled } = this.props;
    //         const { existentTags } = this.state;
    //         if (inputDisabled) {
    //             return;
    //         }
    //         const filteredTags = tags.filter(tag => tag !== tagName);
    //         this.props.onTagUpdate(filteredTags);
    //         if (existentTags.includes(tagName)) {
    //             return;
    //         }
    //         this.props.onTagError(false);
    //     }

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

    _getTagInputPopoverContent = () => {
        const { tagSuggestions, tags, tagErrors } = this.props;
        if (tagErrors) {
            return (
              <div className="tag-editor__error-popover">
                <div className="tag-editor__error-popover-text">
                  {tagErrors}
                </div>
              </div>
            );
        }
        let selectionIndex = this.state.selectedSuggestionIndex;
        if (selectionIndex > tagSuggestions.length) {
            selectionIndex = tagSuggestions.length - 1;
        }
        /* eslint-disable react/no-array-index-key */
        return tagSuggestions.filter(tag => !tags.keyOf(tag)).map((tag, index) => (
          <div
            key={`suggested-${tag}-${index}`}
            onClick={() => this._createTag(tag)}
            className={
              `tag-editor__suggestion-item ${tag}
               tag-editor__suggestion-item${selectionIndex === index ? '_selected' : ''}`
            }
          >
            {tag}
          </div>
        ));
        /* eslint-enable react/no-array-index-key */
    }

    // _handleTagChange = (ev) => {
    //     if (this.state.partialTag.length === 32 && ev.target.value.length > 32) {
    //         return;
    //     }
    //     this.setState({
    //         partialTag: ev.target.value,
    //         tagInputWidth: this._getTextWidth(ev.target.value).width + 20,
    //     }, () => {
    //         if (this.state.partialTag.length >= 1) {
    //             this.props.searchTags(this.state.partialTag.replace('#', ''));
    //         } else {
    //             this.props.searchResetResults();
    //         }
    //         this.props.onChange();
    //         // return true;
    //     });
    // }
    // _focusTagInput = () => {
    //     this.setState({
    //         inputHasFocus: true
    //     }, () => {
    //         this.tagInput.focus();
    //     });
    // }

    // _changeInputFocus = focusState =>
    //     () => setTimeout(() => this.setState({
    //         inputHasFocus: focusState
    //     }, () => {
    //         if (this.state.inputHasFocus) {
    //             if (this.state.partialTag.length >= 1) {
    //                 this.props.searchTags(this.state.partialTag, true);
    //             }
    //         }
    //         if (!this.state.inputHasFocus) {
    //             this.props.searchResetResults();
    //             if (this.state.partialTag.length >= 1) {
    //                 this.setState({
    //                     editorBusy: true
    //                 }, () => {
    //                     this._checkTagExistence([this.state.partialTag.toLowerCase()]);
    //                     this._addNewTag(this.state.partialTag.toLowerCase());
    //                     this.props.searchResetResults();
    //                 });
    //             }
    //         }
    //     }), 100);

    _getTagCannotCreate = (tag) => {
        const { intl } = this.props;
        return (
          <div
            className="tag-editor__tag-item-popover-content"
          >
            <p className="tag-editor__tag-item-popover-message">
              {intl.formatMessage(tagMessages.notEnoughKarma)}
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
            </div>
          </div>
        );
    }
    // render () {
    //     const { tagInputWidth, inputHasFocus, existentTags, tagError } = this.state;
    //     const { canCreateTags, tagSuggestionsCount, intl, tags,
    //         inputDisabled, tagSuggestions, tagErrors } = this.props;
    //     const suggestionsPopoverVisible = (tagSuggestionsCount > 0 &&
    //         inputHasFocus && tagSuggestions.filter(tag => !tags.contains(tag)).size > 0);
    //     console.log(canCreateTags, 'can create tags?');
    //     return (
    //       <div
    //         className={`tag-editor ${this.props.className}`}
    //         ref={this.props.nodeRef}
    //         onClick={this._focusTagInput}
    //       >
    //         { /* eslint-disable react/no-array-index-key */ }
    //         {tags.map((tag, index) => (
    //           <Popover
    //             key={`${tag}-${index}`}
    //             placement="topLeft"
    //             content={this._getTagPopoverContent(tag)}
    //             overlayClassName="tag-editor__tag-item-popover"
    //             visible={!existentTags.includes(tag)}
    //           >
    //             <div
    //               className={
    //                 `flex-center-y tag-editor__tag-item
    //                 tag-editor__tag-item${existentTags.includes(tag) ? '' : '_should-register'}`
    //               }
    //             >
    //               { tag }
    //               {existentTags.includes(tag) && !tagError &&
    //                 <span
    //                   className="tag-item__delete-button"
    //                   onClick={this._deleteTag(tag)}
    //                 >
    //                   <Icon type="close" />
    //                 </span>
    //               }
    //               {!existentTags.includes(tag) && !tagError &&
    //                 <span className="tag-item__info-button" >
    //                   <Icon type="question" />
    //                 </span>
    //               }
    //             </div>
    //           </Popover>
    //         ))}
    //         { /* eslint-enable react/no-array-index-key */ }
    //         <Popover
    //           content={this._getTagInputPopoverContent()}
    //           placement="topLeft"
    //           visible={(tagErrors && tagErrors.length > 0) || suggestionsPopoverVisible}
    //           overlayClassName="tag-editor__suggestions-container"
    //         >
    //           <input
    //             ref={(node) => { this.tagInput = node; }}
    //             type="text"
    //             className="tag-editor__input"
    //             placeholder={intl.formatMessage(tagMessages.addTag)}
    //             onKeyPress={this._detectTagCreationKeys}
    //             onKeyDown={this._handleArrowKeyPress}
    //             onChange={this._handleTagChange}
    //             style={{
    //                 width: tagInputWidth,
    //             }}
    //             value={this.state.partialTag}
    //             onFocus={this._changeInputFocus(true)}
    //             onBlur={this._changeInputFocus(false)}
    //             disabled={
    //                 !tags.every(tag => existentTags.includes(tag)) ||
    //                 (tags.size >= 10) ||
    //                 inputDisabled
    //             }
    //           />
    //         </Popover>
    //       </div>
    //     );
    // }
    _forceTagInputFocus = () => {
        this.setState({
            inputHasFocus: true
        }, () => {
            this.tagInput.focus();
        });
    }

    _createTag = (tagName) => {
        console.log('create tag', tagName);
        this.props.onTagAdd(tagName.toLowerCase().trim().replace('#', ''));
        this.setState({
            partialTag: ''
        });
    }

    _deleteTag = tagName =>
        () => {
            this.props.onTagRemove(tagName);
        }

    _incrementSuggestionSelectionIndex = () => {
        const { tagSuggestions } = this.props;
        const maxIncrement = tagSuggestions.size;
        this.setState((prevState) => {
            if (prevState.selectedSuggestionIndex === maxIncrement - 1) {
                return {
                    selectedSuggestionIndex: 0
                };
            }
            return {
                selectedSuggestionIndex: prevState.selectedSuggestionIndex + 1
            };
        });
    }

    _decrementSuggestionSelectionIndex = () => {
        const { tagSuggestions } = this.props;
        const { size } = tagSuggestions;
        this.setState((prevState) => {
            if (prevState.selectedSuggestionIndex === 0) {
                return {
                    selectedSuggestionIndex: size - 1
                };
            }
            return {
                selectedSuggestionIndex: prevState.selectedSuggestionIndex - 1
            };
        });
    }
    /* eslint-disable no-fallthrough */
    _handleSpecialKeyPress = (ev) => {
        const pressedKey = ev.keyCode;
        const { tags } = this.props;
        if (tagCreatorKeycodes.includes(pressedKey) && this.state.partialTag.length) {
            this._createTag(this.state.partialTag);
            ev.preventDefault();
        } else {
            switch (pressedKey) {
                case 38: // arrow up
                    this._decrementSuggestionSelectionIndex();
                    ev.preventDefault();
                    break;
                case 40: // arrow down
                    this._incrementSuggestionSelectionIndex();
                    ev.preventDefault();
                    break;
                case 8: // backspace
                    if (this.state.partialTag.length === 0) {
                        this._deleteTag(tags.takeLast(1).keySeq().first())();
                    }
                    break;
                default:
                    break;
            }
        }
    }
    /* eslint-enable no-fallthrough */
    _handleTagInputChange = (ev) => {
        const tag = ev.target.value.trim().toLowerCase().replace('#', '');
        const alphaValid = /[a-z0-9.-]+$/.test(tag);
        const specialCharsValid = !tag.includes('.-') &&
            !tag.includes('-.') &&
            !tag.includes('--') &&
            !tag.includes('..');
        const isValid = specialCharsValid && alphaValid && !tag.startsWith('.') && !tag.startsWith('_');
        if (this.state.partialTag.length === 32 && ev.target.value.length > 32) {
            return;
        }
        this.setState((prevState) => {
            if (isValid || tag.length === 0) {
                return {
                    partialTag: tag,
                    tagInputWidth: this._getTextWidth(tag).width + 20,
                };
            }
            return {
                partialTag: prevState.partialTag,
                tagInputWidth: this._getTextWidth(prevState.partialTag).width + 20,
            };
        }, () => {
            if (this.state.partialTag.length >= 1) {
                this.props.searchTags(this.state.partialTag.trim().toLowerCase().replace('#', ''));
            } else {
                this.props.searchResetResults();
            }
            this.props.onChange();
        });
    }

    _changeInputFocus = focusState =>
        () => {
            this.setState({
                inputHasFocus: focusState
            }, () => {
                if (!this.state.inputHasFocus) {
                    this.props.searchResetResults();
                    // if (this.state.partialTag.length >= 1) {
                    //     this._createTag(this.state.partialTag);
                    //     this.props.searchResetResults();
                    // }
                }
            });
        }
    _handleCannotCreatePopoverVisibility = (visible) => {
        const { tags } = this.props;
        if (!visible) {
            this._deleteTag(tags.findLastKey(val => !val.exists))();
        }
    }
    _getTagList = () => {
        const { tags, canCreateTags } = this.props;
        // return tags
        return tags.map((status, tag) => (
          <Popover
            key={`${tag}`}
            placement="topLeft"
            content={
                !canCreateTags &&
                (!status.checking && !status.exists) &&
                this._getTagCannotCreate(tag, status, canCreateTags)
            }
            overlayClassName="tag-editor__tag-item-popover"
            visible={!canCreateTags && (!status.checking && !status.exists)}
            onVisibleChange={this._handleCannotCreatePopoverVisibility}
          >
            <div
              className={
                `flex-center-y tag-editor__tag-item
                tag-editor__tag-item${(canCreateTags && (!status.checking && !status.exists)) ? '_should-register' : ''}
                tag-editor__tag-item${(!canCreateTags && (!status.checking && !status.exists)) ? '_cannot-add' : ''}`
              }
            >
              { tag }
              <span
                className="tag-item__delete-button"
                onClick={this._deleteTag(tag)}
              >
                <Icon type="close" />
              </span>
              {!canCreateTags && (!status.checking && !status.exists) &&
                <span className="tag-item__info-button" >
                  <Icon type="question" />
                </span>
              }
            </div>
          </Popover>
        )).toIndexedSeq();
    }
    render () {
        const { tagInputWidth, inputHasFocus, tagError } = this.state;
        const { tagSuggestionsCount, intl, tags,
            inputDisabled, tagSuggestions, tagErrors } = this.props;
        const suggestionsPopoverVisible = (tagSuggestionsCount > 0 &&
            inputHasFocus && tagSuggestions.filter(tag => !tags.keyOf(tag)).size > 0);

        return (
          <div
            className={`tag-editor ${this.props.className}`}
            ref={this.props.nodeRef}
            onClick={this._forceTagInputFocus}
          >
            {this._getTagList()}
            <Popover
              content={this._getTagInputPopoverContent()}
              placement="topLeft"
              visible={(tagErrors && tagErrors.length > 0) || suggestionsPopoverVisible}
              overlayClassName="tag-editor__suggestions-container"
            >
              <input
                ref={(node) => { this.tagInput = node; }}
                type="text"
                className="tag-editor__input"
                placeholder={intl.formatMessage(tagMessages.addTag)}
                onKeyDown={this._handleSpecialKeyPress}
                onChange={this._handleTagInputChange}
                style={{
                  width: tagInputWidth,
                }}
                value={this.state.partialTag}
                onFocus={this._changeInputFocus(true)}
                onBlur={this._changeInputFocus(false)}
                disabled={false
            //   !tags.every(tag => existentTags.includes(tag)) ||
            //   (tags.size >= 10) ||
            //   inputDisabled
                }
              />
            </Popover>
          </div>
        );
    }
}

TagEditor.propTypes = {
    className: PropTypes.string,
    canCreateTags: PropTypes.bool.isRequired,
    ethAddress: PropTypes.string,
    intl: PropTypes.shape(),
    inputDisabled: PropTypes.bool,
    match: PropTypes.shape(),
    nodeRef: PropTypes.func,
    onTagUpdate: PropTypes.func,
    searchTags: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    tagErrors: PropTypes.string,
    tags: PropTypes.shape(),
    searchResetResults: PropTypes.func,
    onTagError: PropTypes.func,
    onChange: PropTypes.func,
    onTagAdd: PropTypes.func.isRequired,
    onTagRemove: PropTypes.func.isRequired,
};

export default TagEditor;
