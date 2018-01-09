import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../constants/action-types';
import { actionAdd, actionGetClaimable } from '../local-flux/actions/action-actions';
import { selectClaimableEntries, selectClaimableEntryIds, selectLoggedEthAddress, selectPendingClaims,
    selectPendingClaimVotes } from '../local-flux/selectors';
import { generalMessages, profileMessages } from '../locale-data/messages';
import { balanceToNumber } from '../utils/number-formatter';
import { DataLoader, Icon } from './';
import { entryMessages } from '../locale-data/messages/entry-messages';

class ClaimableList extends Component {
    componentDidMount () {
        this.props.actionGetClaimable();
    }

    render () {
        const { canClaim, canClaimVote, entries, entryBalance, entryIds, entryVotes, fetchingClaimable, intl,
            loggedEthAddress, onBack, pendingClaim, pendingClaimVote, pendingEntries } = this.props;

        const isOwnEntry = entry => entry.getIn(['author', 'ethAddress']) === loggedEthAddress;

        const isClaimed = (entry) => {
            const vote = entryVotes.get(entry.entryId);
            return isOwnEntry(entry) ?
                entryBalance.getIn([entry.entryId, 'claimed']) :
                vote && vote.get('claimed');
        };

        const renderRow = (entry, index) => { // eslint-disable-line
            const entryId = entryIds.get(index);
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
            const ownEntry = isOwnEntry(entry);
            const vote = entryVotes.get(entryId);

            const onCollect = () => {
                const payload = { entryId, entryTitle: entry.getIn(['content', 'title']) };
                const type = ownEntry ? actionTypes.claim : actionTypes.claimVote;
                this.props.actionAdd(loggedEthAddress, type, payload);
            };

            const balance = ownEntry ?
                balanceToNumber(entryBalance.getIn([entryId, 'totalKarma'])) :
                balanceToNumber(vote && vote.get('essence'));
            if (!balance) {
                return null;
            }
            const endPeriod = entry.get('endPeriod');
            let timeDiff;
            const isActive = endPeriod > Date.now() / 1000;
            if (isActive) {
                timeDiff = intl.formatRelative(new Date(endPeriod * 1000));
            }
            const canCollect = ownEntry ? canClaim.get(entryId) : canClaimVote.get(entryId);
            const loading = ownEntry ? pendingClaim.get(entryId) : pendingClaimVote.get(entryId);
            let buttonTooltip;
            if (!canCollect) {
                buttonTooltip = ownEntry ?
                    intl.formatMessage(entryMessages.cannotClaimEntry) :
                    intl.formatMessage(entryMessages.cannotClaimVote);
            }

            return (
              <div className={className} key={entry.get('entryId')}>
                <div className="claimable-list__entry-info">
                  <div>
                    <Link
                      className="unstyled-link"
                      to={{
                          pathname: `/${entry.getIn(['author', 'ethAddress'])}/${entry.get('entryId')}`,
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
                  {!isActive && !isClaimed(entry) &&
                    <Tooltip arrowPointAtCenter title={buttonTooltip}>
                      <Button
                        disabled={loading || !canCollect}
                        loading={loading}
                        onClick={onCollect}
                        size="small"
                        type="primary"
                      >
                        {intl.formatMessage(generalMessages.collect)}
                      </Button>
                    </Tooltip>
                  }
                  {isClaimed(entry) &&
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

        const filteredEntries = entries.filter(entry => !isClaimed(entry));

        return (
          <div className="claimable-list">
            <div style={{ height: '100%' }}>
              <div className="flex-center-y claimable-list__title">
                <Icon
                  className="content-link claimable-list__back-icon"
                  onClick={onBack}
                  type="arrowLeft"
                />
                {intl.formatMessage(profileMessages.collectEssence)}
                <span className="flex-center claimable-list__counter">{filteredEntries.size}</span>
              </div>
              <DataLoader flag={fetchingClaimable} style={{ paddingTop: '40px' }}>
                <div className="claimable-list__list-wrapper">
                  <div className="claimable-list__list">
                    {filteredEntries.toList().map(renderRow)}
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
    entryIds: PropTypes.shape().isRequired,
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
        entryIds: selectClaimableEntryIds(state),
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
