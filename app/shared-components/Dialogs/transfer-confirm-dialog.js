import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import { deletePendingAction, hideTransferConfirmDialog,
    updateAction } from '../../local-flux/actions/app-actions';
import { selectPendingAction } from '../../local-flux/selectors';
import { confirmMessages, generalMessages } from '../../locale-data/messages';
import { SendTipForm } from '../';

const NOT_ENOUGH_FUNDS = 'notEnoughFunds';
const AMOUNT_ERROR = 'tipAmountError';
const DECIMALS_ERROR = 'tipDecimalsError';
const MIN_AMOUNT = 0.0001;
const MAX_DECIMALS = 4;

class TransferConfirmDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            ethAmount: '0.0001',
            ethAmountError: null,
            gasAmount: props.resource.get('gas'),
            gasAmountError: null
        };
    }

    componentDidUpdate () {
        ReactTooltip.rebuild();
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        this.handleConfirm();
    };

    handleGasChange = (ev) => {
        const gasAmount = ev.target.value;
        if (gasAmount < 2000000 || gasAmount > 4700000) {
            this.setState({
                gasAmountError: true,
                gasAmount
            });
        } else {
            this.setState({
                gasAmountError: false,
                gasAmount
            });
        }
    };

    handleEthChange = (ev) => {
        const { balance } = this.props;
        const ethAmount = ev.target.value;
        const ethAmountDecimals = ethAmount.split('.')[1];
        if (!Number(ethAmount) || Number(ethAmount) < MIN_AMOUNT) {
            this.setState({
                ethAmountError: { message: AMOUNT_ERROR, minAmount: MIN_AMOUNT },
                ethAmount
            });
        } else if (!Number(balance) || (Number(ethAmount) > Number(balance) - 0.1)) {
            this.setState({
                ethAmountError: { message: NOT_ENOUGH_FUNDS },
                ethAmount
            });
        } else if (ethAmountDecimals && ethAmountDecimals.length > MAX_DECIMALS) {
            this.setState({
                ethAmountError: { message: DECIMALS_ERROR, maxDecimals: MAX_DECIMALS },
                ethAmount
            });
        } else {
            this.setState({
                ethAmountError: null,
                ethAmount
            });
        }
    };

    handleConfirm = () => {
        const { resource } = this.props;
        const updates = {
            gas: this.state.gasAmount || resource.get('gas'),
            payload: {
                eth: this.state.ethAmount
            },
            status: 'checkAuth'
        };
        this.props.hideTransferConfirmDialog();
        this.props.updateAction(resource.get('id'), updates);
    };

    handleAbort = () => {
        const { resource } = this.props;
        this.props.deletePendingAction(resource.get('id'));
        this.props.hideTransferConfirmDialog();
    };

    render () {
        const { balance, resource, intl } = this.props;
        const { ethAmount, ethAmountError, gasAmount, gasAmountError } = this.state;
        if (!resource) {
            return null;
        }
        const dialogActions = [
          <FlatButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.abort)}
            style={{ marginRight: 8 }}
            onClick={this.handleAbort}
          />,
          <RaisedButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.confirm)}
            primary
            onClick={this.handleConfirm}
            disabled={gasAmountError || !!ethAmountError}
          />
        ];
        return (
          <Dialog
            contentStyle={{ width: 420, maxWidth: 'none' }}
            modal
            title={
              <div style={{ fontSize: 24 }}>
                {intl.formatMessage(confirmMessages[resource.get('titleId')])}
              </div>
            }
            open
            actions={dialogActions}
          >
            <SendTipForm
              balance={balance}
              disableReceiverField
              ethAmount={ethAmount}
              ethAmountError={ethAmountError}
              gasAmount={gasAmount}
              gasAmountError={gasAmountError}
              handleEthChange={this.handleEthChange}
              handleGasChange={this.handleGasChange}
              onSubmit={this.onSubmit}
              profileData={resource.payload}
            />
          </Dialog>
        );
    }
}

TransferConfirmDialog.propTypes = {
    balance: PropTypes.string,
    deletePendingAction: PropTypes.func.isRequired,
    hideTransferConfirmDialog: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    resource: PropTypes.shape(),
    updateAction: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        balance: state.profileState.get('balance'),
        resource: selectPendingAction(state, state.appState.get('transferConfirmDialog')),
    };
}

export default connect(
    mapStateToProps,
    {
        deletePendingAction,
        hideTransferConfirmDialog,
        updateAction
    }
)(TransferConfirmDialog);
