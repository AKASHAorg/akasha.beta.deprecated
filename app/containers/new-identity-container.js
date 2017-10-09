import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Form, Input } from 'antd';
import { formMessages, generalMessages, setupMessages } from '../locale-data/messages';
import { profileCreateEthAddress } from '../local-flux/actions/profile-actions';
import { showTerms } from '../local-flux/actions/app-actions';
import { selectLoggedEthAddress, selectProfileFlag } from '../local-flux/selectors';

const FormItem = Form.Item;

const hasErrors = fieldsError =>
    Object.keys(fieldsError).some(field => fieldsError[field]);

class NewIdentity extends Component {
    state = {
        confirmDirty: false
    };

    componentWillReceiveProps (nextProps) {
        const { loggedEthAddress, history } = this.props;
        if (!loggedEthAddress && nextProps.loggedEthAddress) {
            history.push('/setup/new-identity-interests');
        }
    }

    onConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    onConfirmChange = () => {
        const { setFields } = this.props.form;
        setFields({ passphrase1: { errors: null } });
    };

    checkConfirm = (rule, value, callback) => {
        const { intl } = this.props;
        const form = this.props.form;
        if (value && value !== form.getFieldValue('passphrase')) {
            callback(intl.formatMessage(formMessages.passphraseConfirmError));
        } else {
            callback();
        }
    };

    checkPassphrase = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['passphrase1'], { force: true });
        }
        callback();
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const passphrase = new TextEncoder('utf-8').encode(values.passphrase);
                const passphrase1 = new TextEncoder('utf-8').encode(values.passphrase1);
                this.props.profileCreateEthAddress({ passphrase, passphrase1 });
            }
        });
    };

    showTerms = (ev) => {
        ev.preventDefault();
        this.props.showTerms();
    }

    renderForm = () => {
        const { intl } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
          <div className="new-identity__form-wrapper">
            <FormItem colon={false} label={intl.formatMessage(formMessages.passphrase)}>
              {getFieldDecorator('passphrase', {
                  rules: [{
                      required: true,
                      whitespace: true,
                      message: intl.formatMessage(formMessages.requiredError)
                  }, {
                      validator: this.checkPassphrase
                  }]
              })(
                <Input
                  autoFocus
                  placeholder={intl.formatMessage(formMessages.passphrasePlaceholder)}
                  size="large"
                  type="password"
                />
              )}
            </FormItem>
            <FormItem colon={false} label={intl.formatMessage(formMessages.confirmPassphrase)}>
              {getFieldDecorator('passphrase1', {
                  rules: [{
                      required: true,
                      whitespace: true,
                      message: intl.formatMessage(formMessages.requiredError)
                  }, {
                      validator: this.checkConfirm
                  }],
                  validateTrigger: 'onBlur'
              })(
                <Input
                  onBlur={this.onConfirmBlur}
                  onChange={this.onConfirmChange}
                  placeholder={intl.formatMessage(formMessages.passphrasePlaceholder)}
                  size="large"
                  type="password"
                />
              )}
            </FormItem>
          </div>
        );
    };

    render () {
        const { ethAddressPending, history, intl, loginPending } = this.props;
        const { getFieldsError } = this.props.form;
        const buttonsDisabled = loginPending || ethAddressPending;
        const termsLink = (
          <a href="#" onClick={this.showTerms}>
            {intl.formatMessage(generalMessages.termsOfService)}
          </a>
        );

        return (
          <div className="setup-content setup-content__column_full new-identity">
            <Form hideRequiredMark onSubmit={this.handleSubmit}>
              <div className="setup-content__column-content new-identity__content">
                <div className="heading new-identity__title">
                  {intl.formatMessage(setupMessages.createIdentity)}
                </div>
                <div className="new-identity__subtitle">
                  {intl.formatMessage(setupMessages.newIdentitySubtitle)}
                </div>
                {this.renderForm()}
                <div className="content-link new-identity__terms">
                  <small>
                    <FormattedMessage
                      {...generalMessages.terms}
                      values={{ termsLink }}
                    />
                  </small>
                </div>
              </div>
              <div className="setup-content__column-footer new-identity__footer">
                <Button
                  className="new-identity__button"
                  disabled={buttonsDisabled}
                  onClick={history.goBack}
                  size="large"
                >
                  {intl.formatMessage(generalMessages.cancel)}
                </Button>
                <Button
                  className="new-identity__button"
                  disabled={hasErrors(getFieldsError()) || buttonsDisabled}
                  htmlType="submit"
                  onClick={this.handleSubmit}
                  size="large"
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.submit)}
                </Button>
              </div>
            </Form>
          </div>
        );
    }
}

NewIdentity.propTypes = {
    ethAddressPending: PropTypes.bool,
    form: PropTypes.shape(),
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    loginPending: PropTypes.bool,
    profileCreateEthAddress: PropTypes.func.isRequired,
    showTerms: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        ethAddressPending: selectProfileFlag(state, 'ethAddressPending'),
        loggedEthAddress: selectLoggedEthAddress(state),
        loginPending: selectProfileFlag(state, 'loginPending')
    };
}

export default connect(
    mapStateToProps,
    {
        profileCreateEthAddress,
        showTerms
    }
)(injectIntl(Form.create()(NewIdentity)));
