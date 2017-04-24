import PropTypes from 'prop-types';
import React from 'react';
import Notification from './notification';

const TipNotification = (props, context) => {
    const { blockNumber, deleteNotif, disableNotifications, enableNotifications, index,
        isMuted, navigateToProfile, profile, value } = props;
    const { palette } = context.muiTheme;
    const message = (
      <div>
        <div className="overflow-ellipsis" style={{ color: palette.textColor }}>
          Tipped you
          <strong style={{ color: palette.linkColor, padding: '0 5px' }}>
            {value}
          </strong>
          AETH
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

TipNotification.contextTypes = {
    muiTheme: PropTypes.shape()
};

TipNotification.propTypes = {
    blockNumber: PropTypes.number,
    deleteNotif: PropTypes.func,
    disableNotifications: PropTypes.func,
    enableNotifications: PropTypes.func,
    index: PropTypes.number,
    isMuted: PropTypes.bool,
    navigateToProfile: PropTypes.func,
    profile: PropTypes.shape(),
    value: PropTypes.string,
};

export default TipNotification;
