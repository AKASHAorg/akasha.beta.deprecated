import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Icon, Spin, Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../../constants/action-types';
import { VotesModal, ListPopover, VotePopover } from '../';
import { ToolbarEthereum } from '../svg';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { listAdd, listDelete, listSearch, listToggleEntry } from '../../local-flux/actions/list-actions';
import { selectBlockNumber, selectEntryBalance, selectEntryCanClaim, selectEntryCanClaimVote, selectEntryVote,
    selectLists, selectListsAll, selectListSearch, selectLoggedEthAddress, selectPendingClaim,
    selectPendingClaimVote, selectPendingVote, selectProfile } from '../../local-flux/selectors';
import { entryMessages, generalMessages } from '../../locale-data/messages';

class EntryPageAction extends Component {
    state = {
        showVotes: false
    };

    isActive = () => {
        const { entry } = this.props;
        return entry.endPeriod && entry.endPeriod * 1000 > Date.now();
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

    renderOwnEntryActions = () => {
        const { canClaim, claimPending, containerRef, entry, entryBalance, intl, isFullEntry,
            lists, listSearchKeyword } = this.props;
        const balance = entryBalance && entryBalance.get('totalKarma');
        const isClaimed = entryBalance && entryBalance.get('claimed');
        const endPeriod = new Date(entry.get('endPeriod') * 1000);
        const infoClass = classNames('entry-actions__info', {
            'entry-actions__info_full': isFullEntry
        });
        const infoTextClass = classNames('entry-actions__info-text', {
            'entry-actions__info-text_can-claim': canClaim,
            'entry-actions__info-text_cannot-claim': !canClaim && !this.isActive() && !isClaimed,
        });
        const collectClass = classNames('entry-actions__collect-button', {
            'content-link': canClaim && !claimPending,
            'entry-actions__collect-button_disabled': !canClaim || claimPending
        });
        return (
          <div className="flex-center-y entry-actions entry-actions_own-entry">
            <div className={infoClass}>
              <div className={infoTextClass}>
                {entry.score} {intl.formatMessage(entryMessages.score)}
                <span className="entry-actions__separator">|</span>
                {balance && balance.slice(0, 3)} {intl.formatMessage(generalMessages.essence)}
              </div>
              <div>
                {isClaimed &&
                  <span className="entry-actions__collected">
                    {intl.formatMessage(entryMessages.collected)}
                  </span>
                }
                {!this.isActive() && !isClaimed &&
                  <span
                    className={collectClass}
                    onClick={canClaim && !claimPending ? this.handleClaim : undefined}
                  >
                    {claimPending && <Spin size="small" />}
                    <span>{intl.formatMessage(entryMessages.collectEssence)}</span>
                  </span>
                }
                {this.isActive() &&
                  <span className="entry-actions__collect-in">
                    {intl.formatMessage(entryMessages.collectEssence)}
                    {' '}
                    {intl.formatRelative(endPeriod)}
                  </span>
                }
              </div>
            </div>
            <div className="flex-center-y entry-actions__actions">
              {!isFullEntry &&
                <div className="content-link entry-actions__comments">
                  <Link
                    className="flex-center-y unstyled-link"
                    to={{
                        pathname: `/${entry.getIn(['author', 'ethAddress'])}/${entry.get('entryId')}`,
                        state: { overlay: true }
                    }}
                  >
                    <span className="entry-actions__comments-counter">
                      {entry.get('commentsCount')}
                    </span>
                    <Icon type="message" />
                  </Link>
                </div>
              }
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
            </div>
          </div>
        );
    };

    renderCollectEntryVote = () => {
        const { canClaimVote, claimVotePending, entry, intl, isFullEntry, vote } = this.props;
        const weight = vote && vote.get('vote');
        // TODO implement
        const balance = weight && Math.abs(Number(weight));
        // TODO implement
        const isVoteClaimed = false;
        const endPeriod = new Date(entry.get('endPeriod') * 1000);
        const infoClass = classNames('entry-actions__info', {
            'entry-actions__info_full': isFullEntry
        });
        const infoTextClass = classNames('entry-actions__info-text', {
            'entry-actions__info-text_can-claim': canClaimVote,
            'entry-actions__info-text_cannot-claim': !canClaimVote && !this.isActive() && !isVoteClaimed,
        });
        const collectClass = classNames('entry-actions__collect-button', {
            'content-link': canClaimVote && !claimVotePending,
            'entry-actions__collect-button_disabled': !canClaimVote || claimVotePending
        });
        return (
          <div className={infoClass}>
            <div className={infoTextClass}>
              {balance} {intl.formatMessage(generalMessages.essence)}
            </div>
            <div>
              {isVoteClaimed &&
                <span className="entry-actions__collected">
                  {intl.formatMessage(entryMessages.collected)}
                </span>
              }
              {!this.isActive() && !isVoteClaimed &&
                <span
                  className={collectClass}
                  onClick={canClaimVote && !claimVotePending ? this.handleClaimVote : undefined}
                >
                  {claimVotePending && <Spin size="small" />}
                  <span>{intl.formatMessage(entryMessages.collectEssence)}</span>
                </span>
              }
              {this.isActive() &&
                <span className="entry-actions__collect-in">
                  {intl.formatMessage(entryMessages.collectEssence)}
                  {' '}
                  {intl.formatRelative(endPeriod)}
                </span>
              }
            </div>
          </div>
        );
    };

    render () {
        const { blockNr, canClaim, claimPending, containerRef, entry, entryBalance, intl,
            isFullEntry, isOwnEntry, lists, listsAll, listSearchKeyword, votePending, vote } = this.props;
        if (isOwnEntry) {
            return this.renderOwnEntryActions();
        }
        const showBalance = isOwnEntry && entryBalance && canClaim !== undefined;
        const alreadyClaimed = entryBalance && entryBalance.get('claimed');
        const iconClassName = 'entry-actions__vote-icon';
        const claimIconClass = showBalance && classNames('entry-actions__claim-icon', {
            disabled: claimPending || alreadyClaimed,
            'entry-actions__claim-icon_claimed': entryBalance.get('claimed'),
            'content-link': canClaim
        });
        if (!vote) {
            console.log('vote not found for', entry.entryId);
        }
        const voteWeight = vote && vote.get('vote');
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
                  </div>
                  {!isFullEntry &&
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
                {isFullEntry &&
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
                    listsAll={listsAll}
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
            {vote && vote.get('vote') !== '0' && this.renderCollectEntryVote()}
            {vote && vote.get('vote') === '0' && !this.isActive() &&
              <div className="entry-actions__info">
                <span className="entry-actions__info-text">
                  {intl.formatMessage(entryMessages.votingPeriod)}
                  <Tooltip title={intl.formatMessage(entryMessages.votingPeriodDisclaimer)}>
                    <Icon className="entry-actions__info-icon" type="question-circle" />
                  </Tooltip>
                </span>
              </div>
            }
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
    canClaimVote: PropTypes.bool,
    claimPending: PropTypes.bool,
    claimVotePending: PropTypes.bool,
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape().isRequired,
    entryBalance: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    isFullEntry: PropTypes.bool,
    isOwnEntry: PropTypes.bool,
    listAdd: PropTypes.func.isRequired,
    listsAll: PropTypes.shape().isRequired,
    listDelete: PropTypes.func.isRequired,
    lists: PropTypes.shape().isRequired,
    listSearch: PropTypes.func.isRequired,
    listSearchKeyword: PropTypes.string,
    listToggleEntry: PropTypes.func.isRequired,
    loggedEthAddress: PropTypes.string,
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
        canClaimVote: selectEntryCanClaimVote(state, entry.get('entryId')),
        claimPending: selectPendingClaim(state, entry.get('entryId')),
        claimVotePending: selectPendingClaimVote(state, entry.get('entryId')),
        entryBalance: selectEntryBalance(state, entry.get('entryId')),
        isOwnEntry: loggedEthAddress === entry.getIn(['author', 'ethAddress']),
        lists: selectLists(state),
        listsAll: selectListsAll(state),
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
