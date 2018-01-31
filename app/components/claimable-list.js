import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../constants/action-types';
import { actionAdd } from '../local-flux/actions/action-actions';
import { selectClaimableActions, selectEntryEndPeriod, selectLoggedEthAddress, selectPendingClaims,
    selectPendingClaimVotes } from '../local-flux/selectors';
import { entryMessages, formMessages, generalMessages } from '../locale-data/messages';
import { balanceToNumber } from '../utils/number-formatter';
import { DataLoader } from './';

class ClaimableList extends Component {
    shouldComponentUpdate (nextProps) {
        const { canClaim, canClaimVote, claimableActions, endPeriod, entryBalance,
            entryVotes, fetchingClaimable, pendingClaim, pendingClaimVote } = nextProps;
        if (
            !canClaim.equals(this.props.canClaim) ||
            !canClaimVote.equals(this.props.canClaimVote) ||
            !claimableActions.equals(this.props.claimableActions) ||
            !endPeriod.equals(this.props.endPeriod) ||
            !entryBalance.equals(this.props.entryBalance) ||
            !entryVotes.equals(this.props.entryVotes) ||
            fetchingClaimable !== this.props.fetchingClaimable ||
            !pendingClaim.equals(this.props.pendingClaim) ||
            !pendingClaimVote.equals(this.props.pendingClaimVote)
        ) {
            return true;
        }

        return false;
    }

    getEntryInfo = (action) => {
        const entryId = action.getIn(['payload', 'entryId']);
        const ethAddress = action.getIn(['payload', 'ethAddress']);
        const entryTitle = this.isOwnEntry(ethAddress) ?
            action.getIn(['payload', 'draft', 'title']) :
            action.getIn(['payload', 'entryTitle']);
        return { entryId, entryTitle, ethAddress };
    };

    canCollect = (entryId, ethAddress) => {
        const { canClaim, canClaimVote } = this.props;
        return this.isOwnEntry(ethAddress) ? canClaim.get(entryId) : canClaimVote.get(entryId);
    };

    // isActive = entry => entry.get('endPeriod') > Date.now() / 1000;
    isActive = entryId => this.props.endPeriod.get(entryId) > Date.now() / 1000;

    isClaimed = (entryId, ethAddress) => {
        const { entryBalance, entryVotes } = this.props;
        const vote = entryVotes.get(entryId);
        return this.isOwnEntry(ethAddress) ?
            entryBalance.getIn([entryId, 'claimed']) :
            vote && vote.get('claimed');
    };

    isOwnEntry = ethAddress => ethAddress === this.props.loggedEthAddress;

    collectAll = (claimableActions) => {
        const { loggedEthAddress } = this.props;
        const actions = [];
        if (claimableActions.size === 1) {
            const { entryId, entryTitle, ethAddress } = this.getEntryInfo(claimableActions.first());
            const payload = { entryId, entryTitle };
            const type = this.isOwnEntry(ethAddress) ? actionTypes.claim : actionTypes.claimVote;
            this.props.actionAdd(loggedEthAddress, type, payload);
            return;
        }
        claimableActions.forEach((action) => {
            const { entryId, entryTitle, ethAddress } = this.getEntryInfo(action);
            const payload = { entryId, entryTitle };
            const type = this.isOwnEntry(ethAddress) ? actionTypes.claim : actionTypes.claimVote;
            actions.push({ ethAddress: loggedEthAddress, actionType: type, payload });
        });
        this.props.actionAdd(loggedEthAddress, actionTypes.batch, { actions });
    };

    renderRow = (action, index) => { // eslint-disable-line
        const { claimableActions, endPeriod, entryBalance, entryVotes, intl, loggedEthAddress, pendingClaim,
            pendingClaimVote } = this.props;
        const { entryId, entryTitle, ethAddress } = this.getEntryInfo(action);
        const className = classNames('claimable-list__row', {
            'claimable-list__row_last': index === (claimableActions.size - 1)
        });
        const ownEntry = this.isOwnEntry(ethAddress);
        const vote = entryVotes.get(entryId);

        const onCollect = () => {
            const payload = { entryId, entryTitle };
            const type = ownEntry ? actionTypes.claim : actionTypes.claimVote;
            this.props.actionAdd(loggedEthAddress, type, payload);
        };

        const balance = ownEntry ?
            balanceToNumber(entryBalance.getIn([entryId, 'totalKarma'])) :
            balanceToNumber(vote && vote.get('essence'));
        let timeDiff;
        const isActive = this.isActive(entryId);
        if (isActive) {
            timeDiff = intl.formatRelative(new Date(endPeriod.get(entryId) * 1000));
        }
        const loading = ownEntry ? pendingClaim.get(entryId) : pendingClaimVote.get(entryId);
        let buttonTooltip;
        if (!this.canCollect(entryId, ethAddress)) {
            buttonTooltip = ownEntry ?
                intl.formatMessage(entryMessages.cannotClaimEntry) :
                intl.formatMessage(entryMessages.cannotClaimVote);
        }

        return (
          <div className={className} key={entryId}>
            <div className="claimable-list__entry-info">
              <div>
                <Link
                  className="unstyled-link"
                  to={{
                      pathname: `/${ethAddress || '0x0'}/${entryId}`,
                      state: { overlay: true }
                  }}
                >
                  <span className="content-link overflow-ellipsis claimable-list__entry-title">
                    {entryTitle}
                  </span>
                </Link>
              </div>
              <div>
                {balance} {intl.formatMessage(generalMessages.essence)}
              </div>
            </div>
            <div className="flex-center claimable-list__button-wrapper">
              {!isActive && !this.isClaimed(entryId, ethAddress) &&
                <Tooltip arrowPointAtCenter title={buttonTooltip}>
                  <Button
                    disabled={loading || !this.canCollect(entryId, ethAddress)}
                    loading={loading}
                    onClick={onCollect}
                    size="small"
                    type="primary"
                  >
                    {intl.formatMessage(generalMessages.collect)}
                  </Button>
                </Tooltip>
              }
              {this.isClaimed(entryId, ethAddress) &&
                <div className="claimable-list__collected">
                  {intl.formatMessage(generalMessages.collected)}
                </div>
              }
              {isActive &&
                <div className="claimable-list__collect-in">
                  {intl.formatMessage(generalMessages.collect)} {timeDiff}
                </div>
              }
            </div>
          </div>
        );
    };

    render () {
        const { claimableActions, entryBalance, entryVotes, fetchingClaimable, intl, pendingClaim,
            pendingClaimVote } = this.props;
        let collectableEntries = new List();
        let nonCollectableEntries = new List();
        claimableActions
            .filter((action) => {
                const { entryId, ethAddress } = this.getEntryInfo(action);
                const ownEntry = this.isOwnEntry(ethAddress);
                const vote = entryVotes.get(entryId);
                const cannotClaim = !this.isActive(entryId) && !this.canCollect(entryId, ethAddress);
                const balance = ownEntry ?
                    balanceToNumber(entryBalance.getIn([entryId, 'totalKarma'])) :
                    balanceToNumber(vote && vote.get('essence'));
                return !this.isClaimed(entryId, ethAddress) && !!balance && !cannotClaim;
            })
            .forEach((action) => {
                const { entryId, ethAddress } = this.getEntryInfo(action);
                if (this.canCollect(entryId, ethAddress)) {
                    collectableEntries = collectableEntries.push(action);
                } else {
                    nonCollectableEntries = nonCollectableEntries.push(action);
                }
            });
        const onCollectAll = () => this.collectAll(collectableEntries);
        const claimPending = pendingClaim.find(claim => !!claim);
        const claimVotePending = pendingClaimVote.find(claim => !!claim);
        const collectAllDisabled = claimPending || claimVotePending || !collectableEntries.size;
        return (
          <div className="claimable-list">
            <div className="flex-center-y claimable-list__title">
              {intl.formatMessage(entryMessages.collectEssence)}
              <span className="flex-center claimable-list__counter">{collectableEntries.size}</span>
              <div className="claimable-list__collect-all-wrapper">
                <Button
                  className="claimable-list__collect-all"
                  disabled={collectAllDisabled}
                  onClick={onCollectAll}
                  size="small"
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.collectAll)}
                </Button>
              </div>
            </div>
            <div className="claimable-list__list-wrapper">
              {(collectableEntries.size === 0 && nonCollectableEntries.size === 0) &&
                <div
                  className="claimable-list__list-placeholder-wrapper"
                >
                  <div
                    className="claimable-list__list-placeholder"
                  >
                    <div className="claimable-list__list-placeholder_image" />
                    <div
                      className="claimable-list__list-placeholder_text"
                    >
                      <div>{intl.formatMessage(generalMessages.noEssenceToCollectTitle)}</div>
                      <div>{intl.formatMessage(generalMessages.noEssenceToCollectDescription)}</div>
                    </div>
                  </div>
                </div>
              }
              {(collectableEntries.size > 0 || nonCollectableEntries.size > 0) &&
                <DataLoader flag={fetchingClaimable} style={{ paddingTop: '40px' }}>
                  <div className="claimable-list__list">
                    {collectableEntries.toList().map(this.renderRow)}
                    {nonCollectableEntries.toList().map(this.renderRow)}
                  </div>
                </DataLoader>
              }
            </div>
            <div className="claimable-list__actions">
              <Button
                className="claimable-list__button"
                onClick={this.props.onHistory}
              >
                {intl.formatMessage(generalMessages.history)}
              </Button>
              <Button
                className="claimable-list__button"
                onClick={this.props.onForge}
              >
                {intl.formatMessage(formMessages.forgeAeth)}
              </Button>
            </div>
          </div>
        );
    }
}

ClaimableList.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    canClaim: PropTypes.shape().isRequired,
    canClaimVote: PropTypes.shape().isRequired,
    claimableActions: PropTypes.shape().isRequired,
    endPeriod: PropTypes.shape().isRequired,
    entryBalance: PropTypes.shape().isRequired,
    entryVotes: PropTypes.shape().isRequired,
    fetchingClaimable: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    onForge: PropTypes.func.isRequired,
    onHistory: PropTypes.func.isRequired,
    pendingClaim: PropTypes.shape().isRequired,
    pendingClaimVote: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        canClaim: state.entryState.get('canClaim'),
        canClaimVote: state.entryState.get('canClaimVote'),
        claimableActions: selectClaimableActions(state),
        endPeriod: selectEntryEndPeriod(state),
        entryBalance: state.entryState.get('balance'),
        entryVotes: state.entryState.get('votes'),
        fetchingClaimable: state.actionState.getIn(['flags', 'fetchingClaimable']),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingClaim: selectPendingClaims(state),
        pendingClaimVote: selectPendingClaimVotes(state),
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
    },
    null,
    { pure: false }
)(injectIntl(ClaimableList));
