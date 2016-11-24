import React from 'react';
import { TextField, Chip, IconButton } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import RemoveIcon from 'material-ui/svg-icons/navigation/close';
import PendingIcon from 'material-ui/svg-icons/action/schedule';

class TagsField extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tagString: '',
            erroredTags: []
        };
    }
    componentWillReceiveProps (nextProps) {
        const { pendingTags } = nextProps;
        const erroredTags = pendingTags.filter(tag => typeof tag.error === 'object');
        if (erroredTags.size > 0) {
            this.setState({
                erroredTags: erroredTags.map(tag => ({
                    tag: tag.error.from ? tag.error.from.tagName : '',
                    message: tag.error.message
                }))
            });
        }
    }
    _checkTagAutocomplete = (value) => {
        if (this.props.onRequestTagAutocomplete) {
            this.props.onRequestTagAutocomplete(value);
        }
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
    _handleTagRegister = (ev, tag) => {
        ev.preventDefault();
        this.props.onTagRegisterRequest(tag);
    }
    _handleTagDetect = (ev) => {
        const MODIFIER_KEYS = ['Enter', ' ', ',', ';'];
        for (let i = 0; i < MODIFIER_KEYS.length; i += 1) {
            if (ev.key === MODIFIER_KEYS[i]) {
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
        const { pendingTags, existingTags } = this.props;
        const { erroredTags } = this.state;
        const tags = currentTags.map((tag, key) => {
            const tagExists = existingTags.indexOf(tag) > -1;
            const tagIsPending = pendingTags.toJS().find(tagObj => tagObj.payload.tagName === tag);
            const erroredTag = erroredTags.find(tagObj => tagObj.tag === tag);
            let borderColor;
            if (tagIsPending) {
                borderColor = '#ffaa0e';
            } else if (erroredTag) {
                borderColor = 'red';
            } else if (tagExists) {
                borderColor = '#74cc00';
            } else {
                borderColor = '#ffaa0e';
            }
            let erroredTagMessage;
            if (erroredTag) {
                if (erroredTag.error) {
                    erroredTagMessage = erroredTag.error.message;
                } else {
                    erroredTagMessage = erroredTag.message;
                }
            }
            const style = {
                display: 'inline-block',
                border: '1px solid',
                borderColor,
                borderRadius: 3,
                height: 34,
                verticalAlign: 'middle',
                marginRight: '4px',
                marginBottom: '4px',
            };
            const tagActionButtonStyle = {
                padding: 0,
                height: 25,
                verticalAlign: 'middle',
                marginLeft: 8,
                width: 25,
                transform: 'scale(0.7)'
            };
            return (
              <Chip
                key={key}
                backgroundColor="transparent"
                style={style}
                title={erroredTagMessage}
                labelStyle={{
                    lineHeight: '32px',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    paddingRight: 0
                }}
              >
                <span style={{ fontWeight: 500 }}>{tag}</span>
                {tagIsPending &&
                  <PendingIcon
                    title="Registering tag"
                    style={tagActionButtonStyle}
                  />
                }
                {!tagExists && !tagIsPending &&
                  <IconButton
                    onClick={ev => this._handleTagRegister(ev, tag)}
                    style={tagActionButtonStyle}
                    disableTouchRipple
                  >
                    {!tagIsPending && !erroredTag &&
                      <AddIcon title={'Register tag'} />
                    }
                  </IconButton>
                }
                <IconButton
                  onClick={ev => this._handleDeleteTag(ev, key)}
                  title={'Remove tag'}
                  style={{ ...tagActionButtonStyle, marginLeft: 0 }}
                  disableTouchRipple
                >
                  <RemoveIcon />
                </IconButton>
              </Chip>
          );
        });
        return (
          <TextField
            fullWidth
            id="tags"
            multiLine
            style={{ lineHeight: 'inherit', height: 'inherit', marginBottom: '16px' }}
            errorText={this.state.error}
            underlineStyle={{ bottom: '-4px' }}
            underlineShow={(currentTags.length < 10)}
            errorStyle={{ bottom: '-18px' }}
            onChange={this._handleInputChange}
            value={this.state.tagString}
            onBlur={this._handleInputBlur}
          >
            <div>
              {tags}
              {(currentTags.length < 10) &&
                <input
                  style={{
                      display: 'inline-block',
                      outline: 'inherit',
                      border: 'inherit',
                      verticalAlign: 'middle',
                      height: '32px',
                      width: '250px'
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
              }
            </div>
          </TextField>
        );
    }
}
TagsField.propTypes = {
    tags: React.PropTypes.arrayOf(React.PropTypes.string),
    onTagAdded: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    existingTags: React.PropTypes.arrayOf(React.PropTypes.string),
    pendingTags: React.PropTypes.shape(),
    onRequestTagAutocomplete: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onTagRegisterRequest: React.PropTypes.func
};

export default TagsField;
