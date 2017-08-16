import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { CardActions, FlatButton, IconButton, SvgIcon } from 'material-ui';
import { EntryVotesPanel } from 'shared-components';
import * as actionTypes from '../../constants/action-types';
import { EntryBookmarkOn, EntryBookmarkOff, EntryDownvote, EntryUpvote,
    ToolbarEthereum } from '../svg';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectEntryBalance, selectEntryCanClaim, selectEntryVote, selectLoggedAkashaId,
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

    handleUpvote = () => {
        const { entry, loggedAkashaId, publisher } = this.props;
        const payload = {
            publisherAkashaId: publisher && publisher.get('akashaId'),
            entryTitle: entry.content.title,
            entryId: entry.entryId
        };
        this.props.actionAdd(loggedAkashaId, actionTypes.upvote, payload);
    };

    handleDownvote = () => {
        const { entry, loggedAkashaId, publisher } = this.props;
        const payload = {
            publisherAkashaId: publisher && publisher.get('akashaId'),
            entryTitle: entry.content.title,
            entryId: entry.entryId
        };
        this.props.actionAdd(loggedAkashaId, actionTypes.downvote, payload);
    };

    // handleBookmark = () => {
    //     const { entry, entryActions, loggedProfile, savedEntries } = this.props;
    //     const loggedAkashaId = loggedProfile.get('akashaId');
    //     const isSaved = !!savedEntries.find(id => id === entry.entryId);

    //     if (isSaved) {
    //         entryActions.deleteEntry(loggedAkashaId, entry.entryId);
    //         entryActions.moreSavedEntriesList(1);
    //     } else {
    //         entryActions.saveEntry(loggedAkashaId, entry.entryId);
    //     }
    // };

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
        const { balance, canClaim, canClaimPending, claimPending, entry, fetchingEntryBalance,
            intl, isOwnEntry, isSaved, votePending, voteWeight } = this.props;
        const { palette } = this.context.muiTheme;
        const upvoteIconColor = voteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = voteWeight < 0 ? palette.accent1Color : '';
        const voteButtonsDisabled = !entry.active || voteWeight !== 0 || votePending;
        const showBalance = isOwnEntry && (!canClaimPending || canClaim !== undefined)
            && (!fetchingEntryBalance || balance !== undefined);
        const existingVoteStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '12px',
        };
        return (
          <CardActions style={{ padding: '18px 8px 0px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }} >
              <div style={{ position: 'relative' }}>
                <div
                  data-tip={entry.get('active') ?
                      intl.formatMessage(entryMessages.upvote) :
                      intl.formatMessage(entryMessages.votingExpired)
                  }
                >
                  <IconButton
                    onTouchTap={this.handleUpvote}
                    iconStyle={{ width: '24px', height: '24px' }}
                    disabled={voteButtonsDisabled}
                  >
                    <SvgIcon viewBox="0 0 20 20" >
                      <EntryUpvote fill={upvoteIconColor} />
                    </SvgIcon>
                  </IconButton>
                </div>
                {voteWeight > 0 &&
                  <div
                    style={Object.assign({}, existingVoteStyle, { color: palette.accent3Color })}
                  >
                    +{voteWeight}
                  </div>
                }
              </div>
              <div style={{ fontSize: '18px', padding: '0 15px', letterSpacing: '2px' }}>
                <FlatButton
                  label={entry.score}
                  onClick={this.openVotesPanel}
                  style={{ minWidth: '10px', borderRadius: '6px' }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <div data-tip={entry.get('active') ? 'Downvote' : 'Voting period has ended'}>
                  <IconButton
                    onTouchTap={this.handleDownvote}
                    iconStyle={{ width: '24px', height: '24px' }}
                    disabled={voteButtonsDisabled}
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      <EntryDownvote fill={downvoteIconColor} />
                    </SvgIcon>
                  </IconButton>
                </div>
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
                  <div data-tip="Bookmark" style={{ display: 'inline-block' }}>
                    <IconButton iconStyle={{ width: '24px', height: '24px' }}>
                      <SvgIcon viewBox="0 0 20 20">
                        {isSaved ?
                          <EntryBookmarkOn /> :
                          <EntryBookmarkOff />
                        }
                      </SvgIcon>
                    </IconButton>
                  </div>
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
                    {balance !== 'claimed' &&
                      <div style={{ fontSize: '16px', paddingRight: '5px' }}>
                        {balance} AETH
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
    entry: PropTypes.shape().isRequired,
    fetchingEntryBalance: PropTypes.bool,
    intl: PropTypes.shape(),
    isOwnEntry: PropTypes.bool,
    isSaved: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    publisher: PropTypes.shape(),
    votePending: PropTypes.bool,
    voteWeight: PropTypes.number,
};

function mapStateToProps (state, ownProps) {
    const entry = ownProps.entry;
    const claimPending = state.entryState.getIn(['flags', 'claimPending', entry.get('entryId')]);
    const votePending = state.entryState.getIn(['flags', 'votePending', entry.get('entryId')]);
    const loggedAkashaId = selectLoggedAkashaId(state);
    return {
        balance: selectEntryBalance(state, entry.get('entryId')),
        canClaim: selectEntryCanClaim(state, entry.get('entryId')),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending,
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        isOwnEntry: loggedAkashaId === entry.getIn(['entryEth', 'publisher']),
        isSaved: !!state.entryState
            .get('savedEntries')
            .find(entr => entr.get('entryId') === entry.get('entryId')),
        loggedAkashaId,
        publisher: selectProfile(state, entry.getIn(['entryEth', 'publisher'])),
        votePending,
        voteWeight: selectEntryVote(state, entry.get('entryId'))
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
    }
)(injectIntl(EntryPageAction));
