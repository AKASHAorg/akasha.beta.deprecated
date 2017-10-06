import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Form, Slider } from 'antd';

const FormItem = Form.Item;

class ShiftDownForm extends Component {
    state = {
        mana: 0
    };

    onManaChange = (value) => { this.setState({ mana: value }); };

    render () {
        const { balance, onCancel, onShift } = this.props;
        const { mana } = this.state;
        const message = (
          <span style={{ fontSize: '13px', lineHeight: 1 }}>{mana} AETH will be unlocked in 2 days</span>
        );

        return (
          <Form className="shift-down-form">
            <div className="shift-down-form__title">
              Shift down mana
            </div>
            <div className="shift-down-form__balances">
              <div>
                <div className="shift-down-form__balance-label">
                  Mana total score
                </div>
                <div className="shift-down-form__balance-value">
                  {balance.getIn(['mana', 'total'])}
                </div>
              </div>
              <div>
                <div className="shift-down-form__balance-label">
                  Free AETH
                </div>
                <div className="shift-down-form__balance-value">
                  {balance.getIn(['aeth', 'free'])}
                </div>
              </div>
            </div>
            <div>
              Please select an amount to shift
            </div>
            <FormItem
              colon={false}
              help={message}
            >
              <div className="flex-center">
                <Slider
                  className=""
                  min={0}
                  max={100}
                  // max={Number(balance.getIn(['mana', 'total']))}
                  onChange={this.onManaChange}
                  tipFormatter={null}
                  value={mana}
                  style={{ flex: '1 1 auto' }}
                />
                <div style={{ flex: '0 0 auto', width: '36px', textAlign: 'right' }}>
                  {mana}
                </div>
              </div>
            </FormItem>
            <div className="shift-down-form__actions">
              <Button
                className="shift-down-form__button"
                onClick={onCancel}
                size="large"
              >
                Cancel
              </Button>
              <Button
                className="shift-down-form__button"
                onClick={onShift}
                size="large"
                type="primary"
              >
                Shift
              </Button>
            </div>
          </Form>
        );
    }
}

ShiftDownForm.propTypes = {
    balance: PropTypes.shape(),
    onCancel: PropTypes.func.isRequired,
    onShift: PropTypes.func
};

export default ShiftDownForm;
