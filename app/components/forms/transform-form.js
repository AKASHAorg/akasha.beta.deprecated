import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Form, InputNumber, Select, Slider } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

const FormItem = Form.Item;
const { Option } = Select;
const options = {
    cycling: 'cycling',
    essence: 'essence',
    manafied: 'manafied',
    transferable: 'transferable'
};

class TransformForm extends Component {
    state = {
        amount: 0,
        from: options.transferable,
        to: options.manafied
    };

    componentWillReceiveProps (nextProps) {
        const { pendingBondAeth, pendingCycleAeth, pendingTransformEssence } = nextProps;
        const bondAethChanged = pendingBondAeth && !this.props.pendingBondAeth;
        const cycleAethChanged = pendingCycleAeth && !this.props.pendingCycleAeth;
        const transformEssenceChanged = pendingTransformEssence && !this.props.pendingTransformEssence;
        if (bondAethChanged || cycleAethChanged || transformEssenceChanged) {
            this.setState({
                amount: 0
            });
        }
    }

    isPending = () => {
        const { pendingBondAeth, pendingCycleAeth, pendingTransformEssence } = this.props;
        const { from } = this.state;
        switch (from) {
            case options.essence:
                return pendingTransformEssence;
            case options.manafied:
                return pendingCycleAeth;
            case options.transferable:
                return pendingBondAeth;
            default:
                return true;
        }
    };

    getFromMatch = (from) => {
        switch (from) {
            case options.essence:
                return options.transferable;
            case options.manafied:
                return options.cycling;
            case options.transferable:
                return options.manafied;
            default:
                console.error('cannot find a match for', from);
                return null;
        }
    };

    getToMatch = (to) => {
        switch (to) {
            case options.cycling:
                return options.manafied;
            case options.manafied:
                return options.transferable;
            case options.transferable:
                return options.essence;
            default:
                console.error('cannot find a match for', to);
                return null;
        }
    };

    getSliderHelp = (max) => {
        const { intl } = this.props;
        const { from } = this.state;
        switch (from) {
            case options.essence:
                return intl.formatMessage(formMessages.maxEssenceAmount, { essence: max });
            case options.manafied:
                return intl.formatMessage(formMessages.maxManafiedAethAmount, { manafied: max });
            case options.transferable:
                return intl.formatMessage(formMessages.maxAethAmount, { aeth: max });
            default:
                return '';
        }
    };

    getSliderMax = () => {
        const { balance } = this.props;
        const { from } = this.state;
        switch (from) {
            case options.essence:
                return balanceToNumber(balance.getIn(['essence', 'total']));
            case options.manafied:
                return balanceToNumber(balance.getIn(['aeth', 'bonded']));
            case options.transferable:
                return balanceToNumber(balance.getIn(['aeth', 'free']));
            default:
                return 0;
        }
    };

    onChangeFrom = (from) => {
        const to = this.getFromMatch(from);
        this.setState({ amount: 0, from, to });
    };

    onChangeTo = (to) => {
        const from = this.getToMatch(to);
        this.setState({ amount: 0, from, to });
    };

    onAmountChange = (amount) => {
        if (!isNaN(amount)) {
            this.setState({ amount });
        }
    };

    onSubmit = () => {
        const { actionAdd, loggedEthAddress } = this.props;
        const { amount, from } = this.state;
        const payload = { amount: amount.toString() };
        let actionType;
        switch (from) {
            case options.essence:
                actionType = actionTypes.transformEssence;
                break;
            case options.manafied:
                actionType = actionTypes.cycleAeth;
                break;
            case options.transferable:
                actionType = actionTypes.bondAeth;
                break;
            default:
                break;
        }
        actionAdd(loggedEthAddress, actionType, payload);
    };

    renderDisclaimer = () => {
        const { intl } = this.props;
        const { amount, from } = this.state;
        let value;
        if (!amount && from !== options.essence) {
            return '';
        }
        switch (from) {
            case options.essence:
                if (!amount || amount < 1000) {
                    return intl.formatMessage(formMessages.transformEssenceMin);
                }
                value = amount / 1000;
                return intl.formatMessage(formMessages.transformEssenceDisclaimer, { amount, value });
            case options.manafied:
                return intl.formatMessage(formMessages.transformManafiedDisclaimer, { amount });
            case options.transferable:
                return intl.formatMessage(formMessages.transformTransferableDisclaimer, { amount });
            default:
                return '';
        }
    }

    render () {
        const { intl, onCancel } = this.props;
        const { amount, from, to } = this.state;
        const max = this.getSliderMax();
        const isPending = this.isPending();
        const amountNotEnough = !amount || (from === options.essence && amount < 1000);

        return (
          <Form className="transform-form" hideRequiredMark>
            <div className="transform-form__select-wrapper">
              <FormItem
                className="transform-form__select-item"
                colon={false}
                label={intl.formatMessage(formMessages.from)}
              >
                <Select onChange={this.onChangeFrom} value={from}>
                  <Option value={options.essence}>
                    {intl.formatMessage(generalMessages[options.essence])}
                  </Option>
                  <Option value={options.manafied}>
                    {intl.formatMessage(generalMessages[options.manafied])}
                  </Option>
                  <Option value={options.transferable}>
                    {intl.formatMessage(generalMessages[options.transferable])}
                  </Option>
                </Select>
              </FormItem>
              <FormItem
                className="transform-form__select-item"
                colon={false}
                label={intl.formatMessage(formMessages.to)}
              >
                <Select onChange={this.onChangeTo} value={to}>
                  <Option value={options.cycling}>
                    {intl.formatMessage(generalMessages[options.cycling])}
                  </Option>
                  <Option value={options.manafied}>
                    {intl.formatMessage(generalMessages[options.manafied])}
                  </Option>
                  <Option value={options.transferable}>
                    {intl.formatMessage(generalMessages[options.transferable])}
                  </Option>
                </Select>
              </FormItem>
            </div>
            <FormItem colon={false} help={this.getSliderHelp(max)}>
              <div className="flex-center">
                <Slider
                  className="transform-form__slider"
                  min={0}
                  // if both min and max are 0, the slider will not work properly
                  max={max || 1}
                  onChange={max ? this.onAmountChange : () => {}}
                  tipFormatter={null}
                  value={amount}
                />
                <InputNumber
                  className="transform-form__slider-amount"
                  disabled={!max}
                  min={0}
                  max={max}
                  maxLength={12}
                  onChange={this.onAmountChange}
                  precision={0}
                  size="small"
                  step={1}
                  value={amount}
                />
              </div>
            </FormItem>
            <div className="transform-form__disclaimer">
              {this.renderDisclaimer()}
            </div>
            <div className="transform-form__actions">
              <Button className="transfer-form__button" onClick={onCancel}>
                {intl.formatMessage(generalMessages.cancel)}
              </Button>
              <Button
                className="transfer-form__button"
                disabled={isPending || amountNotEnough}
                htmlType="submit"
                loading={isPending}
                onClick={this.onSubmit}
                type="primary"
              >
                {intl.formatMessage(generalMessages.transform)}
              </Button>
            </div>
          </Form>
        );
    }
}

TransformForm.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
    pendingBondAeth: PropTypes.bool,
    pendingCycleAeth: PropTypes.bool,
    pendingTransformEssence: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
};

export default injectIntl(TransformForm);
