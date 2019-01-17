import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'react-router-dom/Link';
import { injectIntl } from 'react-intl';
import { Spin, Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../../constants/action-types';
import { Icon, ListPopover, ShareLinkModal, VotesModal, VotePopover } from '../';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { listAdd, listDelete, listSearch, listToggleEntry } from '../../local-flux/actions/list-actions';
import { actionSelectors, entrySelectors, externalProcessSelectors, listSelectors, searchSelectors,
  profileSelectors } from '../../local-flux/selectors';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';
import { addPrefix } from '../../utils/url-utils';

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

    handleClaimVote = () => {
        const { canClaimVote, entry, loggedEthAddress } = this.props;
        if (!canClaimVote) {
            return;
        }
        const payload = {
            entryTitle: entry.content.title,
            entryId: entry.entryId
        };
        this.props.actionAdd(loggedEthAddress, actionTypes.claimVote, payload);
    };

    renderShareIcon = () => {
        const { entry } = this.props;
        const url = addPrefix(`/${entry.author.ethAddress || '0x0'}/${entry.entryId}`);

        return (
          <ShareLinkModal url={url} />
        );
    }

    renderVotesModal = () => {
        const { blockNr, entry } = this.props;
        return (
          <VotesModal
            closeVotesPanel={this.closeVotesPanel}
            content={entry}
            contentTitle={entry.content.title}
            blockNr={blockNr}
          />
        );
    };

    renderOwnEntryActions = () => { // eslint-disable-line complexity
        const { canClaim, claimPending, containerRef, entry, entryBalance, intl, isFullEntry,
            lists, listsAll, listSearchKeyword } = this.props;
        const balance = entryBalance && balanceToNumber(entryBalance.get('totalKarma'));
        const isClaimed = entryBalance && entryBalance.get('claimed');
        const endPeriod = new Date(entry.get('endPeriod') * 1000);
        const claimDisabled = !canClaim || !balance;
        const infoClass = classNames('entry-actions__info', {
            'entry-actions__info_full': isFullEntry
        });
        const infoTextClass = classNames('entry-actions__info-text', {
            'entry-actions__info-text_can-claim': !claimDisabled,
            'entry-actions__info-text_cannot-claim': claimDisabled && !this.isActive() && !isClaimed,
        });
        const collectClass = classNames('entry-actions__collect-button', {
            'content-link': !claimDisabled && !claimPending,
            'entry-actions__collect-button_disabled': claimDisabled || claimPending
        });
        return (
          <div className="flex-center-y entry-actions entry-actions_own-entry">
            <div className={infoClass}>
              <div className={infoTextClass}>
                <span className="content-link" onClick={this.openVotesPanel}>
                  {entry.score} {intl.formatMessage(entryMessages.score)}
                </span>
                <span className="entry-actions__separator">|</span>
                {balance} {intl.formatMessage(generalMessages.essence)}
              </div>
              <div>
                {isClaimed &&
                  <span className="entry-actions__collected">
                    {intl.formatMessage(entryMessages.collected)}
                  </span>
                }
                {!this.isActive() && !isClaimed &&
                  <div className="flex-center-y">
                    {claimPending && <Spin size="small" style={{ marginRight: '5px' }} />}
                    <span
                      className={collectClass}
                      onClick={!claimDisabled && !claimPending ? this.handleClaim : undefined}
                    >
                      {intl.formatMessage(entryMessages.collectEssence)}
                    </span>
                    {claimDisabled &&
                      <Tooltip
                        getPopupContainer={() => containerRef || document.body}
                        title={balance ?
                            intl.formatMessage(entryMessages.cannotClaimEntry) :
                            intl.formatMessage(entryMessages.nothingToCollect)
                        }
                      >
                        <Icon
                          className="question-circle-icon entry-actions__info-icon"
                          type="questionCircle"
                        />
                      </Tooltip>
                    }
                  </div>
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
                        pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.get('entryId')}`,
                        state: { overlay: true }
                    }}
                  >
                    <span className="entry-actions__comments-counter">
                      {entry.get('commentsCount')}
                    </span>
                    <Icon className="entry-actions__comment-icon" type="commentLarge" />
                  </Link>
                </div>
              }
              <ListPopover
                authorEthAddress={entry.author.ethAddress}
                containerRef={containerRef}
                entryId={entry.entryId}
                entryType={entry.getIn(['content', 'entryType'])}
                listAdd={this.props.listAdd}
                listDelete={this.props.listDelete}
                lists={lists}
                listsAll={listsAll}
                listSearch={this.props.listSearch}
                listToggleEntry={this.props.listToggleEntry}
                search={listSearchKeyword}
              />
              {this.renderShareIcon()}
            </div>
            {this.state.showVotes && this.renderVotesModal()}
          </div>
        );
    };

    renderCollectEntryVote = () => { // eslint-disable-line complexity
        const { canClaimVote, claimVotePending, containerRef, entry, intl, isFullEntry, vote } = this.props;
        const balance = vote && balanceToNumber(vote.get('essence'));
        const isVoteClaimed = vote && vote.get('claimed');
        const endPeriod = new Date(entry.get('endPeriod') * 1000);
        const claimDisabled = !canClaimVote || !balance;
        const infoClass = classNames('entry-actions__info', {
            'entry-actions__info_full': isFullEntry
        });
        const infoTextClass = classNames('entry-actions__info-text', {
            'entry-actions__info-text_can-claim': !claimDisabled,
            'entry-actions__info-text_cannot-claim': claimDisabled && !this.isActive() && !isVoteClaimed,
        });
        const collectClass = classNames('entry-actions__collect-button', {
            'content-link': !claimDisabled && !claimVotePending,
            'entry-actions__collect-button_disabled': claimDisabled || claimVotePending
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
                <div>
                  {claimVotePending && <Spin size="small" style={{ marginRight: '5px' }} />}
                  <span
                    className={collectClass}
                    onClick={!claimDisabled && !claimVotePending ? this.handleClaimVote : undefined}
                  >
                    {intl.formatMessage(entryMessages.collectEssence)}
                  </span>
                  {claimDisabled &&
                    <Tooltip
                      getPopupContainer={() => containerRef || document.body}
                      title={balance ?
                          intl.formatMessage(entryMessages.cannotClaimVote) :
                          intl.formatMessage(entryMessages.nothingToCollect)
                      }
                    >
                      <Icon className="question-circle-icon entry-actions__info-icon" type="questionCircle" />
                    </Tooltip>
                  }
                </div>
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

    render () { // eslint-disable-line complexity
        const { containerRef, entry, intl, isFullEntry, isOwnEntry, lists,
            listsAll, listSearchKeyword, votePending, vote } = this.props;
        if (isOwnEntry) {
            return this.renderOwnEntryActions();
        }
        const iconClassName = 'entry-actions__vote-icon';
        const voteWeight = vote && vote.get('vote');
        const voteProps = {
            containerRef, iconClassName, isOwnEntity: isOwnEntry, votePending, vote: voteWeight
        };
        const upvoteRatio = entry.get('upvoteRatio');
        let upvotePercent = 0;
        let downvotePercent = 0;

        if (upvoteRatio && parseFloat(upvoteRatio, 10) >= 0) {
            upvotePercent = 100 * upvoteRatio;
            downvotePercent = 100 - upvotePercent;
        }

        const votePercentTooltip = intl.formatMessage(entryMessages.votePercentage, {
            downvote: downvotePercent && downvotePercent.toFixed(0),
            upvote: upvotePercent && upvotePercent.toFixed(0)
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
                </div>
                {isFullEntry &&
                <Tooltip placement="left" title={votePercentTooltip}>
                  <div className={
                    `flex-center-y
                    entry-actions__vote-bar
                    entry-actions__vote-bar${(upvotePercent || downvotePercent) ? '' : '_disabled'}`}
                  >
                    <div className="entry-actions__upvote-bar" style={{ width: `${upvotePercent}%` }} />
                    <div className="entry-actions__downvote-bar" style={{ width: `${downvotePercent}%` }} />
                  </div>
                </Tooltip>
                }
              </div>
              <div className="entry-actions__right-actions">
                {!isFullEntry &&
                  <div className="content-link entry-actions__comments">
                    <Link
                      className="unstyled-link"
                      to={{
                          pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.get('entryId')}`,
                          state: { overlay: true }
                      }}
                    >
                      <div className="content-link flex-center-y">
                        <span className="entry-actions__comments-counter">
                          {entry.get('commentsCount')}
                        </span>
                        <Icon className="entry-actions__comment-icon" type="commentLarge" />
                      </div>
                    </Link>
                    </div>
                  }
                <ListPopover
                  authorEthAddress={entry.author.ethAddress}
                  containerRef={containerRef}
                  entryId={entry.entryId}
                  entryType={entry.content.entryType}
                  listAdd={this.props.listAdd}
                  listDelete={this.props.listDelete}
                  lists={lists}
                  listsAll={listsAll}
                  listSearch={this.props.listSearch}
                  listToggleEntry={this.props.listToggleEntry}
                  search={listSearchKeyword}
                />
                {this.renderShareIcon()}
              </div>
            </div>
            {vote && vote.get('vote') !== '0' && this.renderCollectEntryVote()}
            {vote && vote.get('vote') === '0' && !this.isActive() &&
              <div className="entry-actions__info">
                <span className="entry-actions__info-text">
                  {intl.formatMessage(entryMessages.votingPeriod)}
                  <Tooltip title={intl.formatMessage(entryMessages.votingPeriodDisclaimer)}>
                    <Icon className="question-circle-icon entry-actions__info-icon" type="questionCircle" />
                  </Tooltip>
                </span>
              </div>
            }
            {this.state.showVotes && this.renderVotesModal()}
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
    const loggedEthAddress = profileSelectors.selectLoggedEthAddress(state);
    return {
        author: profileSelectors.selectProfileByEthAddress(state, entry.getIn(['author', 'ethAddress'])),
        blockNr: externalProcessSelectors.getCurrentBlockNumber(state),
        canClaim: entrySelectors.selectEntryCanClaim(state, entry.get('entryId')),
        canClaimVote: entrySelectors.selectEntryCanClaimVote(state, entry.get('entryId')),
        claimPending: actionSelectors.getClaimIsPending(state),
        claimVotePending: actionSelectors.getPendingClaimVote(state),
        entryBalance: entrySelectors.selectEntryBalance(state, entry.get('entryId')),
        isOwnEntry: loggedEthAddress === entrySelectors.getEntryAuthorEthAddress(state),
        lists: listSelectors.getLists(state),
        listsAll: listSelectors.selectLists(state),
        listSearchKeyword: listSelectors.selectListSearchTerm(state),
        loggedEthAddress,
        votePending: actionSelectors.getVoteIsPending(state, entry.get('entryId')),
        vote: entrySelectors.selectEntryVote(state, entry.get('entryId'))
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
