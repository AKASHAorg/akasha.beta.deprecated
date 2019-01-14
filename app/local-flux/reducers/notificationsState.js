import * as types from '../constants';
import { createReducer } from './utils';
import NotificationsStateModel from './state-models/notification-state-model';
import { NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

const initialState = new NotificationsStateModel();

const notificationsState = createReducer(initialState, {
    // [types.NOTIFICATIONS_LOADED]: state => state.set('notificationsLoaded', true),

    // [`${NOTIFICATIONS_MODULE.subscribe}`]: state => state.set('fetchingNotifications', true),

    // [`${NOTIFICATIONS_MODULE.subscribe}_ERROR`]: state => state.set('fetchingNotifications', false),

    [`${NOTIFICATIONS_MODULE.subscribe}_SUCCESS`]: (state, { data, isPanelOpen }) => {
        // if (data.watching) {
        //     return state.set('fetchingNotifications', false);
        // }
        const notifications = state.get('allNotifications').push(data);
        const sortedNotif = notifications.sort((a, b) => (b.blockNumber - a.blockNumber));
        // const unreadNotifications = isPanelOpen && state.get('notificationsLoaded') ?
        //     state.get('unreadNotifications') :
        //     state.get('unreadNotifications') + 1;
        return state.merge({
            allNotifications: sortedNotif,
            // fetchingNotifications: false,
            // unreadNotifications
        });
    },

    [types.SHOW_NOTIFICATIONS_PANEL]: (state) => {
        // if (!state.get('notificationsLoaded')) {
        //     return state;
        // }
        // return state.set('unreadNotifications', 0);
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,
});

export default notificationsState;
