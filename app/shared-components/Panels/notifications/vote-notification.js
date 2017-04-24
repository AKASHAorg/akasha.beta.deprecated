import PropTypes from 'prop-types';
import React from 'react';
import Notification from './notification';

const EntryNotification = (props, context) => {
    const { blockNumber, deleteNotif, disableNotifications, enableNotifications, entry, index,
        isMuted, isOwnNotif, navigateToEntry, navigateToProfile, profile, weight } = props;
    const { palette } = context.muiTheme;
    const type = weight > 0 ? 'Upvoted' : 'Downvoted';
    const colorVote = weight > 0 ? palette.accent3Color : palette.accent1Color;
    const voteWeight = weight > 0 ? (`+${weight}`) : weight;
    const message = (
      <div>
        <div className="overflow-ellipsis" style={{ color: palette.textColor }}>
          {type}<span style={{ color: colorVote }} > {voteWeight} </span>on&nbsp;
          <span
            className="link"
            onClick={() => navigateToEntry(entry.entryId)}
          >
            {entry.content.title}
          </span>
        </div>
        Block {blockNumber}
      </div>
    );
    return (
      <Notification
        deleteNotif={() => deleteNotif(index)}
        disableNotifications={disableNotifications}
        enableNotifications={enableNotifications}
        isMuted={isMuted}
        isOwnNotif={isOwnNotif}
        message={message}
        navigateToProfile={navigateToProfile}
        profile={profile}
      />
    );
};

EntryNotification.contextTypes = {
    muiTheme: PropTypes.shape()
};

EntryNotification.propTypes = {
    blockNumber: PropTypes.number,
    deleteNotif: PropTypes.func,
    disableNotifications: PropTypes.func,
    enableNotifications: PropTypes.func,
    entry: PropTypes.shape(),
    index: PropTypes.number,
    isMuted: PropTypes.bool,
    isOwnNotif: PropTypes.bool,
    navigateToEntry: PropTypes.func,
    navigateToProfile: PropTypes.func,
    profile: PropTypes.shape(),
    weight: PropTypes.number,
};

export default EntryNotification;
