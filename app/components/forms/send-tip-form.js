import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, InputNumber } from 'antd';
import classNames from 'classnames';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { formMessages, generalMessages, profileMessages } from '../../locale-data/messages';
import { actionSelectors, profileSelectors } from '../../local-flux/selectors';
import { balanceToNumber } from '../../utils/number-formatter';
import * as actionTypes from '../../constants/action-types';

const FormItem = Form.Item;

class SendTipForm extends Component {
    handleKeyDown = (ev) => {
        const { onCancel } = this.props;
        if (ev.key === 'Escape') {
            onCancel();
        }
    };

    sendTip = ({ value, message, tokenAmount }) => {
        const { loggedEthAddress, profile } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.sendTip, {
            akashaId: profile.akashaId,
            ethAddress: profile.ethAddress,
            firstName: profile.firstName,
            lastName: profile.lastName,
            message,
            value,
            tokenAmount
        });
    };

    onSubmit = (ev) => {
        ev.preventDefault();
        const { form } = this.props;
        const { aethAmount, ethAmount, message } = form.getFieldsValue();
        const value = ethAmount ? ethAmount.toString() : undefined;
        const tokenAmount = aethAmount ? aethAmount.toString() : undefined;
        this.sendTip({ message, value, tokenAmount });
    };

    render () {
        const { balance, className, form, intl, onCancel, tipPending } = this.props;
        const ethBalance = balance.get('eth');
        const aethBalance = balance.getIn(['aeth', 'free']);
        const { getFieldDecorator, getFieldError } = form;
        const amountError = getFieldError('amount');
        const { aethAmount, ethAmount } = form.getFieldsValue();
        const emptyFields = !aethAmount && !ethAmount;
        const maxEthAmount = balanceToNumber((ethBalance - 0.1).toString(), 7);
        const maxAethAmount = balanceToNumber((aethBalance), 7);
        const rootClass = classNames('send-tip-form', className);
        const extraEth = (
          <span className="send-tip-form__extra">
            {intl.formatMessage(formMessages.maxAethAmountLabel, {
                balance: maxEthAmount
            })}
          </span>
        );
        const extraAeth = (
          <span className="send-tip-form__extra">
            {intl.formatMessage(formMessages.maxAethAmountLabel, {
                balance: maxAethAmount
            })}
          </span>
        );

        return (
          <Form className={rootClass} hideRequiredMark onSubmit={this.onSubmit}>
            <div className="overflow-ellipsis send-tip-form__title">
              {intl.formatMessage(profileMessages.sendTip)}
            </div>
            <FormItem
              className="send-tip-form__form-item"
              colon={false}
              help={amountError || extraEth}
              label={
                <span className="uppercase">
                  {intl.formatMessage(formMessages.ethAmountLabel)}
                </span>
              }
              validateStatus={amountError ? 'error' : ''}
            >
              {getFieldDecorator('ethAmount', {
                  initialValue: 0,
                  rules: [{
                      required: true,
                      message: intl.formatMessage(formMessages.amountRequired)
                  }],
              })(
                <InputNumber
                  autoFocus
                  className="send-tip-form__amount"
                  min={0}
                  max={maxEthAmount}
                  onKeyDown={this.handleKeyDown}
                  placeholder={intl.formatMessage(profileMessages.tipAmount)}
                  step={0.001}
                  maxLength={22}
                />
              )}
            </FormItem>
            <FormItem
              className="send-tip-form__form-item"
              colon={false}
              help={amountError || extraAeth}
              label={
                <span className="uppercase">
                  {intl.formatMessage(formMessages.aethAmountLabel)}
                </span>
              }
              validateStatus={amountError ? 'error' : ''}
            >
              {getFieldDecorator('aethAmount', {
                  initialValue: 0,
                  rules: [{
                    required: true,
                    message: intl.formatMessage(formMessages.amountRequired)
                }],
              })(
                <InputNumber
                  className="send-tip-form__amount"
                  min={0}
                  max={maxAethAmount}
                  onKeyDown={this.handleKeyDown}
                  placeholder={intl.formatMessage(profileMessages.tipAmount)}
                  step={0.01}
                  maxLength={22}
                />
              )}
            </FormItem>
            {/* <FormItem
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
            </FormItem> */}
            <div className="send-tip-form__actions">
              {onCancel &&
                <Button className="send-tip-form__button" onClick={onCancel}>
                  <span className="send-tip-form__button-label">
                    {intl.formatMessage(generalMessages.cancel)}
                  </span>
                </Button>
              }
              <Button
                className="send-tip-form__button"
                disabled={!!amountError || tipPending || emptyFields}
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
    actionAdd: PropTypes.func,
    balance: PropTypes.shape(),
    className: PropTypes.string,
    loggedEthAddress: PropTypes.string,
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    onCancel: PropTypes.func,
    profile: PropTypes.shape(),
    tipPending: PropTypes.bool
};

function mapStateToProps (state, ownProps) {
    const { profile } = ownProps;
    return {
        balance: profileSelectors.selectBalance(state),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        tipPending: actionSelectors.getTipIsPending(state, profile.ethAddress)
    };
}

export default Form.create()(connect(
    mapStateToProps,
    {
        actionAdd
    }
)(injectIntl(SendTipForm)));
