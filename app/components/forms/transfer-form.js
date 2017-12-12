import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Form, Input, InputNumber } from 'antd';
import { formMessages, generalMessages, profileMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

const FormItem = Form.Item;

class TransferForm extends Component {
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
        const { form, type, onSubmit } = this.props;
        const { amount, receiver } = form.getFieldsValue();
        let akashaId, ethAddress, tokenAmount, value; // eslint-disable-line
        if (receiver.length === 42 && receiver.toLowerCase().startsWith('0x')) {
            ethAddress = receiver;
        } else {
            akashaId = receiver;
        }
        if (type === 'eth') {
            value = amount.toString();
        } else {
            tokenAmount = amount.toString();
        }
        onSubmit({ akashaId, ethAddress, tokenAmount, value });
    };

    render () {
        const { ethAddress, balance, form, intl, onCancel, pendingTransfer, type } = this.props;
        const { getFieldDecorator, getFieldError } = form;
        const amountError = getFieldError('amount');
        const extra = type === 'eth' ?
            intl.formatMessage(formMessages.maxEthAmount, { eth: balance }) :
            intl.formatMessage(formMessages.maxAethAmount, { aeth: balance });

        return (
          <Form className="transfer-form" hideRequiredMark onSubmit={this.onSubmit}>
            <FormItem
              className="transfer-form__form-item"
              colon={false}
              label={intl.formatMessage(profileMessages.yourEthAddress)}
            >
              <Input
                className="transfer-form__input transfer-form__my-address"
                readOnly
                value={ethAddress}
              />
              <div className="transfer-form__copy-button" onClick={this.onCopy}>
                {intl.formatMessage(generalMessages.copy)}
              </div>
            </FormItem>
            <FormItem
              className="transfer-form__form-item"
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
                  className="transfer-form__input"
                  placeholder={intl.formatMessage(profileMessages.receiverPlaceholder)}
                />
              )}
            </FormItem>
            <FormItem
              className="transfer-form__form-item"
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
                  className="transfer-form__input"
                  min={0}
                  max={balanceToNumber(balance, 5)}
                  placeholder={intl.formatMessage(profileMessages.amountPlaceholder)}
                  step={0.01}
                />
              )}
            </FormItem>
            <div className="transfer-form__actions">
              <Button className="transfer-form__button" onClick={onCancel}>
                {intl.formatMessage(generalMessages.cancel)}
              </Button>
              <Button
                className="transfer-form__button"
                disabled={!!amountError || pendingTransfer}
                htmlType="submit"
                loading={pendingTransfer}
                onClick={this.onSubmit}
                type="primary"
              >
                {intl.formatMessage(generalMessages.send)}
              </Button>
            </div>
          </Form>
        );
    }
}

TransferForm.propTypes = {
    ethAddress: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pendingTransfer: PropTypes.bool,
    type: PropTypes.string.isRequired,
};

export default Form.create()(injectIntl(TransferForm));
