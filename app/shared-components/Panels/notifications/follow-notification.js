import React, { PropTypes } from 'react';
import Notification from './notification';

const FollowNotification = (props, context) => {
    const { blockNumber, deleteNotif, disableNotifications, enableNotifications, index,
        isMuted, navigateToProfile, profile } = props;
    const { palette } = context.muiTheme;
    const message = (
      <div>
        <div className="overflow_ellipsis" style={{ color: palette.textColor }}>
          Followed you.
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
        message={message}
        navigateToProfile={navigateToProfile}
        profile={profile}
      />
    );
};

FollowNotification.contextTypes = {
    muiTheme: PropTypes.shape()
};

FollowNotification.propTypes = {
    blockNumber: PropTypes.number,
    deleteNotif: PropTypes.func,
    disableNotifications: PropTypes.func,
    enableNotifications: PropTypes.func,
    index: PropTypes.number,
    isMuted: PropTypes.bool,
    navigateToProfile: PropTypes.func,
    profile: PropTypes.shape(),
};

export default FollowNotification;
