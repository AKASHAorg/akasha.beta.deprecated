import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Form, Slider } from 'antd';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { balanceToNumber, formatBalance, removeTrailingZeros } from '../../utils/number-formatter';

const FormItem = Form.Item;

class ShiftForm extends Component {
    state = {
        amount: 0
    };

    componentWillReceiveProps (nextProps) {
        const { pendingShift } = nextProps;
        if (pendingShift && !this.props.pendingShift) {
            this.setState({ amount: 0 });
        }
    }

    getTitle = () => {
        const { intl, type } = this.props;
        switch (type) {
            case 'shiftDownMana':
                return intl.formatMessage(formMessages.shiftDownMana);
            case 'shiftUpMana':
                return intl.formatMessage(formMessages.shiftUpMana);
            case 'transformEssence':
                return intl.formatMessage(formMessages.forgeAeth);
            default:
                return '';
        }
    };

    getMaxAmount = () => {
        const { balance, type } = this.props;
        switch (type) {
            case 'shiftDownMana':
                return balanceToNumber(balance.getIn(['mana', 'total']));
            case 'shiftUpMana':
                return balanceToNumber(balance.getIn(['aeth', 'free']));
            case 'transformEssence':
                return balanceToNumber(balance.getIn(['essence', 'total']));
            default:
                return 0;
        }
    };

    getHelpMessage = () => {
        const { intl, type } = this.props;
        const { amount } = this.state;
        if (!amount && type !== 'transformEssence') {
            return '';
        }
        let value;
        switch (type) {
            case 'shiftDownMana':
                return intl.formatMessage(formMessages.shiftDownManaHelp, { value: amount });
            case 'shiftUpMana':
                return intl.formatMessage(formMessages.shiftUpManaHelp, { value: amount });
            case 'transformEssence':
                if (!amount || amount < 1000) {
                    return intl.formatMessage(formMessages.transformEssenceMin);
                }
                value = amount / 1000;
                return intl.formatMessage(formMessages.transformEssenceDisclaimer, { amount, value });
            default:
                return '';
        }
    };

    getSliderTitle = () => {
        const { intl, type } = this.props;
        switch (type) {
            case 'shiftDownMana':
            case 'shiftUpMana':
                return intl.formatMessage(formMessages.amountToShift);
            case 'transformEssence':
                return intl.formatMessage(formMessages.amountToForge);
            default:
                return '';
        }
    }

    onChange = (amount) => { this.setState({ amount }); };

    onShift = () => {
        const { onShift } = this.props;
        onShift(this.state.amount.toString());
    };

    render () {
        const { balance, intl, onCancel, pendingShift, type } = this.props;
        const { amount } = this.state;
        const max = this.getMaxAmount();
        const amountNotEnough = !amount || (type === 'transformEssence' && amount < 1000);

        return (
          <Form className="shift-form">
            <div className="flex-center-y shift-form__title">
              {this.getTitle()}
            </div>
            <div className="shift-form__total-balance">
              <div className="shift-form__balance-label">
                {intl.formatMessage(formMessages.totalAethBalance)}
              </div>
              <div className="shift-form__total-value">
                {removeTrailingZeros(balance.getIn(['aeth', 'total']))}
              </div>
            </div>
            <div className="shift-form__balances">
              <div>
                <div className="shift-form__balance-label">
                  {intl.formatMessage(generalMessages.transferable)}
                </div>
                <div className="shift-form__balance-value">
                  {removeTrailingZeros(balance.getIn(['aeth', 'free']))}
                </div>
              </div>
              <div>
                <div className="shift-form__balance-label">
                  {intl.formatMessage(generalMessages.manafied)}
                </div>
                <div className="shift-form__balance-value">
                  {formatBalance(balance.getIn(['aeth', 'bonded']))}
                </div>
              </div>
              <div>
                <div className="shift-form__balance-label">
                  {intl.formatMessage(generalMessages.cycling)}
                </div>
                <div className="shift-form__balance-value">
                  {formatBalance(balance.getIn(['aeth', 'cycling']))}
                </div>
              </div>
            </div>
            <div>
              {this.getSliderTitle()}
            </div>
            <FormItem
              colon={false}
              className="shift-form__slider-wrapper"
              help={this.getHelpMessage()}
            >
              <div className="flex-center">
                <Slider
                  min={0}
                  // if both min and max are 0, the slider will not work properly
                  max={max || 1}
                  onChange={max ? this.onChange : () => {}}
                  tipFormatter={null}
                  value={amount}
                  style={{ flex: '1 1 auto' }}
                />
                <div className="shift-form__amount">
                  {amount}
                </div>
              </div>
            </FormItem>
            <div className="shift-form__actions">
              <Button
                className="shift-form__button"
                onClick={onCancel}
              >
                {intl.formatMessage(generalMessages.cancel)}
              </Button>
              <Button
                className="shift-form__button"
                disabled={pendingShift || amountNotEnough}
                loading={pendingShift}
                onClick={this.onShift}
                type="primary"
              >
                {intl.formatMessage(generalMessages.submit)}
              </Button>
            </div>
          </Form>
        );
    }
}

ShiftForm.propTypes = {
    balance: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    onCancel: PropTypes.func.isRequired,
    onShift: PropTypes.func.isRequired,
    pendingShift: PropTypes.bool,
    type: PropTypes.string.isRequired,
};

export default injectIntl(ShiftForm);
