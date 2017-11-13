import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../constants/action-types';
import { actionAdd } from '../local-flux/actions/action-actions';
import { selectClaimableEntries, selectLoggedEthAddress, selectPendingClaims,
    selectPendingClaimVotes } from '../local-flux/selectors';
import { generalMessages, profileMessages } from '../locale-data/messages';

const ClaimableList = (props) => {
    const { canClaim, canClaimVote, entries, entryBalance, entryVotes, intl, loggedEthAddress,
        pendingClaim, pendingClaimVote } = props;

    const renderRow = (entry, index) => {
        const className = classNames('claimable-list__row', {
            'claimable-list__row_last': index === (entries.size - 1)
        });
        if (!entry) {
            return (
              <div className={className}>
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
        const isOwnEntry = entry.getIn(['author', 'ethAddress']) === loggedEthAddress;
        const entryId = entry.get('entryId');

        const onCollect = () => {
            const payload = { entryId, entryTitle: entry.getIn(['content', 'title']) };
            const type = isOwnEntry ? actionTypes.claim : actionTypes.claimVote;
            props.actionAdd(loggedEthAddress, type, payload);
        };

        const balance = isOwnEntry ?
            entryBalance.getIn([entryId, 'totalKarma']) :
            entryVotes.getIn([entryId, 'vote']);
        const endPeriod = entry.get('endPeriod');
        let timeDiff;
        const isActive = endPeriod > Date.now() / 1000;
        if (isActive) {
            timeDiff = intl.formatRelative(new Date(endPeriod * 1000));
        }
        const canCollect = isOwnEntry ? canClaim.get(entryId) : canClaimVote.get(entryId);
        const loading = isOwnEntry ? pendingClaim.get(entryId) : pendingClaimVote.get(entryId);

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
              {!isActive &&
                <Button
                  disabled={loading}
                  loading={loading}
                  onClick={onCollect}
                  size="small"
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.collect)}
                </Button>
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

    return (
      <div className="claimable-list">
        <div className="flex-center-y claimable-list__title">
          {intl.formatMessage(profileMessages.collectEssence)}
          <span className="flex-center claimable-list__counter">{entries.size}</span>
        </div>
        <div className="claimable-list__list-wrapper">
          <div className="claimable-list__list">
            {entries.toList().map(renderRow)}
          </div>
        </div>
      </div>
    );
};

ClaimableList.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    canClaim: PropTypes.shape().isRequired,
    canClaimVote: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryBalance: PropTypes.shape().isRequired,
    entryVotes: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
    pendingClaim: PropTypes.shape().isRequired,
    pendingClaimVote: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        canClaim: state.entryState.get('canClaim'),
        canClaimVote: state.entryState.get('canClaimVote'),
        entries: selectClaimableEntries(state),
        entryBalance: state.entryState.get('balance'),
        entryVotes: state.entryState.get('votes'),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingClaim: selectPendingClaims(state),
        pendingClaimVote: selectPendingClaimVotes(state)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd
    },
    null,
    { pure: false }
)(injectIntl(ClaimableList));
