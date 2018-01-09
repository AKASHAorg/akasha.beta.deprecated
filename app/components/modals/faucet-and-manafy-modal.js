import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Modal, Button } from 'antd';
import { actionDelete, actionResetFundingRequirements,
    actionAdd } from '../../local-flux/actions/action-actions';
import { profileResetFaucet } from '../../local-flux/actions/profile-actions';
import { selectLoggedEthAddress } from '../../local-flux/selectors/index';
import { NoEth, NoMana } from '../';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';
import { generalMessages } from '../../locale-data/messages';

class FaucetAndManafyModal extends Component {
    _getModalContent = () => {
        const { needEth, needAeth, needMana } = this.props;
        if (needEth) {
            return <NoEth />;
        }
        if (needMana && needAeth) {
            return <NoEth />;
        }
        if (needMana && !needAeth && !needEth) {
            return <NoMana />;
        }
        return null;
    }

    _handleModalCancel = () => {
        const { pendingActions, faucetRequested } = this.props;
        if (faucetRequested === 'requested' || faucetRequested === 'success') {
            return null;
        }
        if (!faucetRequested) {
            pendingActions.filter(action => action.get('status') === actionStatus.needAuth)
                .forEach(action => this.props.actionDelete(action.get('id')));
            this.props.actionResetFundingRequirements();
        }
        return this.props.profileResetFaucet();
    }

    _handleModalOk = () => {
        const { needEth, needAeth, needMana, faucetRequested,
            loggedEthAddress, pendingActions } = this.props;
        if (needMana && needAeth) {
            if (!faucetRequested) {
                return this.props.actionAdd(loggedEthAddress, actionTypes.faucet);
            }
            if (faucetRequested === 'success') {
                this.props.actionResetFundingRequirements();
                return this.props.profileResetFaucet();
            }
        }
        if (needEth) {
            return this.props.actionAdd(loggedEthAddress, actionTypes.faucet);
        }
        if (needMana && !needAeth) {
            window.location.href = 'http://akasha.helpscoutdocs.com/article/21-how-to-manafy-aeth';
            pendingActions.filter(action => action.get('status') === actionStatus.needAuth)
                .forEach(action => this.props.actionDelete(action.get('id')));
            return this.props.actionResetFundingRequirements();
        }
        return null;
    }

    _getModalTitle = () => {
        const { needEth, needAeth, needMana } = this.props;
        if (needEth) {
            return <div>Request Test Ethers!</div>;
        }
        if (needMana && needAeth) {
            return <div>Request AKASHA Ethers!</div>;
        }
        if (needMana && !needAeth && !needEth) {
            return <div>Manafy AETH</div>;
        }
        return null;
    }
    render () {
        const { needAeth, needEth, needMana, faucetRequested, intl } = this.props;
        return (
          <div>
            <Modal
              visible
              title={this._getModalTitle()}
              onOk={this._handleModalOk}
              onCancel={this._handleModalCancel}
              footer={[
                <Button
                  key="back"
                  onClick={this._handleModalCancel}
                  disabled={faucetRequested}
                >
                  {intl.formatMessage(generalMessages.cancel)}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={this._handleModalOk}
                  loading={faucetRequested === 'requested'}
                >
                  {(faucetRequested === 'requested') && 'Waiting...'}
                  {(faucetRequested === 'success') && 'Done'}
                  {needEth && !faucetRequested && 'Request ETH'}
                  {(needAeth && needMana) && !needEth && !faucetRequested && 'Request AETH'}
                  {needMana && !needAeth && !needEth && !faucetRequested && intl.formatMessage(generalMessages.learnMore)}
                </Button>,
              ]}
            >
              {this._getModalContent()}
            </Modal>
          </div>
        );
    }
}
FaucetAndManafyModal.propTypes = {
    actionDelete: PropTypes.func,
    actionResetFundingRequirements: PropTypes.func,
    intl: PropTypes.shape(),
    loggedEthAddress: PropTypes.string,
    needEth: PropTypes.bool,
    needAeth: PropTypes.bool,
    needMana: PropTypes.bool,
    pendingActions: PropTypes.shape(),
    faucetRequested: PropTypes.string,
    actionAdd: PropTypes.func,
    profileResetFaucet: PropTypes.func,
};

function mapStateToProps (state) {
    return {
        loggedEthAddress: selectLoggedEthAddress(state),
        needEth: state.actionState.get('needEth'),
        needAeth: state.actionState.get('needAeth'),
        needMana: state.actionState.get('needMana'),
        pendingActions: state.actionState.get('byId'),
        faucetRequested: state.profileState.get('faucet'),
    };
}

export default connect(
    mapStateToProps,
    {
        actionDelete,
        actionResetFundingRequirements,
        actionAdd,
        profileResetFaucet,
    }
)(injectIntl(FaucetAndManafyModal));
