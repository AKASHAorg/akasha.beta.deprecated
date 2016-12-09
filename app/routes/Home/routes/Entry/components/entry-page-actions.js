import React, { Component } from 'react';
import { IconButton, SvgIcon } from 'material-ui';
import styles from './entry-page-actions.scss';
import { EntryDownvote, EntryUpvote } from 'shared-components/svg';

class EntryPageAction extends Component {
    _handleUpvote = () => {}
    _handleDownvote = () => {}
    render () {
        const { entryScore, votePending, entryId, entryIsActive, existingVoteWeight } = this.props;
        const { palette } = this.context.muiTheme;
        const voteEntryPending = votePending && votePending.find(vote =>
                        vote.entryId === entryId);
        const upvoteIconColor = existingVoteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = existingVoteWeight < 0 ? palette.accent1Color : '';
        return (
          <div className={`${styles.entry_actions}`}>
            <div className={`${styles.entry_upvote}`}>
              <IconButton
                onTouchTap={this.handleUpvote}
                iconStyle={{ width: '20px', height: '20px' }}
                disabled={!entryIsActive || (voteEntryPending && voteEntryPending.value)
                    || existingVoteWeight !== 0}
              >
                <SvgIcon viewBox="0 0 20 20" >
                  <EntryUpvote fill={upvoteIconColor} />
                </SvgIcon>
              </IconButton>
            </div>
            <div className={`${styles.entry_score_counter}`}>
              {entryScore}
            </div>
            <div className={`${styles.entry_downvote}`}>
              <IconButton
                onTouchTap={this.handleDownvote}
                iconStyle={{ width: '20px', height: '20px' }}
                disabled={!entryIsActive || (voteEntryPending && voteEntryPending.value)
                    || existingVoteWeight !== 0}
              >
                <SvgIcon viewBox="0 0 20 20">
                  <EntryDownvote fill={downvoteIconColor} />
                </SvgIcon>
              </IconButton>
              {existingVoteWeight < 0 &&
                <div
                  style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      fontSize: '10px',
                      color: palette.accent1Color
                  }}
                >
                  {existingVoteWeight}
                </div>
              }
            </div>
          </div>
        );
    }
}
EntryPageAction.propTypes = {
    entryId: React.PropTypes.string,
    entryScore: React.PropTypes.string,
    votePending: React.PropTypes.shape(),
    entryIsActive: React.PropTypes.bool,
    existingVoteWeight: React.PropTypes.number
};
EntryPageAction.contextTypes = {
    muiTheme: React.PropTypes.shape()
};
export default EntryPageAction;
