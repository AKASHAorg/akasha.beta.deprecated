import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../../constants/action-types';
import { EntryVotesModal, ListPopover, VotePopover } from '../';
import { ToolbarEthereum } from '../svg';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { listAdd, listDelete, listSearch, listToggleEntry } from '../../local-flux/actions/list-actions';
import { selectEntryBalance, selectEntryCanClaim, selectEntryVote, selectLists, selectListSearch,
    selectLoggedEthAddress, selectPendingClaim, selectPendingVote,
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

    handleVote = ({ type, weight }) => {
        const { entry, loggedEthAddress } = this.props;
        const payload = {
            entryId: entry.entryId,
            entryTitle: entry.content.title,
            ethAddress: entry.author.ethAddress,
            weight
        };
        this.props.actionAdd(loggedEthAddress, type, payload);
    };

    handleClaim = () => {
        const { canClaim, entry, loggedEthAddress } = this.props;
        if (!canClaim) {
            return;
        }
        const payload = {
            entryTitle: entry.content.title,
            entryId: entry.entryId
        };
        this.props.actionAdd(loggedEthAddress, actionTypes.claim, payload);
    };

    render () {
        const { canClaim, claimPending, containerRef, entry, entryBalance, intl, isOwnEntry,
            lists, listSearchKeyword, noVotesBar, votePending, vote } = this.props;
        const showBalance = isOwnEntry && canClaim !== undefined && entryBalance !== undefined;
        const iconClassName = 'entry-actions__vote-icon';
        const claimIconClass = classNames('entry-actions__claim-icon', {
            disabled: claimPending,
            'entry-actions__claim-icon_claimed': !canClaim,
            'content-link': canClaim
        });
        const voteProps = { containerRef, iconClassName, isOwnEntity: isOwnEntry, votePending, vote };
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
                    {vote > 0 &&
                      <div className="entry-actions__existing-vote entry-actions__existing-vote_upvote">
                        +{vote}
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
                    {vote < 0 &&
                      <div className="entry-actions__existing-vote entry-actions__existing-vote_downvote">
                        {vote}
                      </div>
                    }
                  </div>
                </div>
                {!noVotesBar &&
                  <Tooltip placement="left" title={votePercentTooltip}>
                    <div className="flex-center-y entry-actions__vote-bar">
                      <div className="entry-actions__upvote-bar" style={{ width: `${upvotePercent}%` }} />
                      <div className="entry-actions__downvote-bar" style={{ width: `${downvotePercent}%` }} />
                    </div>
                  </Tooltip>
                }
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
              <EntryVotesModal
                closeVotesPanel={this.closeVotesPanel}
                entryId={entry.entryId}
                entryTitle={entry.content.title}
              />
            }
          </div>
        );
    }
}

EntryPageAction.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    author: PropTypes.shape(),
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
    loggedEthAddress: PropTypes.string,
    noVotesBar: PropTypes.bool,
    votePending: PropTypes.bool,
    vote: PropTypes.string,
};

function mapStateToProps (state, ownProps) {
    const entry = ownProps.entry;
    const loggedEthAddress = selectLoggedEthAddress(state);
    return {
        author: selectProfile(state, entry.getIn(['author', 'ethAddress'])),
        canClaim: selectEntryCanClaim(state, entry.get('entryId')),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending: selectPendingClaim(state, entry.get('entryId')),
        entryBalance: selectEntryBalance(state, entry.get('entryId')),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        isOwnEntry: loggedEthAddress === entry.getIn(['author', 'ethAddress']),
        lists: selectLists(state),
        listSearchKeyword: selectListSearch(state),
        loggedEthAddress,
        votePending: selectPendingVote(state, entry.get('entryId')),
        vote: selectEntryVote(state, entry.get('entryId'))
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
