import React, { PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
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
            voteWeight: null,
            gasAmount: null,
            voteWeightError: null,
            gasAmountError: null
        };
    }

    componentWillReceiveProps (nextProps) {
        const { isOpen, resource, entryActions, minWeight, maxWeight } = nextProps;
        if (isOpen && !this.props.isOpen) {
            entryActions.isActive(resource.getIn(['payload', 'entryId']));
            const initialWeight = resource.get('type') === 'upvote' ? minWeight : maxWeight;
            this.setState({
                voteWeight: initialWeight,
                gasAmount: resource.get('gas'),
                voteWeightError: !this.hasEnoughFunds(initialWeight) ?
                    NOT_ENOUGH_FUNDS_ERROR :
                    null
            });
        }
        if (!isOpen && this.props.isOpen) {
            this.setState({
                voteWeightError: null,
                gasAmountError: null
            });
        }
    }

    componentDidUpdate () {
        ReactTooltip.rebuild();
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
        return balance > voteCost.get(Math.abs(weight).toString());
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
        const { minWeight, maxWeight } = this.props;
        let voteWeightError = null;
        if (weight < minWeight || weight > maxWeight) {
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
        const voteWeight = Math.abs(this.state.voteWeight);
        const value = voteCost.get(voteWeight.toString());
        const updatedResource = resource.toJS();
        updatedResource.gas = this.state.gasAmount || resource.get('gas');
        updatedResource.status = 'checkAuth';
        updatedResource.payload.weight = voteWeight;
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
        const { isOpen, voteCost, balance, isActivePending, resource, active, minWeight, maxWeight,
            intl } = this.props;
        const { gasAmount, gasAmountError, voteWeight, voteWeightError } = this.state;
        const { palette } = this.context.muiTheme;
        const fee = 0.0001;
        const payload = resource ?
            resource.get('payload').toJS() :
            {};
        const { entryTitle, publisherAkashaId } = payload;
        const voteWeightCost = voteCost.get(Math.abs(voteWeight).toString());
        const shortBalance = balance ? balance.slice(0, 6) : '';
        const weightErrorText = voteWeightError === WEIGHT_LIMIT_ERROR ?
            intl.formatMessage(formMessages.voteWeightError, { minWeight, maxWeight }) :
            intl.formatMessage(formMessages.notEnoughFunds);
        const voteFundsDestination = resource && resource.type === 'upvote' ?
            'Author' :
            'Faucet';
        const title = resource && resource.type === 'upvote' ?
            intl.formatMessage(confirmMessages.upvoteTitle) :
            intl.formatMessage(confirmMessages.downvoteTitle);
        const dialogActions = [
          <FlatButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.cancel)}
            onTouchTap={this.handleCancel}
          />,
          <FlatButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.confirm)}
            primary
            onTouchTap={this.handleConfirm}
            disabled={!!voteWeightError || !!gasAmountError || isActivePending || !active}
          />
        ];

        return (
          <Dialog
            contentStyle={{ width: 420, maxWidth: 'none', height: '415px' }}
            bodyStyle={{ paddingBottom: '24px' }}
            modal
            title={<div style={{ fontSize: 24 }}>{title}</div>}
            open={isOpen}
            actions={dialogActions}
          >
            <div style={{ color: palette.textColor }}>
              <div style={{ fontSize: '18px' }}>{entryTitle}</div>
              <small>by {publisherAkashaId}</small>
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
                  errorStyle={{ position: 'absolute', bottom: '-8px', width: '350px' }}
                  min={minWeight}
                  max={maxWeight}
                />
                <div
                  style={{ position: 'relative', top: '5px', display: 'inline-block' }}
                  data-tip={intl.formatMessage(confirmMessages.voteWeightDisclaimer)}
                >
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </div>
              </div>
              {resource && !voteWeightError &&
                <div>
                  <small>
                    {resource.type === 'upvote' ?
                        intl.formatMessage(confirmMessages.upvoteWeightDisclaimer, {
                            publisherAkashaId, eth: voteWeightCost.slice(0, -1), voteWeight
                        }) :
                        intl.formatMessage(confirmMessages.downvoteWeightDisclaimer, {
                            eth: voteWeightCost.slice(0, -1), voteWeight
                        })
                    }
                  </small>
                </div>
              }
              {voteWeightError &&
                <div style={{ height: '24px' }} />
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
                <div
                  style={{ marginTop: 24, flex: '0 0 auto', display: 'inline-block' }}
                  data-tip={intl.formatMessage(confirmMessages.gasInputDisclaimer)}
                >
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </div>
              </div>
              {!active &&
                <div style={{ color: 'red' }}>
                  <small>
                    {intl.formatMessage(confirmMessages.inactiveEntryError)}
                  </small>
                </div>
              }
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
    isActivePending: PropTypes.bool,
    active: PropTypes.bool,
    appActions: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    minWeight: PropTypes.number,
    maxWeight: PropTypes.number,
    intl: PropTypes.shape()
};

WeightConfirmDialog.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default injectIntl(WeightConfirmDialog);
