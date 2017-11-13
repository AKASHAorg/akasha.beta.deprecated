import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../../constants/action-types';
import { VotesModal, ListPopover, VotePopover } from '../';
import { ToolbarEthereum } from '../svg';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { listAdd, listDelete, listSearch, listToggleEntry } from '../../local-flux/actions/list-actions';
import { selectBlockNumber, selectEntryBalance, selectEntryCanClaim, selectEntryVote, selectLists,
    selectListSearch, selectLoggedEthAddress, selectPendingClaim, selectPendingVote,
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
        const { blockNr, canClaim, claimPending, containerRef, entry, entryBalance, intl, isOwnEntry,
            lists, listSearchKeyword, noVotesBar, votePending, vote } = this.props;
        const showBalance = isOwnEntry && entryBalance && canClaim !== undefined;
        const alreadyClaimed = entryBalance && entryBalance.get('claimed');
        const iconClassName = 'entry-actions__vote-icon';
        const claimIconClass = showBalance && classNames('entry-actions__claim-icon', {
            disabled: claimPending || alreadyClaimed,
            'entry-actions__claim-icon_claimed': entryBalance.get('claimed'),
            'content-link': canClaim
        });
        const voteWeight = vote.get('vote');
        const voteProps = {
            containerRef, iconClassName, isOwnEntity: isOwnEntry, votePending, vote: voteWeight
        };
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
                  {noVotesBar &&
                    <Link
                      className="unstyled-link"
                      to={{
                          pathname: `/${entry.getIn(['author', 'ethAddress'])}/${entry.get('entryId')}`,
                          state: { overlay: true }
                      }}
                    >
                      <div className="content-link flex-center-y">
                        <span style={{ fontSize: '18px', marginLeft: '12px', marginRight: '6px' }}>
                          {entry.get('commentsCount')}
                        </span>
                        <Icon type="message" />
                      </div>
                    </Link>
                  }
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
                    authorEthAddress={entry.author.ethAddress}
                    containerRef={containerRef}
                    entryId={entry.entryId}
                    entryType={entry.entryType}
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
                    {!entryBalance.get('claimed') &&
                      <div className="entry-actions__balance">
                        {entryBalance.get('totalKarma')} Essence
                      </div>
                  }
                  </div>
                }
              </div>
            </div>
            {this.state.showVotes &&
              <VotesModal
                closeVotesPanel={this.closeVotesPanel}
                content={entry}
                contentTitle={entry.content.title}
                blockNr={blockNr}
              />
            }
          </div>
        );
    }
}

EntryPageAction.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    author: PropTypes.shape(),
    blockNr: PropTypes.number,
    canClaim: PropTypes.bool,
    claimPending: PropTypes.bool,
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape().isRequired,
    entryBalance: PropTypes.shape(),
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
    vote: PropTypes.shape(),
};

function mapStateToProps (state, ownProps) {
    const entry = ownProps.entry;
    const loggedEthAddress = selectLoggedEthAddress(state);
    return {
        author: selectProfile(state, entry.getIn(['author', 'ethAddress'])),
        blockNr: selectBlockNumber(state),
        canClaim: selectEntryCanClaim(state, entry.get('entryId')),
        claimPending: selectPendingClaim(state, entry.get('entryId')),
        entryBalance: selectEntryBalance(state, entry.get('entryId')),
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
