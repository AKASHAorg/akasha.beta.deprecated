import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { CardActions, FlatButton, IconButton, SvgIcon } from 'material-ui';
import { EntryVotesPanel } from 'shared-components';
import * as actionTypes from '../../constants/action-types';
import { ListPopover, VotePopover } from '../';
import { ToolbarEthereum } from '../svg';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { listAdd, listDelete, listSearch, listUpdateEntryIds } from '../../local-flux/actions/list-actions';
import { selectEntryBalance, selectEntryCanClaim, selectEntryVote, selectLists, selectListSearch,
    selectLoggedAkashaId, selectProfile } from '../../local-flux/selectors';
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

    render () { // eslint-disable-line complexity
        const { balance, canClaim, canClaimPending, claimPending, containerRef, entry, entryBalance,
            fetchingEntryBalance, intl, isOwnEntry, lists, listSearchKeyword, updatingLists,
            voteCost, votePending, voteWeight } = this.props;
        const { palette } = this.context.muiTheme;
        const showBalance = isOwnEntry && (!canClaimPending || canClaim !== undefined)
            && (!fetchingEntryBalance || entryBalance !== undefined);
        const existingVoteStyle = {
            position: 'absolute',
            top: '-14px',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '12px',
            cursor: 'default'
        };

        return (
          <CardActions style={{ padding: '18px 8px 0px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }} >
              <div className="flex-center" style={{ position: 'relative' }}>
                <VotePopover
                  balance={balance}
                  entry={entry}
                  onSubmit={this.handleVote}
                  type={actionTypes.upvote}
                  voteCost={voteCost}
                  votePending={votePending}
                  voteWeight={voteWeight}
                />
                {voteWeight > 0 &&
                  <div
                    style={Object.assign({}, existingVoteStyle, { color: palette.accent3Color })}
                  >
                    +{voteWeight}
                  </div>
                }
              </div>
              <div
                className="flex-center"
                style={{ minWidth: '40px', fontSize: '18px', padding: '0 5px', letterSpacing: '2px' }}
              >
                <span
                  className="content-link"
                  onClick={this.openVotesPanel}
                  style={{ borderRadius: '6px' }}
                >
                  {entry.score}
                </span>
              </div>
              <div className="flex-center" style={{ position: 'relative' }}>
                <VotePopover
                  balance={balance}
                  entry={entry}
                  onSubmit={this.handleVote}
                  type={actionTypes.downvote}
                  voteCost={voteCost}
                  votePending={votePending}
                  voteWeight={voteWeight}
                />
                {voteWeight < 0 &&
                  <div
                    style={Object.assign({}, existingVoteStyle, { color: palette.accent1Color })}
                  >
                    {voteWeight}
                  </div>
                }
              </div>
              <div style={{ flex: '1 1 auto', textAlign: 'right' }}>
                {!isOwnEntry &&
                  <ListPopover
                    containerRef={containerRef}
                    entryId={entry.entryId}
                    listAdd={this.props.listAdd}
                    listDelete={this.props.listDelete}
                    lists={lists}
                    listSearch={this.props.listSearch}
                    listUpdateEntryIds={this.props.listUpdateEntryIds}
                    search={listSearchKeyword}
                    updatingLists={updatingLists}
                  />
                }
                {showBalance &&
                  <div
                    style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                  >
                    {!entry.active &&
                      <div
                        data-tip={!canClaim ?
                            intl.formatMessage(entryMessages.alreadyClaimed) :
                            intl.formatMessage(entryMessages.claim)
                        }
                      >
                        <IconButton
                          onTouchTap={this.handleClaim}
                          iconStyle={{
                              width: '24px',
                              height: '24px',
                              fill: !canClaim ? palette.accent3Color : 'currentColor'
                          }}
                          disabled={claimPending}
                        >
                          <SvgIcon viewBox="0 0 16 16">
                            <ToolbarEthereum />
                          </SvgIcon>
                        </IconButton>
                      </div>
                    }
                    {entryBalance !== 'claimed' &&
                      <div style={{ fontSize: '16px', paddingRight: '5px' }}>
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
          </CardActions>
        );
    }
}

EntryPageAction.contextTypes = {
    muiTheme: PropTypes.shape()
};

EntryPageAction.defaultProps = {
    voteWeight: 0
};

EntryPageAction.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    balance: PropTypes.string,
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
    listUpdateEntryIds: PropTypes.func.isRequired,
    loggedAkashaId: PropTypes.string,
    publisher: PropTypes.shape(),
    updatingLists: PropTypes.bool,
    voteCost: PropTypes.shape().isRequired,
    votePending: PropTypes.bool,
    voteWeight: PropTypes.number,
};

function mapStateToProps (state, ownProps) {
    const entry = ownProps.entry;
    const claimPending = state.entryState.getIn(['flags', 'claimPending', entry.get('entryId')]);
    const votePending = state.entryState.getIn(['flags', 'votePending', entry.get('entryId')]);
    const loggedAkashaId = selectLoggedAkashaId(state);
    return {
        balance: state.profileState.get('balance'),
        canClaim: selectEntryCanClaim(state, entry.get('entryId')),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending,
        entryBalance: selectEntryBalance(state, entry.get('entryId')),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        isOwnEntry: loggedAkashaId === entry.getIn(['entryEth', 'publisher']),
        lists: selectLists(state),
        listSearchKeyword: selectListSearch(state),
        loggedAkashaId,
        publisher: selectProfile(state, entry.getIn(['entryEth', 'publisher'])),
        updatingLists: state.listState.getIn(['flags', 'updatingLists']),
        voteCost: state.entryState.get('voteCostByWeight'),
        votePending,
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
        listUpdateEntryIds,
    }
)(injectIntl(EntryPageAction));
