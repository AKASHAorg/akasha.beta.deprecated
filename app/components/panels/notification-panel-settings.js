// @flow
import React, { PureComponent } from 'react';
import { Switch } from 'antd';
import type { RecordOf } from 'immutable';
import { profileMessages, generalMessages, settingsMessages } from '../../locale-data/messages';

type Props = {|
    userPreference: RecordOf<*>,
    intl: { formatMessage: Function },
    onSettingsChange: Function,
|};

class NotificationPanelSettings extends PureComponent <Props> {
    
    static defaultProps = {}
    
    _changeUserPrefs = (prefKey: string) => (prefValue: boolean) => {
        const { userPreference } = this.props;
        const notificationsPreference = userPreference.set([prefKey], prefValue);
        this.props.onSettingsChange(notificationsPreference);
    }

    render() {
        const { intl, userPreference } = this.props;
        const { feed, donations, comments, votes } = userPreference;
        return (
          <div className="notifications-panel__notif-pref-list">
            <div className="notifications-panel__notif-pref">
              {intl.formatMessage(profileMessages.followers)}
              <Switch
                size="small"
                checked={feed}
                onChange={this._changeUserPrefs('feed')}
              />
            </div>
            <div className="notifications-panel__notif-pref">
              {intl.formatMessage(generalMessages.comments)}
              <Switch
                size="small"
                checked={comments}
                onChange={this._changeUserPrefs('comments')}
              />
            </div>
            <div className="notifications-panel__notif-pref">
              {intl.formatMessage(settingsMessages.votes)}
              <Switch
                size="small"
                checked={votes}
                onChange={this._changeUserPrefs('votes')}
              />
            </div>
            <div className="notifications-panel__notif-pref notifications-panel__notif-pref_last">
              {intl.formatMessage(settingsMessages.tips)}
              <Switch
                size="small"
                checked={donations}
                onChange={this._changeUserPrefs('donations')}
              />
            </div>
          </div>
        );
    }
}

export default NotificationPanelSettings;