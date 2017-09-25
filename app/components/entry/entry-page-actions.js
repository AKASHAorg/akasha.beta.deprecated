import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { EntryVotesPanel } from 'shared-components';
import * as actionTypes from '../../constants/action-types';
import { ListPopover, VotePopover } from '../';
import { ToolbarEthereum } from '../svg';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { listAdd, listDelete, listSearch, listToggleEntry } from '../../local-flux/actions/list-actions';
import { selectEntryBalance, selectEntryCanClaim, selectEntryVote, selectLists, selectListSearch,
    selectLoggedAkashaId, selectPendingEntryClaim, selectPendingEntryVote,
    selectProfile } from '../../local-flux/selectors';
import { entryMessages } from '../../locale-data/messages';

class EntryPageAction extends Component {
    state = {
        showVotes: false
    };

    openVotesPanel = () => {
        this.setState({
            showVotes: true
        });
    };

    closeVotesPanel = () => {
        this.setState({
            showVotes: false
        });
    };

    handleVote = ({ type, value, weight }) => {
        const { entry, loggedAkashaId, publisher } = this.props;
        const payload = {
            entryId: entry.entryId,
            entryTitle: entry.content.title,
            publisherAkashaId: publisher && publisher.get('akashaId'),
            value,
            weight
        };
        this.props.actionAdd(loggedAkashaId, type, payload);
    };

    handleClaim = () => {
        const { canClaim, entry, loggedAkashaId } = this.props;
        if (!canClaim) {
            return;
        }
        const payload = {
            entryTitle: entry.content.title,
            entryId: entry.entryId
        };
        this.props.actionAdd(loggedAkashaId, actionTypes.claim, payload);
    };

    render () {
        const { canClaim, canClaimPending, claimPending, containerRef, entry, entryBalance,
            fetchingEntryBalance, intl, isOwnEntry, lists, listSearchKeyword,
            votePending, voteWeight } = this.props;
        const showBalance = isOwnEntry && (!canClaimPending || canClaim !== undefined)
            && (!fetchingEntryBalance || entryBalance !== undefined);
        const voteIconClass = 'entry-actions__vote-icon';
        const claimIconClass = classNames('entry-actions__claim-icon', {
            disabled: claimPending,
            'entry-actions__claim-icon_claimed': !canClaim,
            'content-link': canClaim
        });
        const voteProps = { containerRef, iconClassName: voteIconClass, votePending, voteWeight };
        const upvotePercent = 70;
        const downvotePercent = 30;
        const votePercentTooltip = intl.formatMessage(entryMessages.votePercentage, {
            downvote: downvotePercent,
            upvote: upvotePercent
        });

        return (
          <div className="entry-actions">
            <div className="flex-center-y">
              <div>
                <div className="flex-center-y">
                  <div className="flex-center entry-actions__vote-wrapper">
                    <VotePopover
                      onSubmit={this.handleVote}
                      type={actionTypes.entryUpvote}
                      {...voteProps}
                    />
                    {voteWeight > 0 &&
                      <div className="entry-actions__existing-vote entry-actions__existing-vote_upvote">
                        +{voteWeight}
                      </div>
                    }
                  </div>
                  <div className="flex-center entry-actions__score">
                    <span className="content-link" onClick={this.openVotesPanel}>
                      {entry.score}
                    </span>
                  </div>
                  <div className="flex-center entry-actions__vote-wrapper">
                    <VotePopover
                      onSubmit={this.handleVote}
                      type={actionTypes.entryDownvote}
                      {...voteProps}
                    />
                    {voteWeight < 0 &&
                      <div className="entry-actions__existing-vote entry-actions__existing-vote_downvote">
                        {voteWeight}
                      </div>
                    }
                  </div>
                </div>
                <Tooltip placement="left" title={votePercentTooltip}>
                  <div className="flex-center-y entry-actions__vote-bar">
                    <div className="entry-actions__upvote-bar" style={{ width: `${upvotePercent}%` }} />
                    <div className="entry-actions__downvote-bar" style={{ width: `${downvotePercent}%` }} />
                  </div>
                </Tooltip>
              </div>
              <div className="entry-actions__right-actions">
                {!isOwnEntry &&
                  <ListPopover
                    containerRef={containerRef}
                    entryId={entry.entryId}
                    listAdd={this.props.listAdd}
                    listDelete={this.props.listDelete}
                    lists={lists}
                    listSearch={this.props.listSearch}
                    listToggleEntry={this.props.listToggleEntry}
                    search={listSearchKeyword}
                  />
                }
                {showBalance &&
                  <div className="entry-actions__balance-container">
                    {!entry.active &&
                      <Tooltip
                        title={!canClaim ?
                            intl.formatMessage(entryMessages.alreadyClaimed) :
                            intl.formatMessage(entryMessages.claim)
                        }
                      >
                        <svg className={claimIconClass} onClick={this.handleClaim} viewBox="0 0 16 16">
                          <ToolbarEthereum />
                        </svg>
                      </Tooltip>
                    }
                    {entryBalance !== 'claimed' &&
                      <div className="entry-actions__balance">
                        {entryBalance} AETH
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
            {this.state.showVotes &&
              <EntryVotesPanel
                closeVotesPanel={this.closeVotesPanel}
                entryId={entry.entryId}
                entryTitle={entry.content.title}
              />
            }
          </div>
        );
    }
}

EntryPageAction.defaultProps = {
    voteWeight: 0
};

EntryPageAction.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    canClaim: PropTypes.bool,
    canClaimPending: PropTypes.bool,
    claimPending: PropTypes.bool,
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape().isRequired,
    entryBalance: PropTypes.string,
    fetchingEntryBalance: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    isOwnEntry: PropTypes.bool,
    listAdd: PropTypes.func.isRequired,
    listDelete: PropTypes.func.isRequired,
    lists: PropTypes.shape().isRequired,
    listSearch: PropTypes.func.isRequired,
    listSearchKeyword: PropTypes.string,
    listToggleEntry: PropTypes.func.isRequired,
    loggedAkashaId: PropTypes.string,
    publisher: PropTypes.shape(),
    votePending: PropTypes.bool,
    voteWeight: PropTypes.number,
};

function mapStateToProps (state, ownProps) {
    const entry = ownProps.entry;
    const loggedAkashaId = selectLoggedAkashaId(state);
    return {
        canClaim: selectEntryCanClaim(state, entry.get('entryId')),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending: selectPendingEntryClaim(state, entry.get('entryId')),
        entryBalance: selectEntryBalance(state, entry.get('entryId')),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        isOwnEntry: loggedAkashaId === entry.getIn(['entryEth', 'publisher']),
        lists: selectLists(state),
        listSearchKeyword: selectListSearch(state),
        loggedAkashaId,
        publisher: selectProfile(state, entry.getIn(['entryEth', 'publisher'])),
        votePending: selectPendingEntryVote(state, entry.get('entryId')),
        voteWeight: selectEntryVote(state, entry.get('entryId'))
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        listAdd,
        listDelete,
        listSearch,
        listToggleEntry,
    }
)(injectIntl(EntryPageAction));
