import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, Popover, Slider } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { entryMessages, formMessages, generalMessages } from '../../locale-data/messages';

const FormItem = Form.Item;
const min = 1;
const max = 10;

class VotePopover extends Component {
    state = {
        popoverVisible: false
    };

    componentWillReceiveProps (nextProps) {
        const { votePending } = nextProps;
        if (!votePending && this.props.votePending) {
            this.setState({
                popoverVisible: false
            });
        }
    }

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    canVote = () => {
        const { entry, votePending, voteWeight } = this.props;
        return entry.get('active') && !votePending && !voteWeight;
    };

    onCancel = () => {
        this.onVisibleChange(false);
    };

    onSubmit = (ev) => {
        ev.preventDefault();
        const { form, onSubmit, type, voteCost } = this.props;
        const weight = form.getFieldValue('weight');
        const value = voteCost.get(weight.toString());
        onSubmit({ type, value, weight });
    };

    onVisibleChange = (popoverVisible) => {
        this.setState({
            popoverVisible: popoverVisible && this.canVote()
        });
        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.props.form.setFieldsValue({ weight: min });
            }, 100);
        }
    };

    validateWeight = (rule, value, callback) => {
        const { balance, intl, voteCost } = this.props;
        if (!Number.isInteger(value)) {
            callback(intl.formatMessage(formMessages.voteWeightIntegerError, { min, max }));
        }
        if (value < min || value > max) {
            callback(intl.formatMessage(formMessages.voteWeightRangeError, { min, max }));
            return;
        }
        if (!balance || balance <= voteCost.get(value.toString())) {
            callback(intl.formatMessage(formMessages.notEnoughFunds));
            return;
        }
        callback();
    };

    renderContent = () => {
        const { form, intl, type, votePending } = this.props;
        const { getFieldDecorator, getFieldError, getFieldValue } = form;
        const title = type === actionTypes.downvote ? entryMessages.downvote : entryMessages.upvote;

        if (!this.canVote()) {
            return null;
        }

        const weightError = getFieldError('weight');
        const extra = (
          <span className="vote-popover__extra">
            {intl.formatMessage(formMessages.voteWeightExtra, { min, max })}
          </span>
        );
        const weight = getFieldValue('weight');

        return (
          <Form className="vote-popover__content" hideRequiredMark onSubmit={this.onSubmit}>
            <div className="vote-popover__title">
              {intl.formatMessage(title)}
            </div>
            <FormItem
              className="vote-popover__form-item"
              colon={false}
              help={weightError ? weightError[0] : extra}
              validateStatus={weightError ? 'error' : ''}
            >
              <div className="flex-center">
                {getFieldDecorator('weight', {
                    initialValue: min,
                    rules: [{
                        required: true,
                        message: intl.formatMessage(formMessages.voteWeightRequired)
                    }, {
                        validator: this.validateWeight
                    }]
                })(
                  <Slider
                    className="vote-popover__slider"
                    min={min}
                    max={max}
                    tipFormatter={null}
                  />
                )}
                <div className="flex-center vote-popover__weight">
                  {weight}
                </div>
              </div>
            </FormItem>
            <div className="vote-popover__actions">
              <Button className="vote-popover__button" onClick={this.onCancel}>
                <span className="vote-popover__button-label">
                  {intl.formatMessage(generalMessages.cancel)}
                </span>
              </Button>
              <Button
                className="vote-popover__button"
                disabled={!!weightError || votePending}
                htmlType="submit"
                onClick={this.onSubmit}
                type="primary"
              >
                <span className="vote-popover__button-label">
                  {intl.formatMessage(generalMessages.vote)}
                </span>
              </Button>
            </div>
          </Form>
        );
    };

    render () {
        const { containerRef, type } = this.props;

        return (
          <Popover
            content={this.renderContent()}
            getPopupContainer={() => containerRef || document.body}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="vote-popover"
            placement="bottomLeft"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <Icon
              className={`${this.canVote() && 'content-link'} vote-popover__icon`}
              type={type === actionTypes.downvote ? 'down-circle-o' : 'up-circle-o'}
            />
          </Popover>
        );
    }
}

VotePopover.propTypes = {
    balance: PropTypes.string.isRequired,
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    onSubmit: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    voteCost: PropTypes.shape().isRequired,
    votePending: PropTypes.bool,
    voteWeight: PropTypes.number
};

export default Form.create()(injectIntl(VotePopover));
