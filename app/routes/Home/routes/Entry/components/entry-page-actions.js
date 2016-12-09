import React, { Component, PropTypes } from 'react';
import { CardActions, IconButton, SvgIcon } from 'material-ui';
import styles from './entry-page-actions.scss';
import { EntryBookmarkOn, EntryBookmarkOff, EntryDownvote, EntryUpvote, ToolbarEthereum } from 'shared-components/svg';

class EntryPageAction extends Component {
    render () {
        const { canClaimPending, claimPending, entry, fetchingEntryBalance, votePending,
            handleBookmark, handleClaim, handleDownvote, handleUpvote, isOwnEntry, isSaved } = this.props;
        const { palette } = this.context.muiTheme;
        const voteWeight = entry.existingVoteWeight || 0;
        const upvoteIconColor = voteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = voteWeight < 0 ? palette.accent1Color : '';
        const voteButtonsDisabled = !entry.active || voteWeight !== 0 ||
            (voteEntryPending && voteEntryPending.value);
        return (
          <CardActions
            className="col-xs-12"
            style={{
                padding: '18px 8px 0px',
                borderBottom: `1px solid ${palette.borderColor}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }} >
              <div style={{ position: 'relative' }}>
                <IconButton
                  onTouchTap={handleUpvote}
                  iconStyle={{ width: '24px', height: '24px' }}
                  tooltip="Upvote"
                  disabled={voteButtonsDisabled}
                >
                  <SvgIcon viewBox="0 0 20 20" >
                    <EntryUpvote fill={upvoteIconColor} />
                  </SvgIcon>
                </IconButton>
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
                {entry.score}
              </div>
              <div style={{ position: 'relative' }}>
                <IconButton
                  onTouchTap={handleDownvote}
                  iconStyle={{ width: '24px', height: '24px' }}
                  tooltip="Downvote"
                  disabled={voteButtonsDisabled}
                >
                  <SvgIcon viewBox="0 0 20 20">
                    <EntryDownvote fill={downvoteIconColor} />
                  </SvgIcon>
                </IconButton>
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
                  <IconButton
                    onTouchTap={handleBookmark}
                    iconStyle={{ width: '24px', height: '24px' }}
                    tooltip="Bookmark"
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      {isSaved ?
                        <EntryBookmarkOn /> :
                        <EntryBookmarkOff />
                      }
                    </SvgIcon>
                  </IconButton>
                }
                {isOwnEntry && (!canClaimPending || entry.canClaim !== undefined)
                        && (!fetchingEntryBalance || entry.balance !== undefined) &&
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {!entry.active &&
                        <IconButton
                          onTouchTap={handleClaim}
                          iconStyle={{
                              width: '24px',
                              height: '24px',
                              fill: !entry.canClaim ? palette.accent3Color : 'currentColor'
                          }}
                          tooltip={!entry.canClaim ? 'Already Claimed' : 'Claim'}
                          disabled={claimPending}
                        >
                          <SvgIcon viewBox="0 0 16 16">
                            <ToolbarEthereum />
                          </SvgIcon>
                        </IconButton>
                      }
                      {entry.balance !== 'claimed' &&
                        <div style={{ fontSize: '16px', paddingRight: '5px' }}>
                          {entry.balance} ETH
                        </div>
                      }
                    </div>
                }
              </div>
            </div>
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
