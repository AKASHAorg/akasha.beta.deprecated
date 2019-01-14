import { List, Record } from 'immutable';

const NotificationsState = Record({
    allNotifications: new List(),
    // fetchingNotifications: false,
    // notificationsLoaded: false,
    unreadNotifications: 0
});

export default class NotificationStateModel extends NotificationsState {

}