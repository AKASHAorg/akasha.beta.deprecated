import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Form, Slider } from 'antd';
import { formMessages, generalMessages } from '../../locale-data/messages';

const FormItem = Form.Item;

class ShiftForm extends Component {
    state = {
        value: 0
    };

    getTitle = () => {
        const { intl, type } = this.props;
        switch (type) {
            case 'shiftDownMana':
                return intl.formatMessage(formMessages.shiftDownMana);
            case 'shiftUpMana':
                return intl.formatMessage(formMessages.shiftUpMana);
            default:
                return '';
        }
    };

    getBalances = () => {
        const { balance, intl, type } = this.props;
        const leftBalance = {};
        const rightBalance = {};
        switch (type) {
            case 'shiftDownMana':
            case 'shiftUpMana':
                leftBalance.title = intl.formatMessage(formMessages.manaTotalScore);
                leftBalance.value = balance.getIn(['mana', 'total']);
                rightBalance.title = intl.formatMessage(formMessages.freeAeth);
                rightBalance.value = balance.getIn(['aeth', 'free']);
                break;
            default:
                break;
        }

        return { leftBalance, rightBalance };
    };

    getMaxAmount = () => {
        const { balance, type } = this.props;
        let value;
        switch (type) {
            case 'shiftDownMana':
                value = balance.getIn(['mana', 'total']).replace(',', '');
                return Number(value);
            case 'shiftUpMana':
                value = balance.getIn(['aeth', 'free']).replace(',', '');
                return Number(value);
            default:
                return 0;
        }
    };

    getHelpMessage = () => {
        const { intl, type } = this.props;
        const { value } = this.state;
        switch (type) {
            case 'shiftDownMana':
                return intl.formatMessage(formMessages.shiftDownManaHelp, { value });
            case 'shiftUpMana':
                return intl.formatMessage(formMessages.shiftUpManaHelp, { value });
            default:
                return '';
        }
    };

    onChange = (value) => { this.setState({ value }); };

    onShift = () => {
        const { onShift } = this.props;
        onShift(this.state.value.toString());
    };

    render () {
        const { intl, onCancel } = this.props;
        const { value } = this.state;
        const { leftBalance, rightBalance } = this.getBalances();

        return (
          <Form className="shift-form">
            <div className="shift-form__title">
              {this.getTitle()}
            </div>
            <div className="shift-form__balances">
              <div>
                <div className="shift-form__balance-label">
                  {leftBalance.title}
                </div>
                <div className="shift-form__balance-value">
                  {leftBalance.value}
                </div>
              </div>
              <div>
                <div className="shift-form__balance-label">
                  {rightBalance.title}
                </div>
                <div className="shift-form__balance-value">
                  {rightBalance.value}
                </div>
              </div>
            </div>
            <div>
              {intl.formatMessage(formMessages.amountToShift)}
            </div>
            <FormItem
              colon={false}
              help={<span className="shift-form__helper">{this.getHelpMessage()}</span>}
            >
              <div className="flex-center">
                <Slider
                  min={0}
                  max={this.getMaxAmount()}
                  onChange={this.onChange}
                  tipFormatter={null}
                  value={value}
                  style={{ flex: '1 1 auto' }}
                />
                <div style={{ flex: '0 0 auto', width: '36px', textAlign: 'right' }}>
                  {value}
                </div>
              </div>
            </FormItem>
            <div className="shift-form__actions">
              <Button
                className="shift-form__button"
                onClick={onCancel}
                size="large"
              >
                {intl.formatMessage(generalMessages.cancel)}
              </Button>
              <Button
                className="shift-form__button"
                onClick={this.onShift}
                size="large"
                type="primary"
              >
                {intl.formatMessage(generalMessages.shift)}
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
    type: PropTypes.string.isRequired,
};

export default injectIntl(ShiftForm);
