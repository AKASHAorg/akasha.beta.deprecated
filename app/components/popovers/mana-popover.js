import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, Popover, Progress, Tooltip } from 'antd';
import { RadarChart, ShiftForm } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectBalance, selectLoggedEthAddress, selectPendingBondAeth,
    selectPendingCycleAeth } from '../../local-flux/selectors';
import { generalMessages } from '../../locale-data/messages';

const DEFAULT = 'default';
const SHIFT_DOWN = 'shiftDown';
const SHIFT_UP = 'shiftUp';

class ManaPopover extends Component {
    state = {
        page: DEFAULT,
        popoverVisible: false
    };

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onVisibleChange = (popoverVisible) => {
        this.setState({
            popoverVisible
        });

        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    page: DEFAULT
                });
            }, 100);
        }
    };

    onShiftDown = () => { this.setState({ page: SHIFT_DOWN }); };

    onShiftUp = () => { this.setState({ page: SHIFT_UP }); };

    onCancel = () => { this.setState({ page: DEFAULT }); };

    onShiftDownSubmit = (amount) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.cycleAeth, { amount });
    };

    onShiftUpSubmit = (amount) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.bondAeth, { amount });
    };

    renderContent = () => {
        const { balance, bondAethPending, cycleAethPending, intl } = this.props;
        const { page } = this.state;
        const manaColor = 'rgba(48,179,33, 0.3)';
        if (page === SHIFT_DOWN) {
            return (
              <ShiftForm
                balance={balance}
                onCancel={this.onCancel}
                onShift={this.onShiftDownSubmit}
                type="shiftDownMana"
              />
            );
        }

        if (page === SHIFT_UP) {
            return (
              <ShiftForm
                balance={balance}
                onCancel={this.onCancel}
                onShift={this.onShiftUpSubmit}
                type="shiftUpMana"
              />
            );
        }

        return (
          <div className="mana-popover__content">
            <div className="flex-center-x mana-popover__title">
              {intl.formatMessage(generalMessages.mana)}
              <span className="mana-popover__mana-score">
                {balance.getIn(['mana', 'remaining'])}
              </span>
            </div>
            <div>
              <RadarChart
                data={{
                    labels: ['Publishing', 'Upvotes', 'Downvotes', 'Comments', 'Other'],
                    datasets: [{
                        data: [20, 10, 5, 14, 2],
                        backgroundColor: manaColor,
                    }]
                }}
                options={{
                    legend: { display: false },
                    scale: {
                        gridLines: {
                            circular: true
                        },
                        ticks: {
                            display: false,
                            maxTicksLimit: 5
                        },
                    },
                    tooltips: {
                        displayColors: false
                    }
                }}
                width={240}
                height={240}
              />
            </div>
            <div className="mana-popover__actions">
              <Button
                className="mana-popover__button"
                disabled={cycleAethPending}
                onClick={this.onShiftDown}
                size="large"
              >
                <Icon type="arrow-down" />
                Shift down
              </Button>
              <Button
                className="mana-popover__button"
                disabled={bondAethPending}
                onClick={this.onShiftUp}
                size="large"
              >
                <Icon type="arrow-up" />
                Shift up
              </Button>
            </div>
          </div>
        );
    };

    render () {
        const { balance } = this.props;
        const remaining = Number(balance.getIn(['mana', 'remaining']));
        const total = Number(balance.getIn(['mana', 'total']));
        const percent = (remaining / total) * 100;

        return (
          <Popover
            content={this.renderContent()}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="mana-popover"
            placement="leftBottom"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <Tooltip title="Mana">
              <Progress
                className="mana-popover__progress"
                format={() => <Icon type="question-circle-o" />}
                percent={percent}
                strokeWidth={10}
                type="circle"
                width={32}
              />
            </Tooltip>
          </Popover>
        );
    }
}

ManaPopover.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    bondAethPending: PropTypes.bool,
    cycleAethPending: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        bondAethPending: selectPendingBondAeth(state),
        cycleAethPending: selectPendingCycleAeth(state),
        loggedEthAddress: selectLoggedEthAddress(state)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd
    }
)(Form.create()(injectIntl(ManaPopover)));
