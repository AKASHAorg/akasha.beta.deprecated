import { List, Record } from 'immutable';

export const NotificationsState = Record({
    allNotifications: new List(),
    fetchingNotifications: false,
    notificationsLoaded: false,
    unreadNotifications: 0
});
