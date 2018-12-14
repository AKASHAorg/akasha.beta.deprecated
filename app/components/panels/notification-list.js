import React, {PureComponent} from 'react';

class NotificationList extends PureComponent {
    render () {
        const { darkTheme, intl, notifications, notificationsLoaded } = this.props;
        const imgClass = classNames('notifications-panel__placeholder', {
            'notifications-panel__placeholder_dark': darkTheme
        });

        if (!notificationsLoaded) {
            return (
              <div className="notifications-panel__timeline-wrapper">
                <DataLoader flag />
              </div>
            );
        }
        return (
          <div className="notifications-panel__timeline-wrapper" ref={this.getContainerRef}>
            <Timeline>
              {notifications.map((notif) => {
                  if (!notif.blockNumber) {
                      return null;
                  }
                  return (
                    <Item
                      color="red"
                      key={this.getUniqueKey(notif)}
                    >
                      <NotificationLog
                        containerRef={this.containerRef}
                        key={notif.blockNumber}
                        notification={notif}
                      />
                    </Item>
                  );
              })}
            </Timeline>
            {!notifications.size &&
              <div className="flex-center notifications-panel__placeholder-wrapper">
                <div className={imgClass} />
                <div className="notifications-panel__placeholder-message">
                  {intl.formatMessage(profileMessages.noNotifications)}
                </div>
              </div>
            }
          </div>
        );
    }
}

NotificationList.defaultProps = {
    
};

NotificationList.PropTypes = {

}

export default NotificationList;