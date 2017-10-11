import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Form, Input, InputNumber } from 'antd';
import { formMessages, generalMessages, profileMessages } from '../../locale-data/messages';
import { formatBalance } from '../../utils/number-formatter';

const FormItem = Form.Item;

class SendTipForm extends Component {
    handleKeyDown = (ev) => {
        const { onCancel } = this.props;
        if (ev.key === 'Escape') {
            onCancel();
        }
    };

    onSubmit = (ev) => {
        ev.preventDefault();
        const { form, onSubmit } = this.props;
        const { amount, message } = form.getFieldsValue();
        onSubmit({ message, value: amount.toString() });
    };

    render () {
        const { balance, form, intl, name, onCancel, tipPending } = this.props;
        const { getFieldDecorator, getFieldError } = form;
        const amountError = getFieldError('amount');
        const maxAmount = Number(formatBalance((balance - 0.1).toString(), 7));
        const extra = (
          <span className="send-tip-form__extra">
            {intl.formatMessage(formMessages.maxAethAmountLabel, {
                balance: maxAmount
            })}
          </span>
        );

        return (
          <Form className="send-tip-form" hideRequiredMark onSubmit={this.onSubmit}>
            <div className="overflow-ellipsis send-tip-form__title">
              {intl.formatMessage(profileMessages.sendTipTo, { name })}
            </div>
            <FormItem
              className="send-tip-form__form-item"
              colon={false}
              help={amountError || extra}
              label={
                <span className="uppercase">
                  {intl.formatMessage(formMessages.aethAmountLabel)}
                </span>
              }
              validateStatus={amountError ? 'error' : ''}
            >
              {getFieldDecorator('amount', {
                  initialValue: 0.001,
                  rules: [{
                      required: true,
                      message: intl.formatMessage(formMessages.aethAmountRequired)
                  }],
              })(
                <InputNumber
                  autoFocus
                  className="send-tip-form__amount"
                  min={0.001}
                  max={maxAmount}
                  onKeyDown={this.handleKeyDown}
                  placeholder={intl.formatMessage(profileMessages.tipAmount)}
                  step={0.001}
                />
              )}
            </FormItem>
            <FormItem
              className="send-tip-form__form-item"
              colon={false}
              label={
                <span className="uppercase">
                  {intl.formatMessage(formMessages.messageOptional)}
                </span>
              }
            >
              {getFieldDecorator('message', {})(
                <Input
                  className="send-tip-form__message"
                  onKeyDown={this.handleKeyDown}
                  placeholder="Write something here"
                />
              )}
            </FormItem>
            <div className="send-tip-form__actions">
              <Button className="send-tip-form__button" onClick={onCancel}>
                <span className="send-tip-form__button-label">
                  {intl.formatMessage(generalMessages.cancel)}
                </span>
              </Button>
              <Button
                className="send-tip-form__button"
                disabled={!!amountError || tipPending}
                htmlType="submit"
                onClick={this.onSubmit}
                type="primary"
              >
                <span className="send-tip-form__button-label">
                  {intl.formatMessage(generalMessages.send)}
                </span>
              </Button>
            </div>
          </Form>
        );
    }
}

SendTipForm.propTypes = {
    balance: PropTypes.string,
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    name: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    tipPending: PropTypes.bool
};

export default Form.create()(injectIntl(SendTipForm));
