import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Popover, Progress, Tooltip } from 'antd';
import { ClaimableList, EssenceHistory, Icon, ShiftForm } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { claimableGetEntries } from '../../local-flux/actions/claimable-actions';
import { profileEssenceIterator, profileGetBalance,
    profileResetEssenceEvents } from '../../local-flux/actions/profile-actions';
import { selectBalance, selectLoggedEthAddress,
    getPendingEssenceTransform } from '../../local-flux/selectors';
import { generalMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

const COLLECT = 'collect';
const HISTORY = 'history';
const FORGE = 'forge';

class EssencePopover extends Component {
    state = {
        page: COLLECT,
        popoverVisible: false
    };
    wasVisible = false;

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onVisibleChange = (popoverVisible) => {
        if (popoverVisible) {
            this.props.claimableGetEntries();
        }
        this.wasVisible = true;

        this.setState({
            popoverVisible
        });
        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    page: COLLECT
                });
            }, 100);
        }
    };

    onHistory = () => { this.setState({ page: HISTORY }); };

    onForge = () => { this.setState({ page: FORGE }); };

    onCancel = () => { this.setState({ page: COLLECT }); };

    onShiftDownSubmit = (amount) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.cycleAeth, { amount });
    };

    onShiftUpSubmit = (amount) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.transformEssence, { amount });
    };

    renderContent = () => {
        const { balance, pendingTransformEssence } = this.props;
        const { page } = this.state;
        if (page === COLLECT) {
            return (
              <ClaimableList
                onForge={this.onForge}
                onHistory={this.onHistory}
              />
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
          <EssenceHistory onBack={this.onCancel} />
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
            <div>{total}</div>
          </div>
        );

        return (
          <Popover
            content={this.wasVisible ? this.renderContent() : null}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="essence-popover"
            placement="leftBottom"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <Tooltip placement="topLeft" title={tooltip} mouseEnterDelay={0.3}>
              <Progress
                className="essence-popover__progress"
                format={() => <Icon className="essence-popover__icon" type="essence" />}
                percent={percent}
                strokeWidth={10}
                type="circle"
                width={35}
              />
            </Tooltip>
          </Popover>
        );
    }
}

EssencePopover.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    claimableGetEntries: PropTypes.func.isRequired,    
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    pendingTransformEssence: PropTypes.bool,
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingTransformEssence: getPendingEssenceTransform(state),
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        claimableGetEntries,
        profileEssenceIterator,
        profileGetBalance,
        profileResetEssenceEvents
    }
)(Form.create()(injectIntl(EssencePopover)));
