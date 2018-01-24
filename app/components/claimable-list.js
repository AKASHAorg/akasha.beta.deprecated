import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../constants/action-types';
import { actionAdd, actionGetClaimable } from '../local-flux/actions/action-actions';
import { selectClaimableEntries, selectLoggedEthAddress, selectPendingClaims,
    selectPendingClaimVotes } from '../local-flux/selectors';
import { generalMessages, profileMessages } from '../locale-data/messages';
import { balanceToNumber } from '../utils/number-formatter';
import { DataLoader, Icon } from './';
import { entryMessages } from '../locale-data/messages/entry-messages';

class ClaimableList extends Component {
    componentDidMount () {
        this.props.actionGetClaimable();
    }

    canCollect = (entry) => {
        const { canClaim, canClaimVote } = this.props;
        const entryId = entry.entryId;
        return this.isOwnEntry(entry) ? canClaim.get(entryId) : canClaimVote.get(entryId);
    };

    isActive = entry => entry.get('endPeriod') > Date.now() / 1000;

    isClaimed = (entry) => {
        const { entryBalance, entryVotes } = this.props;
        const vote = entryVotes.get(entry.entryId);
        return this.isOwnEntry(entry) ?
            entryBalance.getIn([entry.entryId, 'claimed']) :
            vote && vote.get('claimed');
    };

    isOwnEntry = entry => entry.getIn(['author', 'ethAddress']) === this.props.loggedEthAddress;

    collectAll = (entries) => {
        const { loggedEthAddress } = this.props;
        const actions = [];
        entries.forEach((entry) => {
            const payload = {
                entryId: entry.get('entryId'),
                entryTitle: entry.getIn(['content', 'title'])
            };
            const type = this.isOwnEntry(entry) ? actionTypes.claim : actionTypes.claimVote;
            actions.push({ ethAddress: loggedEthAddress, actionType: type, payload });
        });
        this.props.actionAdd(loggedEthAddress, actionTypes.batch, { actions });
    };

    renderRow = (entry, index) => { // eslint-disable-line
        const { entries, entryBalance, entryVotes, intl, loggedEthAddress, pendingClaim,
            pendingClaimVote, pendingEntries } = this.props;
        const entryId = entry.entryId;
        const className = classNames('claimable-list__row', {
            'claimable-list__row_last': index === (entries.size - 1)
        });
        if (pendingEntries && pendingEntries.get(entryId)) {
            return (
              <div className={className} key={entryId}>
                <div className="claimable-list__entry-info">
                  <div className="claimable-list__entry-title-placeholder" />
                  <div className="claimable-list__balance-placeholder" />
                </div>
                <div className="flex-center claimable-list__button-wrapper">
                  <div className="claimable-list__button-placeholder" />
                </div>
              </div>
            );
        }
        const ownEntry = this.isOwnEntry(entry);
        const vote = entryVotes.get(entryId);

        const onCollect = () => {
            const payload = { entryId, entryTitle: entry.getIn(['content', 'title']) };
            const type = ownEntry ? actionTypes.claim : actionTypes.claimVote;
            this.props.actionAdd(loggedEthAddress, type, payload);
        };

        const balance = ownEntry ?
            balanceToNumber(entryBalance.getIn([entryId, 'totalKarma'])) :
            balanceToNumber(vote && vote.get('essence'));
        const endPeriod = entry.get('endPeriod');
        let timeDiff;
        const isActive = this.isActive(entry);
        if (isActive) {
            timeDiff = intl.formatRelative(new Date(endPeriod * 1000));
        }
        const loading = ownEntry ? pendingClaim.get(entryId) : pendingClaimVote.get(entryId);
        let buttonTooltip;
        if (!this.canCollect(entry)) {
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
                      pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.get('entryId')}`,
                      state: { overlay: true }
                  }}
                >
                  <span className="content-link overflow-ellipsis claimable-list__entry-title">
                    {entry.getIn(['content', 'title'])}
                  </span>
                </Link>
              </div>
              <div>
                {balance} {intl.formatMessage(generalMessages.essence)}
              </div>
            </div>
            <div className="flex-center claimable-list__button-wrapper">
              {!isActive && !this.isClaimed(entry) &&
                <Tooltip arrowPointAtCenter title={buttonTooltip}>
                  <Button
                    disabled={loading || !this.canCollect(entry)}
                    loading={loading}
                    onClick={onCollect}
                    size="small"
                    type="primary"
                  >
                    {intl.formatMessage(generalMessages.collect)}
                  </Button>
                </Tooltip>
              }
              {this.isClaimed(entry) &&
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
        const { entries, entryBalance, entryVotes, fetchingClaimable, intl, onBack,
            pendingClaim, pendingClaimVote } = this.props;
        let collectableEntries = new List();
        let nonCollectableEntries = new List();
        entries
            .filter((entry) => {
                const ownEntry = this.isOwnEntry(entry);
                const vote = entryVotes.get(entry.entryId);
                const cannotClaim = !this.isActive(entry) && !this.canCollect(entry);
                const balance = ownEntry ?
                    balanceToNumber(entryBalance.getIn([entry.entryId, 'totalKarma'])) :
                    balanceToNumber(vote && vote.get('essence'));
                return !this.isClaimed(entry) && !!balance && !cannotClaim;
            })
            .forEach((entry) => {
                if (this.canCollect(entry)) {
                    collectableEntries = collectableEntries.push(entry);
                } else {
                    nonCollectableEntries = nonCollectableEntries.push(entry);
                }
            });
        const onCollectAll = () => this.collectAll(collectableEntries);
        const collectAllDisabled = pendingClaim.size || pendingClaimVote.size || !collectableEntries.size;
        // console.log('entries', entries.size);
        // console.log('non collectable entries', nonCollectableEntries.size);
        // console.log('=====================================');
        return (
          <div className="claimable-list">
            <div style={{ height: '100%' }}>
              <div className="flex-center-y claimable-list__title">
                <Icon
                  className="content-link claimable-list__back-icon"
                  onClick={onBack}
                  type="arrowLeft"
                />
                {intl.formatMessage(profileMessages.essenceReady)}
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
              <DataLoader flag={fetchingClaimable} style={{ paddingTop: '40px' }}>
                <div className="claimable-list__list-wrapper">
                  <div className="claimable-list__list">
                    {collectableEntries.toList().map(this.renderRow)}
                    {nonCollectableEntries.toList().map(this.renderRow)}
                  </div>
                </div>
              </DataLoader>
            </div>
          </div>
        );
    }
}

ClaimableList.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    actionGetClaimable: PropTypes.func.isRequired,
    canClaim: PropTypes.shape().isRequired,
    canClaimVote: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryBalance: PropTypes.shape().isRequired,
    entryVotes: PropTypes.shape().isRequired,
    fetchingClaimable: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    pendingClaim: PropTypes.shape().isRequired,
    pendingClaimVote: PropTypes.shape().isRequired,
    pendingEntries: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        canClaim: state.entryState.get('canClaim'),
        canClaimVote: state.entryState.get('canClaimVote'),
        entries: selectClaimableEntries(state),
        entryBalance: state.entryState.get('balance'),
        entryVotes: state.entryState.get('votes'),
        fetchingClaimable: state.actionState.getIn(['flags', 'fetchingClaimable']),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingClaim: selectPendingClaims(state),
        pendingClaimVote: selectPendingClaimVotes(state),
        pendingEntries: state.entryState.getIn(['flags', 'pendingEntries', 'claimableEntries']),
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        actionGetClaimable
    },
    null,
    { pure: false }
)(injectIntl(ClaimableList));
