import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Form, Input, InputNumber } from 'antd';
import { formMessages, generalMessages, profileMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

const FormItem = Form.Item;

class TransferEthForm extends Component {
    state = {

    };

    onCopy = () => {
        const { ethAddress } = this.props;
        const textArea = document.createElement('textarea');
        textArea.value = ethAddress;
        textArea.style.position = 'fixed';
        textArea.style.top = -99999;
        textArea.style.left = -99999;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    };

    onSubmit = (ev) => {
        ev.preventDefault();
        const { form, onSubmit } = this.props;
        const { amount, receiver } = form.getFieldsValue();
        if (receiver.length === 42 && receiver.toLowerCase().startsWith('0x')) {
            onSubmit({ ethAddress: receiver, value: amount.toString() });
            return;
        }
        onSubmit({ akashaId: receiver, value: amount.toString() });
    };

    render () {
        const { ethAddress, ethBalance, form, intl, onCancel } = this.props;
        const { getFieldDecorator, getFieldError } = form;
        const amountError = getFieldError('amount');
        const extra = intl.formatMessage(formMessages.maxEthAmount, { eth: ethBalance });

        return (
          <Form className="transfer-eth-form" hideRequiredMark onSubmit={this.onSubmit}>
            <FormItem
              className="transfer-eth-form__form-item"
              colon={false}
              label={intl.formatMessage(profileMessages.yourEthAddress)}
            >
              <Input
                className="transfer-eth-form__input transfer-eth-form__my-address"
                readOnly
                value={ethAddress}
              />
              <div className="content-link transfer-eth-form__copy-button" onClick={this.onCopy}>
                {intl.formatMessage(generalMessages.copy)}
              </div>
            </FormItem>
            <FormItem
              className="transfer-eth-form__form-item"
              colon={false}
              label={intl.formatMessage(profileMessages.sendTo)}
            >
              {getFieldDecorator('receiver', {
                  rules: [{
                      required: true,
                      message: intl.formatMessage(formMessages.addressRequired)
                  }]
              })(
                <Input
                  className="transfer-eth-form__input"
                  placeholder={intl.formatMessage(profileMessages.receiverPlaceholder)}
                />
              )}
            </FormItem>
            <FormItem
              className="transfer-eth-form__form-item"
              colon={false}
              help={amountError || extra}
              label={intl.formatMessage(generalMessages.amount)}
              validateStatus={amountError ? 'error' : ''}
            >
              {getFieldDecorator('amount', {
                  rules: [{
                      required: true,
                      message: intl.formatMessage(formMessages.amountRequired)
                  }]
              })(
                <InputNumber
                  className="transfer-eth-form__input"
                  max={balanceToNumber(ethBalance, 5)}
                  placeholder={intl.formatMessage(profileMessages.amountPlaceholder)}
                  step={0.01}
                />
              )}
            </FormItem>
            <div className="transfer-eth-form__actions">
              <Button className="transfer-eth-form__button" onClick={onCancel} size="large">
                {intl.formatMessage(generalMessages.cancel)}
              </Button>
              <Button
                className="transfer-eth-form__button"
                disabled={!!amountError}
                htmlType="submit"
                onClick={this.onSubmit}
                size="large"
                type="primary"
              >
                {intl.formatMessage(generalMessages.send)}
              </Button>
            </div>
          </Form>
        );
    }
}

TransferEthForm.propTypes = {
    ethAddress: PropTypes.string.isRequired,
    ethBalance: PropTypes.string.isRequired,
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default Form.create()(injectIntl(TransferEthForm));
