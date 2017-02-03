import React, { PropTypes } from 'react';
import Notification from './notification';

const MentionNotification = (props, context) => {
    const { deleteNotif, disableNotifications, enableNotifications, entry, index, intl,
        isMuted, navigateToEntry, navigateToProfile, profile, timestamp } = props;
    const { palette } = context.muiTheme;
    const message = (
      <div>
        <div className="overflow_ellipsis" style={{ color: palette.textColor }}>
          Mentioned you in a&nbsp;
          <span
            className="link"
            onClick={() => { navigateToEntry(entry.entryId); }}
          >
            comment
          </span>
        </div>
        {intl.formatRelative(timestamp * 1000)}
      </div>
    );
    return (
      <Notification
        deleteNotif={() => deleteNotif(index)}
        disableNotifications={disableNotifications}
        enableNotifications={enableNotifications}
        isMuted={isMuted}
        message={message}
        navigateToProfile={navigateToProfile}
        profile={profile}
      />
    );
};

MentionNotification.contextTypes = {
    muiTheme: PropTypes.shape()
};

MentionNotification.propTypes = {
    deleteNotif: PropTypes.func,
    disableNotifications: PropTypes.func,
    enableNotifications: PropTypes.func,
    entry: PropTypes.shape(),
    index: PropTypes.number,
    intl: PropTypes.shape(),
    isMuted: PropTypes.bool,
    navigateToEntry: PropTypes.func,
    navigateToProfile: PropTypes.func,
    profile: PropTypes.shape(),
    timestamp: PropTypes.number
};

export default MentionNotification;
