import React, { Component, PropTypes } from 'react';
import { CardActions, FlatButton, IconButton, SvgIcon } from 'material-ui';
import { EntryVotesPanel } from 'shared-components';
import { EntryBookmarkOn, EntryBookmarkOff, EntryDownvote, EntryUpvote,
    ToolbarEthereum } from 'shared-components/svg';

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

    render () {
        const { canClaimPending, claimPending, entry, fetchingEntryBalance, votePending,
            handleBookmark, handleClaim, handleDownvote, handleUpvote, isOwnEntry,
            isSaved } = this.props;
        const { palette } = this.context.muiTheme;
        const voteWeight = entry.voteWeight || 0;
        const upvoteIconColor = voteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = voteWeight < 0 ? palette.accent1Color : '';
        const voteButtonsDisabled = !entry.active || voteWeight !== 0 || votePending;
        return (
          <CardActions
            className="col-xs-12"
            style={{
                padding: '18px 8px 0px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }} >
              <div style={{ position: 'relative' }}>
                <div data-tip={entry.get('active') ? 'Upvote' : 'Voting period has ended'}>
                  <IconButton
                    onTouchTap={handleUpvote}
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
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        fontSize: '12px',
                        color: palette.accent3Color
                    }}
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
                    onTouchTap={handleDownvote}
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
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        fontSize: '12px',
                        color: palette.accent1Color
                    }}
                  >
                    {voteWeight}
                  </div>
                }
              </div>
              <div style={{ flex: '1 1 auto', textAlign: 'right' }}>
                {!isOwnEntry &&
                  <div data-tip="Bookmark" style={{ display: 'inline-block' }}>
                    <IconButton
                      onTouchTap={handleBookmark}
                      iconStyle={{ width: '24px', height: '24px' }}
                    >
                      <SvgIcon viewBox="0 0 20 20">
                        {isSaved ?
                          <EntryBookmarkOn /> :
                          <EntryBookmarkOff />
                        }
                      </SvgIcon>
                    </IconButton>
                  </div>
                }
                {isOwnEntry && (!canClaimPending || entry.canClaim !== undefined)
                    && (!fetchingEntryBalance || entry.balance !== undefined) &&
                  <div
                    style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                  >
                    {!entry.active &&
                      <div data-tip={!entry.canClaim ? 'Already Claimed' : 'Claim'}>
                        <IconButton
                          onTouchTap={handleClaim}
                          iconStyle={{
                              width: '24px',
                              height: '24px',
                              fill: !entry.canClaim ? palette.accent3Color : 'currentColor'
                          }}
                          disabled={claimPending}
                        >
                          <SvgIcon viewBox="0 0 16 16">
                            <ToolbarEthereum />
                          </SvgIcon>
                        </IconButton>
                      </div>
                    }
                    {entry.balance !== 'claimed' &&
                      <div style={{ fontSize: '16px', paddingRight: '5px' }}>
                        {entry.balance} AETH
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
EntryPageAction.propTypes = {
    canClaimPending: PropTypes.bool,
    claimPending: PropTypes.bool,
    entry: PropTypes.shape(),
    fetchingEntryBalance: PropTypes.bool,
    handleBookmark: PropTypes.func,
    handleClaim: PropTypes.func,
    handleDownvote: PropTypes.func,
    handleUpvote: PropTypes.func,
    isOwnEntry: PropTypes.bool,
    isSaved: PropTypes.bool,
    votePending: PropTypes.bool,
};
EntryPageAction.contextTypes = {
    muiTheme: React.PropTypes.shape()
};
export default EntryPageAction;
