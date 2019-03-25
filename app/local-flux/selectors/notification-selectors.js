// @flow
export const selectUnreadNotifications = (state /*: Object */) =>
    state.notificationsState.get('unreadNotifications');

export const selectNotifications = (state /*: Object */) => state.notificationsState.get('allNotifications');

export const selectNotificationsLoaded = (state /*: Object */) =>
    state.notificationsState.get('notificationsLoaded');
