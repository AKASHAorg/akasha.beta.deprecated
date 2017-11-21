import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, Popover, Slider, Tooltip } from 'antd';
import classNames from 'classnames';
import { selectManaBalance, selectVoteCost } from '../../local-flux/selectors';
import { entryMessages, formMessages, generalMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

const FormItem = Form.Item;
const MIN = 1;
const MAX = 10;

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
        const { disabled, isOwnEntity, votePending, vote } = this.props;
        return !disabled && !isOwnEntity && !votePending && vote === '0';
    };

    isDownVote = () => this.props.type.includes('Downvote');

    getTooltip = () => {
        const { intl, isOwnEntity, type, votePending, vote } = this.props;
        if (votePending) {
            return intl.formatMessage(entryMessages.votePending);
        } else if (vote && vote !== '0') {
            const weight = Math.abs(Number(vote));
            return vote > '0' ?
                intl.formatMessage(entryMessages.alreadyUpvoted, { weight }) :
                intl.formatMessage(entryMessages.alreadyDownvoted, { weight });
        } else if (isOwnEntity) {
            return type.includes('entry') ?
                intl.formatMessage(entryMessages.votingOwnEntry) :
                intl.formatMessage(entryMessages.votingOwnComment);
        } else if (this.isDownVote()) {
            return intl.formatMessage(entryMessages.downvote);
        } else if (type.includes('Upvote')) {
            return intl.formatMessage(entryMessages.upvote);
        }
        return null;
    }

    onCancel = () => {
        this.onVisibleChange(false);
    };

    onSubmit = (ev) => {
        ev.preventDefault();
        const { form, onSubmit, type } = this.props;
        const weight = form.getFieldValue('weight');
        onSubmit({ type, weight });
    };

    onVisibleChange = (popoverVisible) => {
        this.setState({
            popoverVisible: popoverVisible && this.canVote()
        });
        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.props.form.setFieldsValue({ weight: MIN });
            }, 100);
        }
    };

    validateWeight = (rule, value, callback) => {
        const { intl, mana, voteCost } = this.props;
        if (!Number.isInteger(value)) {
            callback(intl.formatMessage(formMessages.voteWeightIntegerError, { min: MIN, max: MAX }));
        }
        if (value < MIN || value > MAX) {
            callback(intl.formatMessage(formMessages.voteWeightRangeError, { min: MIN, max: MAX }));
            return;
        }
        const formatted = balanceToNumber(mana);
        if (!formatted || formatted <= Number(voteCost.get(value.toString()))) {
            callback(intl.formatMessage(formMessages.notEnoughFunds));
            return;
        }
        callback();
    };

    renderContent = () => {
        const { form, intl, votePending } = this.props;
        const { getFieldDecorator, getFieldError, getFieldValue } = form;
        const title = this.isDownVote() ? entryMessages.downvote : entryMessages.upvote;

        if (!this.canVote()) {
            return null;
        }

        const weightError = getFieldError('weight');
        const extra = (
          <span className="vote-popover__extra">
            {intl.formatMessage(formMessages.voteWeightExtra, { min: MIN, max: MAX })}
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
                    initialValue: MIN,
                    rules: [{
                        required: true,
                        message: intl.formatMessage(formMessages.voteWeightRequired)
                    }, {
                        validator: this.validateWeight
                    }]
                })(
                  <Slider
                    className="vote-popover__slider"
                    min={MIN}
                    max={MAX}
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
        const { containerRef, iconClassName, vote } = this.props;

        const iconClass = classNames(iconClassName, {
            'content-link': this.canVote(),
            'vote-popover__icon_disabled': !this.canVote(),
            'vote-popover__icon_downvoted': this.isDownVote() && vote < '0',
            'vote-popover__icon_upvoted': !this.isDownVote() && vote > '0',
        });

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
            <Tooltip title={this.getTooltip()}>
              <Icon
                className={iconClass}
                type={this.isDownVote() ? 'arrow-down' : 'arrow-up'}
              />
            </Tooltip>
          </Popover>
        );
    }
}

VotePopover.propTypes = {
    containerRef: PropTypes.shape(),
    disabled: PropTypes.bool,
    form: PropTypes.shape().isRequired,
    iconClassName: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    isOwnEntity: PropTypes.bool,
    mana: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    voteCost: PropTypes.shape().isRequired,
    votePending: PropTypes.bool,
    vote: PropTypes.string
};

function mapStateToProps (state) {
    return {
        mana: selectManaBalance(state),
        voteCost: selectVoteCost(state)
    };
}

export default connect(mapStateToProps)(Form.create()(injectIntl(VotePopover)));
