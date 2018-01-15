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
    _deleteNeedAuthActions = () =>
        this.props.pendingActions.filter(action => action.get('status') === actionStatus.needAuth)
            .forEach(action => this.props.actionDelete(action.get('id')));

    _handleModalCancel = () => {
        const { faucetRequested } = this.props;
        if (faucetRequested === 'requested' || faucetRequested === 'success') {
            this._deleteNeedAuthActions();
            return this.props.actionResetFundingRequirements();
        }
        if (!faucetRequested) {
            this._deleteNeedAuthActions();
            this.props.actionResetFundingRequirements();
        }
        return this.props.profileResetFaucet();
    }

    _handleModalOk = () => {
        const { needEth, needAeth, needMana, faucetRequested, faucetPending,
            loggedEthAddress } = this.props;
        if ((needMana && needAeth) || needEth) {
            if (!faucetPending && !faucetRequested) {
                return this.props.actionAdd(loggedEthAddress, actionTypes.faucet, { withNotification: true });
            }
            if (faucetRequested === 'success') {
                this.props.actionResetFundingRequirements();
            }
        } else if (needMana && !needAeth) {
            window.location.href = 'http://akasha.helpscoutdocs.com/article/21-how-to-manafy-aeth';
            this.props.actionResetFundingRequirements();
        }
        this._deleteNeedAuthActions();
    }

    _getModalTitle = () => {
        const { needEth, needAeth, needMana, intl } = this.props;
        if (needEth) {
            return <div>{intl.formatMessage(generalMessages.requestTestEthersTitle)}</div>;
        }
        if (needMana && needAeth) {
            return <div>{intl.formatMessage(generalMessages.requestTestAEthersTitle)}</div>;
        }
        if (needMana && !needAeth && !needEth) {
            return <div>{intl.formatMessage(generalMessages.transformAethers)}</div>;
        }
        return null;
    }
    render () {
        const { needAeth, needEth, needMana, faucetRequested, faucetPending, intl } = this.props;
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
                >
                  {intl.formatMessage(generalMessages.cancel)}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={this._handleModalOk}
                  loading={faucetPending}
                >
                  {faucetPending && intl.formatMessage(generalMessages.waiting)}
                  {(faucetRequested === 'success' && !faucetPending && (needAeth || needEth)) &&
                    intl.formatMessage(generalMessages.done)
                  }
                  {needEth && !faucetRequested && intl.formatMessage(generalMessages.requestTestEthers)}
                  {(needAeth && needMana) && !needEth && !faucetRequested &&
                    intl.formatMessage(generalMessages.requestTestAEthers)
                  }
                  {needMana && !needAeth && !needEth &&
                    intl.formatMessage(generalMessages.learnMore)
                  }
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
    faucetPending: PropTypes.bool,
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
        faucetPending: state.actionState.getIn(['pending', 'faucet']),
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
