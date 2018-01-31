import * as types from '../constants';
import { createReducer } from './create-reducer';
import { NotificationsState } from './records';

const initialState = new NotificationsState();

const notificationsState = createReducer(initialState, {
    [types.NOTIFICATIONS_LOADED]: state => state.set('notificationsLoaded', true),

    [types.NOTIFICATIONS_SUBSCRIBE]: state => state.set('fetchingNotifications', true),

    [types.NOTIFICATIONS_SUBSCRIBE_ERROR]: state => state.set('fetchingNotifications', false),

    [types.NOTIFICATIONS_SUBSCRIBE_SUCCESS]: (state, { data, isPanelOpen }) => {
        if (data.watching) {
            return state.set('fetchingNotifications', false);
        }
        const notifications = state.get('allNotifications').push(data);
        const sortedNotif = notifications.sort((a, b) => (b.blockNumber - a.blockNumber));
        const unreadNotifications = isPanelOpen ?
            state.get('unreadNotifications') :
            state.get('unreadNotifications') + 1;
        return state.merge({
            allNotifications: sortedNotif,
            fetchingNotifications: false,
            unreadNotifications
        });
    },

    [types.SHOW_NOTIFICATIONS_PANEL]: (state) => {
        if (!state.get('notificationsLoaded')) {
            console.log('do not reset unread notif');
            return state;
        }
        console.log('reset unread notif');        
        return state.set('unreadNotifications', 0);
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,
});

export default notificationsState;
