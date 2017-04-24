import PropTypes from 'prop-types';
import React from 'react';
import Notification from './notification';

const CommentNotification = (props, context) => {
    const { blockNumber, deleteNotif, disableNotifications, enableNotifications, entry, index,
        isMuted, isOwnNotif, navigateToEntry, navigateToProfile, profile } = props;
    const { palette } = context.muiTheme;
    const message = (
      <div>
        <div className="overflow-ellipsis" style={{ color: palette.textColor }}>
          Commented on
          <span
            className="link"
            style={{ padding: '0 5px' }}
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

CommentNotification.contextTypes = {
    muiTheme: PropTypes.shape()
};

CommentNotification.propTypes = {
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
};

export default CommentNotification;
