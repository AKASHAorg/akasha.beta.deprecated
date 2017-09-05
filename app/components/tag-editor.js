import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'antd';

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
    state = {
        partialTag: '',
        createdTags: [],
        existentTags: [],
        tagInputWidth: 0,
    }

    getTags = () =>
        this.state.createdTags;

    // capture up and down keys.
    // when input is in focus and suggestions are visible,
    // prevent default behaviour and navigate through results
    _handleArrowKeyPress = (ev) => {
        const { inputHasFocus } = this.state;
        const { tagSuggestionsCount } = this.props;
        const controllingSuggestions = suggestionsControlKeys.includes(ev.which);
        if (inputHasFocus && controllingSuggestions && tagSuggestionsCount > 0) {
            switch (ev.which) {
                case 13:
                    console.log('create the tag selected');
                    break;
                case 38:
                    console.log('change tag selection to one up');
                    break;
                case 40:
                    console.log('change tag selection one down');
                    break;
                default:
                    break;
            }
            if (!ev.defaultPrevented) {
                ev.preventDefault();
            }
        }
    }
    _checkTagExistence = tags =>
        new Promise((resolve) => {
            resolve(tags);
        })

    _detectTagCreationKeys = (ev) => {
        if (tagCreatorKeycodes.includes(ev.which)) {
            this._checkTagExistence([this.state.partialTag, ...this.state.createdTags]);
            if (this.state.partialTag.length > 2) {
                this.setState({
                    createdTags: [...this.state.createdTags, this.state.partialTag],
                    partialTag: '',
                    tagInputWidth: 0
                });
            }
            ev.preventDefault();
        }
    }

    _deleteTag = tagName =>
        () => {
            this.setState({
                createdTags: [...this.state.createdTags.filter(tag => tag !== tagName)]
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
        return tagSuggestions.map((tag, index) => (
          <div key={`suggested-${tag}-${index}`}>{tag}</div>
        ));
    }

    _handleTagChange = (ev) => {
        this.setState({
            partialTag: ev.target.value,
            tagInputWidth: this._getTextWidth(ev.target.value).width + 20,
        }, () => {
            if (this.state.partialTag.length > 2) {
                this.props.tagSearch({
                    tag: this.state.partialTag,
                    localOnly: true
                });
            }
        });
    }

    _changeInputFocus = focusState =>
        () => this.setState({
            inputHasFocus: focusState
        })

    render () {
        const { createdTags, tagInputWidth, inputHasFocus, existentTags } = this.state;
        const { tagSuggestionsCount } = this.props;

        return (
          <div
            className="tag-editor"
            ref={this.props.nodeRef}
          >
            {createdTags.map((tag, index) => (
              <div
                className={
                  `tag-editor__tag-item
                  tag-editor__tag-item_${existentTags.includes(tag) ? '' : 'should-register'}`
                }
                key={`${tag}-${index}`}
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
            ))}
            <Popover
              content={this._getTagSuggestions()}
              placement="topLeft"
              visible={tagSuggestionsCount > 0 && inputHasFocus}
            >
              <input
                type="text"
                className="tag-editor__input"
                placeholder="#category..."
                onKeyPress={this._detectTagCreationKeys}
                onKeyDown={this._handleArrowKeyPress}
                onChange={this._handleTagChange}
                style={{
                    width: tagInputWidth,
                }}
                value={this.state.partialTag}
                onFocus={this._changeInputFocus(true)}
                onBlur={this._changeInputFocus(false)}
              />
            </Popover>
          </div>
        );
    }
}

TagEditor.propTypes = {
    nodeRef: PropTypes.func,
    tagSearch: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
};

export default TagEditor;
