import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { FlatButton } from 'material-ui';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { Input } from '../';

class NewIdentityForm extends Component {
    state = {
        confirmPassphrase: '',
        errorText: '',
        passphrase: ''
    };

    onPassphraseChange = (ev) => {
        this.setState({
            errorText: '',
            passphrase: ev.target.value
        });
    };

    onConfirmPassphraseChange = (ev) => {
        this.setState({
            confirmPassphrase: ev.target.value,
            errorText: ''
        });
    };

    handleKeyPress = (ev) => {
        const { confirmPassphrase, errorText, passphrase } = this.state;
        if (ev.key === 'Enter' && confirmPassphrase && passphrase && !errorText) {
            this.handleSubmit(ev);
        }
    };

    handleSubmit = (ev) => {
        console.log('handle submit');
        const { intl, onSubmit } = this.props;
        const { confirmPassphrase, passphrase } = this.state;
        ev.preventDefault();
        if (passphrase === confirmPassphrase) {
            onSubmit(new TextEncoder('utf-8').encode(passphrase));
        } else {
            this.setState({
                errorText: intl.formatMessage(formMessages.passphraseConfirmError)
            });
        }
    };

    showTerms = (ev) => {
        ev.preventDefault();
        this.props.showTerms();
    }

    render () {
        const { buttonsDisabled, intl, onCancel } = this.props;
        const { confirmPassphrase, errorText, passphrase } = this.state;
        const { palette } = this.context.muiTheme;
        const termsLink = (
          <a
            href="#"
            onClick={this.showTerms}
            style={{ color: palette.primary1Color }}
          >
            {intl.formatMessage(generalMessages.termsOfService)}
          </a>
        );

        return (
          <div style={{ marginTop: '16px', overflow: 'hidden' }}>
            <form onSubmit={this.handleSubmit}>
              <Input
                autoFocus
                label={intl.formatMessage(formMessages.passphrase)}
                onChange={this.onPassphraseChange}
                onKeyPress={this.handleKeyPress}
                placeholder={intl.formatMessage(formMessages.passphrasePlaceholder)}
                type="password"
                value={passphrase}
              />
              <Input
                errorText={errorText}
                label={intl.formatMessage(formMessages.confirmPassphrase)}
                onChange={this.onConfirmPassphraseChange}
                onKeyPress={this.handleKeyPress}
                placeholder={intl.formatMessage(formMessages.passphrasePlaceholder)}
                type="password"
                value={confirmPassphrase}
              />
              <div
                style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-top' }}
              >
                <div>
                  <small>
                    <FormattedMessage
                      {...generalMessages.terms}
                      values={{ termsLink }}
                    />
                  </small>
                </div>
                <div style={{ flex: '0 0 auto', marginLeft: '60px' }}>
                  <FlatButton
                    disabled={buttonsDisabled}
                    label={intl.formatMessage(generalMessages.cancel)}
                    labelStyle={{ color: palette.disabledColor }}
                    onClick={onCancel}
                  />
                  <FlatButton
                    disabled={!!errorText || !passphrase || !confirmPassphrase || buttonsDisabled}
                    label={intl.formatMessage(generalMessages.submit)}
                    onClick={this.handleSubmit}
                  />
                </div>
              </div>
            </form>
          </div>
        );
    }
}

NewIdentityForm.contextTypes = {
    muiTheme: PropTypes.shape()
};

NewIdentityForm.propTypes = {
    buttonsDisabled: PropTypes.bool,
    intl: PropTypes.shape(),
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    showTerms: PropTypes.func.isRequired
};

export default injectIntl(NewIdentityForm);
