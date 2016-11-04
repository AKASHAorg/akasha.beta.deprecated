import React from 'react';
import { TextField, Chip } from 'material-ui';

class TagsField extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tagString: ''
        };
    }
    _checkTagAutocomplete = (value) => {
        this.props.onRequestTagAutocomplete(value);
    };
    _handleInputChange = (ev) => {
        if (ev.target.value.length >= 3) {
            this._checkTagAutocomplete(ev.target.value);
        }
        this.setState({
            tagString: ev.target.value,
        });
    };
    _handleDeleteTag = (ev, index) => {
        this.props.onDelete(index);
    };
    _createError = (error, removeCurrentTag) => {
        this.setState({
            error
        });
        if (removeCurrentTag) {
            this.setState({
                tagString: ''
            });
        }
    };
    _createTag = () => {
        const currentTags = this.props.tags;
        const tag = this.state.tagString.trim().toLowerCase();
        const ALPHANUMERIC_REGEX = /^(?:[a-zA-Z0-9]+(?:(-|_)(?!$))?)+$/;
        if (currentTags.indexOf(tag) > -1) {
            return this._createError(`Tag "${tag}" already added!`, true);
        }
        if (tag.length > 2 && tag.length <= 24) {
            if (ALPHANUMERIC_REGEX.test(tag)) {
                this.state.error = '';
                if (this.props.onTagAdded) {
                    this.props.onTagAdded(tag);
                }
            } else {
                this._createError('Tags can contain only letters, numbers, one dash ( - ) or one underscore ( _ ).', false);
            }
        } else if (tag.length >= 25) {
            this._createError('Tags can have maximum 24 characters.', false);
        } else {
            this._createError('Tags should have at least 3 characters.', false);
        }
        return null;
    };
    _handleTagDetect = (ev) => {
        const MODIFIER_CHARCODES = [13, 32, 44, 59];
        for (let i = 0; i < MODIFIER_CHARCODES.length; i++) {
            if (ev.charCode === MODIFIER_CHARCODES[i]) {
                ev.preventDefault();
                this._createTag();
                this.setState({
                    tagString: ''
                });
            }
        }
    };
    _handleInputBlur = (ev) => {
        const value = ev.target.value;
        if (value && value.length > 0) {
            this._createTag();
            this.setState({
                tagString: ''
            });
        }
        if (this.props.onBlur) {
            this.props.onBlur(ev);
        }
    };
    render () {
        const currentTags = this.props.tags;
        const tags = currentTags.map((tag, key) => {
            console.log(this.props.existingTags, 'existingTags');
            const tagExists = this.props.existingTags.indexOf(tag) > -1;
            // console.log(tagExists, tag, this.props.existingTags, 'exists?');
            const style = {
                display: 'inline-block',
                border: '1px solid',
                borderColor: tagExists ? '#74cc00' : '#ffaa0e',
                borderRadius: 3,
                height: 34,
                verticalAlign: 'middle',
                marginRight: '4px',
                marginBottom: '4px',
            };
            // onRequestDelete={(ev) => { this._handleDeleteTag(ev, key); }}
            return (
              <Chip
                key={key}

                backgroundColor="transparent"
                title={tagExists ? 'Tag exists in the network' : 'This tag will be added'}
                style={style}
                labelStyle={{ lineHeight: '32px', display: 'inline-block', verticalAlign: 'top' }}
              >
                {tag} <a href="">+</a> <a href="" onClick={(ev) => { this._handleDeleteTag(ev, key); }}>X</a>
              </Chip>
          );
        });
        return (
          <TextField
            fullWidth
            id="tags"
            multiLine
            style={{ lineHeight: 'inherit', height: 'inherit', marginBottom: '24px' }}
            errorText={this.state.error}
            underlineStyle={{ bottom: '-4px' }}
            errorStyle={{ bottom: '-18px' }}
            disabled={currentTags >= 10}
            onChange={this._handleInputChange}
            value={this.state.tagString}
            onBlur={this._handleInputBlur}
          >
            <div>
              {tags}
              <input
                style={{
                    display: 'inline-block',
                    outline: 'inherit',
                    border: 'inherit',
                    verticalAlign: 'middle',
                    height: '32px',
                    width: '250px',
                    opacity: (currentTags.length >= 10) ? 0 : 1
                }}
                type="text"
                onChange={this._handleInputChange}
                value={this.state.tagString}
                placeholder={
                    currentTags.length < 3 ?
                    `add a tag (${3 - currentTags.length} free remaining)` :
                    'add a tag (paid)'
                }
                onKeyPress={this._handleTagDetect}
                disabled={currentTags.length >= 10}
              />
            </div>
          </TextField>
        );
    }
}
TagsField.propTypes = {
    tags: React.PropTypes.array,
    onTagAdded: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    existingTags: React.PropTypes.array,
    onRequestTagAutocomplete: React.PropTypes.func,
    onBlur: React.PropTypes.func
};

export default TagsField;
