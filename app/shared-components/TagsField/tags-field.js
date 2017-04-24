import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { AutoComplete, Chip, IconButton } from 'material-ui';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import AddIcon from 'material-ui/svg-icons/content/add';
import RemoveIcon from 'material-ui/svg-icons/navigation/close';
import PendingIcon from 'material-ui/svg-icons/action/schedule';
import { validateTag } from '../../utils/dataModule';
import { formMessages } from '../../locale-data/messages';

const BACKSPACE = 'Backspace';
const COMMA = ',';
const SEMICOLON = ';';
const SPACE = ' ';
const TAB = 'Tab';

class TagsField extends React.Component {
    constructor (props) {
        super(props);
        this.inputWidth = null;
        this.state = {
            tagString: '',
            erroredTags: [],
            dataSource: []
        };
        Channel.client.tags.searchTag.on(this.hydrateDataSource);
    }

    componentDidMount () {
        if (this._tagsInput) {
            this._tagsInput.focus();
        }
    }

    componentWillReceiveProps (nextProps) {
        const { checkExistingTags, existingTags, registerPending } = nextProps;
        const erroredTags = registerPending.filter(tag => !!tag.error);
        const registeredTags = registerPending.filter(tag =>
            this.props.registerPending.find(oldTag =>
                oldTag.tagName === tag.tagName && oldTag.value && !tag.value
            )
        );
        if (registeredTags.size) {
            checkExistingTags(registeredTags.map(tag => tag.tagName).concat(existingTags));
        }
        if (erroredTags.size > 0) {
            this.setState({
                erroredTags: erroredTags.map(tag => ({
                    tag: tag.tagName || '',
                    message: tag.error
                }))
            });
        }
    }

    componentWillUnmount () {
        Channel.client.tags.searchTag.removeListener(this.hydrateDataSource);
    }

    hydrateDataSource = (ev, result) => {
        this.setState({ dataSource: result.data.collection });
    };

    _checkTagAutocomplete = (value) => {
        if (this.props.onRequestTagAutocomplete) {
            this.props.onRequestTagAutocomplete(value);
        }
    };

    _delayedReq = debounce(() => {
        this._checkTagAutocomplete(this.state.tagString);
        Channel.server.tags.searchTag.send({ tagName: this.state.tagString, limit: 3 });
    }, 210);

    _handleInputChange = (ev) => {
        const { intl } = this.props;
        if (this.state.tagString.length >= 24 && ev.target.value.length >= 24) {
            this.setState({
                error: intl.formatMessage(formMessages.tooLongError)
            });
            return;
        }
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.fontSize = '16px';
        span.style.whiteSpace = 'pre';
        span.innerHTML = ev.target.value;
        document.body.appendChild(span);
        this.inputWidth = span.getBoundingClientRect().width + 3 + 'px';
        document.body.removeChild(span);
        this.setState({
            tagString: ev.target.value,
            error: null
        });
        if (ev.target.value.length >= 3) {
            this._delayedReq();
        }
    };

    _handleKeyDown = (ev) => {
        if (ev.key === BACKSPACE && this.state.tagString.length === 0) {
            this._delayedDelete();
        }
        if (ev.key === TAB && this.state.tagString.length > 0) {
            ev.preventDefault();
            this._createTag();
            this.setState({
                tagString: '',
                dataSource: []
            });
        }
    }

    _delayedDelete = throttle(() => this.props.onDelete(this.props.tags.length - 1), 100);

    _handleDeleteTag = (ev, index) => {
        this.props.onDelete(index);
    };

    _createTag = () => {
        const { intl } = this.props;
        const currentTags = this.props.tags;
        const tag = this.state.tagString.trim().toLowerCase();
        this.inputWidth = null;
        if (currentTags.indexOf(tag) > -1) {
            const errorMessage = intl.formatMessage(formMessages.tagAlreadyAdded, { tag });
            return this.setState({
                error: errorMessage,
                tagString: ''
            });
        }
        const error = validateTag(tag);
        if (error) {
            const errorMessage = intl.formatMessage(formMessages[error]);
            this.setState({
                error: errorMessage
            });
        } else {
            this.setState({
                error: ''
            });
            if (this.props.onTagAdded) {
                this.props.onTagAdded(tag);
            }
        }
    };
    _handleTagRegister = (ev, tag) => {
        ev.preventDefault();
        this.props.onTagRegisterRequest(tag);
    };
    _handleTagDetect = (ev) => {
        const MODIFIER_KEYS = [SPACE, COMMA, SEMICOLON];
        for (let i = 0; i < MODIFIER_KEYS.length; i += 1) {
            if (ev.key === MODIFIER_KEYS[i]) {
                ev.preventDefault();
                this._createTag();
                this.setState({
                    tagString: '',
                    dataSource: []
                });
            }
        }
    };
    _handleSelect = (value) => {
        this.setState({
            tagString: value
        });

        this._createTag();

        this.setState({
            tagString: ''
        });
        this._tagsInput.focus();
    };
    render () {
        const currentTags = this.props.tags;
        const { registerPending, existingTags, errorText, disabled } = this.props;
        const { erroredTags } = this.state;
        const tags = currentTags.map((tag, key) => {
            const tagExists = existingTags.indexOf(tag) > -1;
            const tagIsPending = registerPending.toJS().find(tagObj => tagObj.tagName === tag);
            const erroredTag = erroredTags.find(tagObj => tagObj.tag === tag);
            let borderColor;
            if (tagIsPending && tagIsPending.value) {
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
                backgroundColor: 'rgba(0,0,0,0)',
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
                {tagIsPending && tagIsPending.value &&
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
                    disabled={disabled}
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
                  disabled={disabled}
                >
                  <RemoveIcon />
                </IconButton>
              </Chip>
            );
        });
        return (
          <AutoComplete
            fullWidth
            id="tags"
            multiLine
            style={{ lineHeight: 'inherit', height: 'inherit', marginBottom: '16px', cursor: 'text' }}
            errorText={this.state.error || errorText}
            underlineStyle={{ bottom: '-4px' }}
            underlineShow={(currentTags.length < 10)}
            errorStyle={{ position: 'absolute', bottom: '-20px' }}
            onChange={this._handleInputChange}
            value={this.state.tagString}
            onBlur={this._handleInputBlur}
            onClick={() => this._tagsInput && this._tagsInput.focus()}
            onNewRequest={this._handleSelect}
            dataSource={this.state.dataSource}
            textFieldStyle={{ minHeight: '48px', height: 'inherit' }}
          >
            <div>
              {tags}
              {!disabled && currentTags.length < 10 &&
                <input
                  style={{
                      display: 'inline-block',
                      outline: 'inherit',
                      border: 'inherit',
                      verticalAlign: 'middle',
                      height: '32px',
                      width: this.inputWidth || 0,
                      minWidth: '70px'
                  }}
                  type="text"
                  onChange={this._handleInputChange}
                  value={this.state.tagString}
                  maxLength="24"
                  placeholder="add a tag"
                  onKeyPress={this._handleTagDetect}
                  onKeyDown={this._handleKeyDown}
                  disabled={currentTags.length >= 10}
                  ref={(r) => { this._tagsInput = r; }}
                />
              }
            </div>
          </AutoComplete>
        );
    }
}

TagsField.propTypes = {
    checkExistingTags: PropTypes.func,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    onTagAdded: PropTypes.func,
    onDelete: PropTypes.func,
    existingTags: PropTypes.arrayOf(PropTypes.string),
    registerPending: PropTypes.shape(),
    onRequestTagAutocomplete: PropTypes.func,
    onTagRegisterRequest: PropTypes.func,
    intl: PropTypes.shape()
};

export default injectIntl(TagsField);
