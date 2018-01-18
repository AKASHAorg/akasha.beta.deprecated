import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Input } from 'antd';
import { Icon } from '../';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { isInternalLink } from '../../utils/url-utils';

class UrlInput extends Component {
    state = {
        isInvalid: false,
        value: ''
    };

    componentDidMount () {
        if (this.props.autoFocus) {
            setTimeout(() => {
                if (this.input) {
                    this.input.focus();
                }
            }, 50);
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        const { isInvalid, value } = nextState;
        if (isInvalid !== this.state.isInvalid || value !== this.state.value) {
            return true;
        }
        return false;
    }

    getInputRef = (el) => { this.input = el; };

    copyUrl = () => {
        const { onSubmit, showNotification, value } = this.props;
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'fixed';
        textArea.style.top = -99999;
        textArea.style.left = -99999;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification({
            id: 'linkCopiedToClipboard',
            duration: 2
        });
        onSubmit();
    };

    onInputChange = (ev) => {
        this.setState({ isInvalid: false, value: ev.target.value });
    };

    onKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            this.handleSubmit();
        }
    };

    handleAction = () => {
        const { readOnly } = this.props;
        if (readOnly) {
            this.copyUrl();
        } else {
            this.handleSubmit();
        }
    };

    handleSubmit = () => {
        const { history, onSubmit } = this.props;
        const { value } = this.state;
        const isValid = isInternalLink(value);
        if (isValid) {
            onSubmit();
            history.push(`/${this.state.value}`);
        } else {
            this.setState({
                isInvalid: true
            });
        }
    };

    render () {
        const { intl, readOnly } = this.props;
        const { isInvalid, value } = this.state;
        const buttonLabel = readOnly ?
            intl.formatMessage(generalMessages.copy) :
            intl.formatMessage(generalMessages.go);

        return (
          <div className="flex-center-y url-input">
            <div className="url-input__link-icon-wrapper">
              <Icon className="url-input__link-icon" type="linkEntry" />
            </div>
            <Input
              className="url-input__input"
              onChange={this.onInputChange}
              onKeyDown={this.onKeyDown}
              readOnly={readOnly}
              ref={this.getInputRef}
              value={readOnly ? this.props.value : value}
            />
            <div className="url-input__button" onClick={this.handleAction}>
              {buttonLabel}
            </div>
            {isInvalid &&
              <div className="url-input__error">
                {intl.formatMessage(formMessages.navigationError)}
              </div>
            }
          </div>
        );
    }
}

UrlInput.propTypes = {
    autoFocus: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    onSubmit: PropTypes.func,
    readOnly: PropTypes.bool,
    showNotification: PropTypes.func,
    value: PropTypes.string,
};

export default withRouter(injectIntl(UrlInput));
