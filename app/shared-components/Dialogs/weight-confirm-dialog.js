import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Dialog, FlatButton, TextField, SvgIcon, IconButton } from 'material-ui';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import { EntryUpvote, EntryDownvote } from '../../components/svg';
import { actionDelete, actionUpdate } from '../../local-flux/actions/action-actions';
import { entryIsActive } from '../../local-flux/actions/entry-actions';
import { selectNeedWeightAction } from '../../local-flux/selectors';
import { confirmMessages, formMessages, generalMessages } from '../../locale-data/messages';
import style from './weight-confirm-dialog.scss';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';

const WEIGHT_LIMIT_ERROR = 'WEIGHT_LIMIT_ERROR';
const NOT_ENOUGH_FUNDS_ERROR = 'NOT_ENOUGH_FUNDS_ERROR';

class WeightConfirmDialog extends Component {

    constructor (props) {
        super(props);
        const { action } = props;
        const { minWeight, maxWeight } = this.getLimitValues();
        const initialWeight = action.get('type') === actionTypes.upvote ? minWeight : maxWeight;
        this.state = {
            voteWeight: initialWeight,
            voteWeightError: !this.hasEnoughFunds(initialWeight) ?
                NOT_ENOUGH_FUNDS_ERROR :
                null,
        };
    }

    componentDidMount () {
        const { action } = this.props;
        this.props.entryIsActive(action.getIn(['payload', 'entryId']));
    }

    componentDidUpdate () {
        ReactTooltip.rebuild();
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        this.handleConfirm();
    };

    getIcon = () => {
        switch (this.props.action.get('type')) {
            case actionTypes.upvote:
                return <EntryUpvote className={`col-xs-1 ${style.upvoteIcon}`} />;
            case actionTypes.downvote:
                return <EntryDownvote className={`col-xs-1 ${style.downvoteIcon}`} />;
            default:
                return null;
        }
    };

    getLimitValues = () => {
        const { action } = this.props;
        const minWeight = action.get('type') === actionTypes.upvote ? 1 : -10;
        const maxWeight = action.get('type') === actionTypes.upvote ? 10 : -1;
        return { minWeight, maxWeight };
    };

    hasEnoughFunds = (weight) => {
        const { balance, voteCost } = this.props;
        return balance > voteCost.get(Math.abs(weight).toString());
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
        const { action, voteCost } = this.props;
        const voteWeight = Math.abs(this.state.voteWeight);
        const value = voteCost.get(voteWeight.toString());
        const changes = {
            id: action.get('id'),
            payload: {
                ...action.get('payload').toJS(),
                value,
                weight: voteWeight,
            },
            status: actionStatus.needAuth
        };
        this.props.actionUpdate(changes);
    };

    handleCancel = () => {
        const { action } = this.props;
        this.props.actionDelete(action.get('id'));
    };

    render () {
        const { action, entries, fullEntry, voteCost, isActivePending, intl } = this.props;
        const { voteWeight, voteWeightError } = this.state;
        const { palette } = this.context.muiTheme;
        const payload = action ?
            action.get('payload').toJS() :
            {};
        const { entryTitle, publisherAkashaId } = payload;
        const voteWeightCost = voteCost.get(Math.abs(voteWeight).toString());
        const { minWeight, maxWeight } = this.getLimitValues();
        const entry = entries.get(action.getIn(['payload', 'entryId']));
        const isEntryActive = entry ?
            entry.get('active') :
            fullEntry && fullEntry.active;
        const weightErrorText = voteWeightError === WEIGHT_LIMIT_ERROR ?
            intl.formatMessage(formMessages.voteWeightError, { minWeight, maxWeight }) :
            intl.formatMessage(formMessages.notEnoughFunds);
        const title = action && action.type === actionTypes.upvote ?
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
            disabled={!!voteWeightError || isActivePending || !isEntryActive}
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
              {action && !voteWeightError &&
                <div>
                  <small>
                    {action.type === actionTypes.upvote ?
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
    action: PropTypes.shape().isRequired,
    actionDelete: PropTypes.func.isRequired,
    actionUpdate: PropTypes.func.isRequired,
    balance: PropTypes.string.isRequired,
    entries: PropTypes.shape().isRequired,
    entryIsActive: PropTypes.func.isRequired,
    fullEntry: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    isActivePending: PropTypes.bool,
    voteCost: PropTypes.shape().isRequired,
};

WeightConfirmDialog.contextTypes = {
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        action: selectNeedWeightAction(state),
        balance: state.profileState.get('balance'),
        entries: state.entryState.get('byId'),
        fullEntry: state.entryState.get('fullEntry'),
        isActivePending: state.entryState.getIn(['flags', 'isActivePending']),
        voteCost: state.entryState.get('voteCostByWeight'),
    };
}

export default connect(
    mapStateToProps,
    {
        actionDelete,
        actionUpdate,
        entryIsActive,
    }
)(WeightConfirmDialog);
