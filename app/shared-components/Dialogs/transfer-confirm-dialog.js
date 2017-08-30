import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import * as actionStatus from '../../constants/action-status';
import { actionDelete, actionUpdate } from '../../local-flux/actions/action-actions';
import { hideTransferConfirmDialog, pendingActionUpdate } from '../../local-flux/actions/app-actions';
import { selectNeedTransferAction } from '../../local-flux/selectors';
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
        };
    }

    componentDidUpdate () {
        ReactTooltip.rebuild();
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        this.handleConfirm();
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
        const { action } = this.props;
        const changes = {
            id: action.get('id'),
            payload: {
                ...action.get('payload').toJS(),
                value: this.state.ethAmount
            },
            status: actionStatus.needAuth
        };
        this.props.actionUpdate(changes);
    };

    handleAbort = () => {
        const { action } = this.props;
        this.props.actionDelete(action.get('id'));
    };

    render () {
        const { action, balance, intl } = this.props;
        const { ethAmount, ethAmountError } = this.state;
        if (!action) {
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
            disabled={!!ethAmountError}
          />
        ];
        return (
          <Dialog
            contentStyle={{ width: 420, maxWidth: 'none' }}
            modal
            title={
              <div style={{ fontSize: 24 }}>
                {intl.formatMessage(confirmMessages.sendTipTitle)}
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
              handleEthChange={this.handleEthChange}
              onSubmit={this.onSubmit}
              profileData={action.get('payload').toJS()}
            />
          </Dialog>
        );
    }
}

TransferConfirmDialog.propTypes = {
    action: PropTypes.shape(),
    actionDelete: PropTypes.func.isRequired,
    actionUpdate: PropTypes.func.isRequired,
    balance: PropTypes.string,
    intl: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        action: selectNeedTransferAction(state),
        balance: state.profileState.get('balance'),
    };
}

export default connect(
    mapStateToProps,
    {
        actionDelete,
        actionUpdate,
        hideTransferConfirmDialog,
        pendingActionUpdate
    }
)(TransferConfirmDialog);
