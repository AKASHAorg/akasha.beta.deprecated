import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Popover, Progress, Tooltip } from 'antd';
import { Icon, PieChart, ShiftForm } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { actionSelectors, profileSelectors } from '../../local-flux/selectors';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

const DEFAULT = 'default';
const SHIFT_DOWN = 'shiftDown';
const SHIFT_UP = 'shiftUp';

class ManaPopover extends Component {
    state = {
        page: DEFAULT,
        popoverVisible: false
    };
    wasVisible = false;

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onVisibleChange = popoverVisible => {
        this.wasVisible = true;
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

    onShiftDown = () => {
        this.setState({ page: SHIFT_DOWN });
    };

    onShiftUp = () => {
        this.setState({ page: SHIFT_UP });
    };

    onCancel = () => {
        this.setState({ page: DEFAULT });
    };

    onShiftDownSubmit = amount => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.cycleAeth, { amount });
    };

    onShiftUpSubmit = amount => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.bondAeth, { amount });
    };

    renderContent = () => {
        const { balance, intl, manaBurned, pendingBondAeth, pendingCycleAeth } = this.props;
        const { page } = this.state;
        const remainingMana = balanceToNumber(balance.getIn(['mana', 'remaining']));
        const totalMana = balanceToNumber(balance.getIn(['mana', 'total']));
        console.log(props.mana, 'the mana');
        if (page === SHIFT_DOWN) {
            return (
                <ShiftForm
                    balance={ balance }
                    onCancel={ this.onCancel }
                    onShift={ this.onShiftDownSubmit }
                    pendingShift={ !!pendingCycleAeth }
                    type="shiftDownMana"
                />
            );
        }

        if (page === SHIFT_UP) {
            return (
                <ShiftForm
                    balance={ balance }
                    onCancel={ this.onCancel }
                    onShift={ this.onShiftUpSubmit }
                    pendingShift={ pendingBondAeth }
                    type="shiftUpMana"
                />
            );
        }
        const comments = manaBurned.get('comments');
        const entries = manaBurned.get('entriesTotal');
        const votes = manaBurned.get('votes');
        let data;
        const noValues = comments === 0 && entries === 0 && votes === 0;
        if (noValues) {
            data = [1, 1, 1];
        } else {
            data = [comments, entries, votes];
        }
        const burnedMana = comments + entries + votes;
        return (
            <div className="mana-popover__content">
                <div className="flex-center mana-popover__title">
                    { intl.formatMessage(generalMessages.manaPool) }
                    <Tooltip placement="top"
                             title={ intl.formatMessage(generalMessages.manaBurned) }>
                        <span className="mana-popover__mana-score">{ burnedMana }</span>
                    </Tooltip>
                </div>
                <div className="flex-center mana-popover__chart-wrapper">
                    <PieChart
                        data={ {
                            labels: ['Comments', 'Entries', 'Votes'],
                            datasets: [
                                {
                                    data,
                                    backgroundColor: ['#1e7bf5', '#70a0ff', '#c7d4ff']
                                }
                            ]
                        } }
                        options={ {
                            legend: { display: false },
                            tooltips: {
                                displayColors: false,
                                enabled: !noValues
                            }
                        } }
                        width={ 240 }
                        height={ 240 }
                    />
                </div>
                <div className="mana-popover__actions">
                    <Button className="flex-center mana-popover__button"
                            onClick={ this.onShiftDown }>
                        <Icon type="arrowDown"/>
                        { intl.formatMessage(formMessages.shiftDown) }
                    </Button>
                    <Button className="flex-center mana-popover__button" onClick={ this.onShiftUp }>
                        <Icon type="arrowUp"/>
                        { intl.formatMessage(formMessages.shiftUp) }
                    </Button>
                </div>
            </div>
        );
    };

    render () {
        const { balance, intl } = this.props;
        const remaining = balanceToNumber(balance.getIn(['mana', 'remaining']));
        const total = balanceToNumber(balance.getIn(['mana', 'total']));
        const percent = total ? (remaining / total) * 100 : 0;
        const tooltip = (
            <div>
                <div>{ intl.formatMessage(generalMessages.mana) }</div>
                <div>
                    { remaining } / { total }
                </div>
            </div>
        );

        return (
            <Popover
                content={ this.wasVisible ? this.renderContent() : null }
                onVisibleChange={ this.onVisibleChange }
                overlayClassName="mana-popover"
                placement="leftBottom"
                trigger="click"
                visible={ this.state.popoverVisible }
            >
                <Tooltip placement="right" title={ tooltip } mouseEnterDelay={ 0.3 }>
                    <Progress
                        className="mana-popover__progress"
                        format={ () => <Icon type="mana"/> }
                        percent={ percent }
                        strokeWidth={ 10 }
                        type="circle"
                        width={ 35 }
                    />
                </Tooltip>
            </Popover>
        );
    }
}

ManaPopover.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    manaBurned: PropTypes.shape().isRequired,
    pendingBondAeth: PropTypes.bool,
    pendingCycleAeth: PropTypes.string
};

function mapStateToProps (state) {
    return {
        balance: profileSelectors.selectBalance(state),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        manaBurned: profileSelectors.selectBurnedMana(state),
        pendingBondAeth: actionSelectors.getPendingBondAeth(state),
        pendingCycleAeth: actionSelectors.getPendingCycleAeth(state)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd
    }
)(Form.create()(injectIntl(ManaPopover)));
