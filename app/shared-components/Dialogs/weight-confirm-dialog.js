import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Dialog, FlatButton, TextField, SvgIcon, IconButton } from 'material-ui';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import { EntryUpvote, EntryDownvote } from '../svg';
import { deletePendingAction, hideWeightConfirmDialog,
    updateAction } from '../../local-flux/actions/app-actions';
import { entryIsActive } from '../../local-flux/actions/entry-actions';
import { selectPendingAction } from '../../local-flux/selectors';
import { confirmMessages, formMessages, generalMessages } from '../../locale-data/messages';
import style from './weight-confirm-dialog.scss';
import actionTypes from '../../constants/action-types';

const WEIGHT_LIMIT_ERROR = 'WEIGHT_LIMIT_ERROR';
const NOT_ENOUGH_FUNDS_ERROR = 'NOT_ENOUGH_FUNDS_ERROR';

class WeightConfirmDialog extends Component {

    constructor (props) {
        super(props);
        const { resource } = props;
        const { minWeight, maxWeight } = this.getLimitValues();
        const initialWeight = resource.get('type') === actionTypes.upvote ? minWeight : maxWeight;
        this.state = {
            voteWeight: initialWeight,
            gasAmount: resource.get('gas'),
            voteWeightError: !this.hasEnoughFunds(initialWeight) ?
                NOT_ENOUGH_FUNDS_ERROR :
                null,
            gasAmountError: null
        };
    }

    componentDidMount () {
        const { resource } = this.props;
        this.props.entryIsActive(resource.getIn(['payload', 'entryId']));
    }

    componentDidUpdate () {
        ReactTooltip.rebuild();
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        this.handleConfirm();
    };

    getIcon = () => {
        const type = this.props.resource.type;
        switch (type) {
            case actionTypes.upvote:
                return <EntryUpvote className={`col-xs-1 ${style.upvoteIcon}`} />;
            case actionTypes.downvote:
                return <EntryDownvote className={`col-xs-1 ${style.downvoteIcon}`} />;
            default:
                return null;
        }
    };

    getLimitValues = () => {
        const { resource } = this.props;
        const minWeight = resource.get('type') === actionTypes.upvote ? 1 : -10;
        const maxWeight = resource.get('type') === actionTypes.upvote ? 10 : -1;
        return { minWeight, maxWeight };
    };

    hasEnoughFunds = (weight) => {
        const { balance, voteCost } = this.props;
        return balance > voteCost.get(Math.abs(weight).toString());
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

    handleVoteWeightChange = (ev) => {
        const weight = ev.target.value;
        const { minWeight, maxWeight } = this.getLimitValues();
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
    };

    handleConfirm = () => {
        const { resource, voteCost } = this.props;
        const voteWeight = Math.abs(this.state.voteWeight);
        const value = voteCost.get(voteWeight.toString());
        const updates = {
            gas: this.state.gasAmount || resource.get('gas'),
            payload: {
                weight: voteWeight,
                value
            },
            status: 'checkAuth'
        };
        this.props.hideWeightConfirmDialog();
        this.props.updateAction(resource.get('id'), updates);
    };

    handleCancel = () => {
        const { resource } = this.props;
        this.props.deletePendingAction(resource.get('id'));
        this.props.hideWeightConfirmDialog();
    };

    render () {
        const { entries, fullEntry, voteCost, isActivePending, resource, intl } = this.props;
        const { gasAmountError, voteWeight, voteWeightError } = this.state;
        const { palette } = this.context.muiTheme;
        const payload = resource ?
            resource.get('payload').toJS() :
            {};
        const { entryTitle, publisherAkashaId } = payload;
        const voteWeightCost = voteCost.get(Math.abs(voteWeight).toString());
        const { minWeight, maxWeight } = this.getLimitValues();
        const entry = entries.get(resource.getIn(['payload', 'entryId']));
        const isEntryActive = entry ?
            entry.get('active') :
            fullEntry && fullEntry.active;
        const weightErrorText = voteWeightError === WEIGHT_LIMIT_ERROR ?
            intl.formatMessage(formMessages.voteWeightError, { minWeight, maxWeight }) :
            intl.formatMessage(formMessages.notEnoughFunds);
        const title = resource && resource.type === actionTypes.upvote ?
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
            disabled={!!voteWeightError || !!gasAmountError || isActivePending || !isEntryActive}
          />
        ];

        return (
          <Dialog
            contentStyle={{ width: 420, maxWidth: 'none', height: '415px' }}
            bodyStyle={{ paddingBottom: '24px' }}
            modal
            title={title}
            titleStyle={{ fontSize: 24 }}
            open
            actions={dialogActions}
          >
            <div style={{ color: palette.textColor }}>
              <div
                data-tip={entryTitle && entryTitle.slice(0, 60)}
                style={{
                    fontSize: '18px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
              >
                {entryTitle}
              </div>
              <small>by {publisherAkashaId}</small>
              <div style={{ position: 'relative' }}>
                <form onSubmit={this.onSubmit}>
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
                </form>
              </div>
              {resource && !voteWeightError &&
                <div>
                  <small>
                    {resource.type === actionTypes.upvote ?
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
              {/* <div style={{ display: 'flex' }}>
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
              */}
              {!isEntryActive &&
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
    balance: PropTypes.string.isRequired,
    deletePendingAction: PropTypes.func.isRequired,
    entries: PropTypes.shape().isRequired,
    entryIsActive: PropTypes.func.isRequired,
    fullEntry: PropTypes.shape(),
    hideWeightConfirmDialog: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    isActivePending: PropTypes.bool,
    resource: PropTypes.shape().isRequired,
    updateAction: PropTypes.func.isRequired,
    voteCost: PropTypes.shape().isRequired,
};

WeightConfirmDialog.contextTypes = {
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        balance: state.profileState.get('balance'),
        entries: state.entryState.get('byId'),
        fullEntry: state.entryState.get('fullEntry'),
        isActivePending: state.entryState.getIn(['flags', 'isActivePending']),
        resource: selectPendingAction(state, state.appState.get('weightConfirmDialog')),
        voteCost: state.entryState.get('voteCostByWeight'),
    };
}

export default connect(
    mapStateToProps,
    {
        deletePendingAction,
        entryIsActive,
        hideWeightConfirmDialog,
        updateAction
    }
)(WeightConfirmDialog);
