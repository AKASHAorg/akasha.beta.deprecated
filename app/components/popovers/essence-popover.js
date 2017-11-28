import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, Popover, Progress, Tooltip } from 'antd';
import { ClaimableList, PieChart, ShiftForm } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileEssenceIterator } from '../../local-flux/actions/profile-actions';
import { selectBalance, selectLoggedEthAddress,
    selectPendingTransformEssence } from '../../local-flux/selectors';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { balanceToNumber, formatBalance } from '../../utils/number-formatter';

const COLLECT = 'collect';
const DEFAULT = 'default';
const FORGE = 'forge';

class EssencePopover extends Component {
    state = {
        page: DEFAULT,
        popoverVisible: false
    };
    firstTime = true;
    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onVisibleChange = (popoverVisible) => {
        if (popoverVisible && this.firstTime) {
            this.props.profileEssenceIterator();
            // this.firstTime = false;
        }

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

    onCollect = () => { this.setState({ page: COLLECT }); };

    onForge = () => { this.setState({ page: FORGE }); };

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
        const { balance, intl, pendingTransformEssence, essenceEvents } = this.props;
        const { page } = this.state;
        if (page === COLLECT) {
            return (
              <ClaimableList />
            );
        }

        if (page === FORGE) {
            return (
              <ShiftForm
                balance={balance}
                onCancel={this.onCancel}
                onShift={this.onShiftUpSubmit}
                pendingShift={pendingTransformEssence}
                type="transformEssence"
              />
            );
        }

        return (
          <div className="essence-popover__content">
            <div className="flex-center-x essence-popover__title">
              {intl.formatMessage(generalMessages.essence)}
              <span className="essence-popover__essence-score">
                {formatBalance(balance.getIn(['essence', 'total']))}
              </span>
            </div>
            <div className="essence-popover__logs">
                {
                    essenceEvents.map(ev => (<p key={ev.hashCode()}>{ev.action} {ev.amount}</p>))
                }
            </div>
            <div className="essence-popover__actions">
              <Button
                className="essence-popover__button"
                onClick={this.onCollect}
                size="large"
              >
                {intl.formatMessage(generalMessages.collect)}
              </Button>
              <Button
                className="essence-popover__button"
                onClick={this.onForge}
                size="large"
              >
                {intl.formatMessage(formMessages.forgeAeth)}
              </Button>
            </div>
          </div>
        );
    };

    render () {
        const { balance, intl } = this.props;
        const total = balanceToNumber(balance.getIn(['essence', 'total']));
        // 1000 Essence should be considered the first step because it unlocks creating tags
        const firstStep = 1000;
        const percent = (total / firstStep) * 100;
        const tooltip = (
          <div>
            <div>{intl.formatMessage(generalMessages.essence)}</div>
            <div>{total} / {firstStep}</div>
          </div>
        );

        return (
          <Popover
            content={this.renderContent()}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="essence-popover"
            placement="leftBottom"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <Tooltip title={tooltip}>
              <Progress
                className="essence-popover__progress"
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

EssencePopover.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    profileEssenceIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    pendingTransformEssence: PropTypes.bool,
    essenceEvents: PropTypes.shape().isRequired
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingTransformEssence: selectPendingTransformEssence(state),
        essenceEvents: state.profileState.get('essenceEvents')
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEssenceIterator
    }
)(Form.create()(injectIntl(EssencePopover)));
