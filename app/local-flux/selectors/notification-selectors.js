// @flow
export const selectUnreadNotifications = (state/*: Object */) =>
    state.notificationsState.get('unreadNotifications');
