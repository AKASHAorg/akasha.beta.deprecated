import React from 'react';
import { TextField, Chip } from 'material-ui';

class TagsField extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currentTags: props.tags || []
        };
    }
    _handleInputChange = (ev) => {
        this.setState({
            tagString: ev.target.value,
        });
    }
    _handleDeleteTag = (ev, index) => {
        const currentTags = this.state.currentTags.slice();
        currentTags.splice(index, 1);
        this.setState({
            currentTags
        });
    }
    _createTag = () => {
        // @TODO allow alphanumeric characters only
        const tag = this.state.tagString.trim().toLowerCase();
        if (this.state.currentTags.indexOf(tag) !== -1) {
            return this.setState({
                error: `Tag "${tag}" already added!`,
                tagString: ''
            });
        }
        if (tag.length > 2 && tag.length < 25) {
            this.state.currentTags.push(tag);
            this.state.error = '';
            if (this.props.onTagAdded) {
                this.props.onTagAdded(tag);
            }
        } else {
            this.setState({
                error: 'Tags can have between 3 and 24 characters',
                tagString: ''
            });
        }
        return null;
    }
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
    }
    render () {
        const currentTags = this.state.currentTags;
        const tags = currentTags.map((tag, key) => (
          <Chip
            key={key}
            onRequestDelete={(ev) => { this._handleDeleteTag(ev, key); }}
            backgroundColor="transparent"
            style={{
                display: 'inline-block',
                border: '1px solid #DDD',
                borderRadius: 3,
                height: 34,
                verticalAlign: 'middle',
                marginRight: '4px',
                marginBottom: '4px',
            }}
            labelStyle={{ lineHeight: '32px', display: 'inline-block', verticalAlign: 'top' }}
          >
            {tag}
          </Chip>
            )
        );
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
};

export default TagsField;
