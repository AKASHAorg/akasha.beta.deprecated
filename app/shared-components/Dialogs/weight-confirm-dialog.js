import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Dialog, FlatButton, TextField, SvgIcon, IconButton } from 'material-ui';
import { EntryUpvote, EntryDownvote } from 'shared-components/svg';
import style from './weight-confirm-dialog.scss';
import { confirmMessages, formMessages, generalMessages } from 'locale-data/messages';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';

const WEIGHT_LIMIT_ERROR = 'WEIGHT_LIMIT_ERROR';
const NOT_ENOUGH_FUNDS_ERROR = 'NOT_ENOUGH_FUNDS_ERROR';

class WeightConfirmDialog extends React.PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            voteWeight: '1',
            gasAmount: null,
            voteWeightError: null,
            gasAmountError: null
        };
    }

    componentWillReceiveProps (nextProps) {
        const { isOpen, resource } = nextProps;
        if (isOpen && !this.props.isOpen) {
            this.setState({
                gasAmount: resource.get('gas'),
                voteWeightError: !this.hasEnoughFunds(this.state.voteWeight) ?
                    NOT_ENOUGH_FUNDS_ERROR :
                    null
            });
        }
        if (!isOpen && this.props.isOpen) {
            this.setState({
                voteWeight: '1',
                voteWeightError: null,
                gasAmountError: null
            });
        }
    }

    getIcon = () => {
        const { isOpen } = this.props;
        const actionType = isOpen ? this.props.resource.type : 'default';
        switch (actionType) {
            case 'upvote':
                return <EntryUpvote className={`col-xs-1 ${style.upvoteIcon}`} />;
            case 'downvote':
                return <EntryDownvote className={`col-xs-1 ${style.downvoteIcon}`} />;
            default:
                return null;
        }
    };

    hasEnoughFunds = (weight) => {
        const { balance, voteCost } = this.props;
        return balance > voteCost.get(weight);
    }

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
    }

    handleVoteWeightChange = (ev) => {
        const weight = ev.target.value;
        let voteWeightError = null;
        if (weight < 1 || weight > 10) {
            voteWeightError = WEIGHT_LIMIT_ERROR;
        } else if (!this.hasEnoughFunds(weight)) {
            voteWeightError = NOT_ENOUGH_FUNDS_ERROR;
        }
        this.setState({
            voteWeightError,
            voteWeight: weight
        });
    }

    handleConfirm = () => {
        const { resource, voteCost, appActions } = this.props;
        const value = voteCost.get(this.state.voteWeight);
        const updatedResource = resource.toJS();
        updatedResource.gas = this.state.gasAmount || resource.get('gas');
        updatedResource.status = 'checkAuth';
        updatedResource.payload.weight = this.state.voteWeight;
        updatedResource.payload.value = value;
        appActions.hideWeightConfirmDialog();
        appActions.updatePendingAction(updatedResource);
    }

    handleCancel = () => {
        const { resource, appActions } = this.props;
        appActions.deletePendingAction(resource.get('id'));
        appActions.hideWeightConfirmDialog();
    }

    render () {
        const { isOpen, voteCost, balance, intl } = this.props;
        const { gasAmount, gasAmountError, voteWeight, voteWeightError } = this.state;
        const { palette } = this.context.muiTheme;
        const resource = this.props.resource || { payload: {} };
        const { entryTitle, publisherName } = resource.payload;
        const voteWeightCost = voteCost.get(voteWeight);
        const shortBalance = balance ? balance.slice(0, 6) : '';
        const weightErrorText = voteWeightError === WEIGHT_LIMIT_ERROR ?
            intl.formatMessage(formMessages.voteWeightError) :
            intl.formatMessage(formMessages.notEnoughFunds);

        const dialogActions = [
          <FlatButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.cancel)}
            onTouchTap={this.handleCancel}
          />,
          <FlatButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.confirm)}
            primary
            onTouchTap={this.handleConfirm}
            disabled={!!voteWeightError || !!gasAmountError}
          />
        ];

        return (
          <Dialog
            contentStyle={{ width: 420, maxWidth: 'none', height: '415px' }}
            bodyStyle={{ paddingBottom: 0 }}
            modal
            title={
              <div style={{ fontSize: 24 }}>{intl.formatMessage(confirmMessages.voteTitle)}</div>
            }
            open={isOpen}
            actions={dialogActions}
          >
            <div style={{ color: palette.textColor }}>
              <div style={{ fontSize: '18px' }}>{entryTitle}</div>
              <small>by {publisherName}</small>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '39px' }}>
                  <SvgIcon viewBox="0 0 20 20" style={{ marginRight: '10px' }}>
                    {this.getIcon()}
                  </SvgIcon>
                </div>
                <TextField
                  type="number"
                  value={voteWeight}
                  onChange={this.handleVoteWeightChange}
                  style={{ width: '150px' }}
                  inputStyle={{ paddingLeft: '34px' }}
                  autoFocus
                  floatingLabelFixed
                  floatingLabelText="Vote weight"
                  errorText={voteWeightError && weightErrorText}
                  errorStyle={{ width: '350px' }}
                  min={1}
                  max={10}
                />
              </div>
              {resource.type === 'upvote' && !voteWeightError &&
                <div>
                  <small>
                    {intl.formatMessage(confirmMessages.voteWeightDisclaimer, {
                        publisherName, eth: voteWeightCost.slice(0, -1), voteWeight
                    })}
                  </small>
                </div>
              }
              <div style={{ display: 'flex' }}>
                <TextField
                  type="number"
                  floatingLabelFixed
                  floatingLabelText={intl.formatMessage(confirmMessages.gasInputLabel)}
                  fullWidth
                  value={gasAmount}
                  onChange={this.handleGasChange}
                  errorText={gasAmountError &&
                      intl.formatMessage(formMessages.gasAmountError, { min: 2000000, max: 4700000 })
                  }
                  min={2000000}
                  max={4700000}
                  style={{ flex: '1 1 auto' }}
                />
                <IconButton
                  style={{ marginTop: 24, flex: '0 0 auto' }}
                  title={intl.formatMessage(confirmMessages.gasInputDisclaimer)}
                >
                  <InfoIcon />
                </IconButton>
              </div>
              <div style={{ paddingTop: '10px' }}>
                <small>
                  {!voteWeightError &&
                      intl.formatMessage(confirmMessages.voteFeeAgreement, {
                          fee: voteWeightCost, balance: shortBalance
                      })
                  }
                </small>
              </div>
            </div>
          </Dialog>
        );
    }
}

WeightConfirmDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    voteCost: PropTypes.shape(),
    resource: PropTypes.shape(),
    balance: PropTypes.string,
    appActions: PropTypes.shape(),
    intl: PropTypes.shape()
};

WeightConfirmDialog.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default injectIntl(WeightConfirmDialog);