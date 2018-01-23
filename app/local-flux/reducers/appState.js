import { List, Map } from 'immutable';
import { AppRecord, NotificationRecord, PreviewRecord } from './records';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const initialState = new AppRecord();

const appState = createReducer(initialState, {
    [types.APP_READY]: state =>
        state.set('appReady', true),

    [types.BOOTSTRAP_HOME_SUCCESS]: state =>
        state.set('homeReady', true),

    [types.FULL_SIZE_IMAGE_ADD]: (state, { data }) => state.set('fullSizeImages', new Map(data)),

    [types.FULL_SIZE_IMAGE_DELETE]: state => state.set('fullSizeImages', new Map()),

    [types.HIDE_NOTIFICATION]: (state, { notification }) => {
        const indexToRemove = state.get('displayedNotifications').findIndex(displayId =>
            displayId === notification.displayId);
        return state.merge({
            displayedNotifications: state.get('displayedNotifications').delete(indexToRemove)
        });
    },

    [types.HIDE_PREVIEW]: state => state.set('showPreview', null),

    [types.HIDE_TERMS]: state => state.set('showTerms', false),

    [types.HIDE_NOTIFICATIONS_PANEL]: state => state.set('showNotificationsPanel', false),

    [types.HIDE_TRANSACTIONS_LOG]: state => state.set('showTransactionsLog', false),

    [types.NAV_COUNTER_INCREMENT]: (state, { navType }) => {
        if (navType === 'back') {
            return state.set('navigationBackCounter', state.get('navigationBackCounter') + 1);
        } else if (navType === 'forward') {
            return state.set('navigationForwardCounter', state.get('navigationForwardCounter') + 1);
        }
        return state;
    },

    [types.NAV_COUNTER_DECREMENT]: (state, { navType }) => {
        if (navType === 'back') {
            return state.set('navigationBackCounter', state.get('navigationBackCounter') - 1);
        } else if (navType === 'forward') {
            return state.set('navigationForwardCounter', state.get('navigationForwardCounter') - 1);
        }
        return state;
    },

    [types.NAV_FORWARD_COUNTER_RESET]: state =>
        state.set('navigationForwardCounter', 0),

    [types.NAV_BACK_COUNTER_RESET]: state =>
        state.set('navigationBackCounter', -1),

    [types.NOTIFICATION_DISPLAY]: (state, { notification }) => state.merge({
        displayedNotifications: state.get('displayedNotifications').push(notification.get('displayId'))
    }),

    [types.PROFILE_LOGOUT]: state =>
        state.merge({
            notifications: new List(),
        }),

    [types.PROFILE_LOGOUT_SUCCESS]: state =>
        state.merge({
            homeReady: false,
            showWallet: null
        }),

    [types.SECONDARY_SIDEBAR_TOGGLE]: (state, { forceToggle }) => {
        if (typeof forceToggle === 'boolean') {
            return state.set('showSecondarySidebar', forceToggle);
        }
        return state.set('showSecondarySidebar', !state.get('showSecondarySidebar'));
    },
    [types.PROFILE_EDIT_TOGGLE]: state =>
        state.set('showProfileEditor', !state.get('showProfileEditor')),

    [types.SHOW_NOTIFICATION]: (state, { notification }) => {
        const lastNotification = state.get('notifications').last();
        notification.displayId = lastNotification ? lastNotification.get('displayId') + 1 : 1;
        return state.merge({
            notifications: state.get('notifications').push(new NotificationRecord(notification))
        });
    },

    [types.SHOW_PREVIEW]: (state, { columnType, value }) =>
        state.set('showPreview', new PreviewRecord({ columnType, value })),

    [types.SHOW_TERMS]: state => state.set('showTerms', true),

    [types.SHOW_NOTIFICATIONS_PANEL]: state => state.set('showNotificationsPanel', true),

    [types.SHOW_TRANSACTIONS_LOG]: state => state.set('showTransactionsLog', true),

    [types.TOGGLE_AETH_WALLET]: state =>
        state.set('showWallet', state.get('showWallet') === 'AETH' ? null : 'AETH'),

    [types.TOGGLE_ETH_WALLET]: state =>
        state.set('showWallet', state.get('showWallet') === 'ETH' ? null : 'ETH'),

    [types.TOGGLE_LIGHT_SYNC_MODE]: (state, { lightSync }) =>
        state.set('isLightSync', lightSync),

    [types.TOGGLE_GETH_DETAILS_MODAL]: state =>
        state.set('showGethDetailsModal', !state.get('showGethDetailsModal')),

    [types.TOGGLE_IPFS_DETAILS_MODAL]: state =>
        state.set('showIpfsDetailsModal', !state.get('showIpfsDetailsModal')),

    [types.TOGGLE_NAVIGATION_MODAL]: state =>
        state.set('showNavigationModal', !state.get('showNavigationModal')),

    [types.TOGGLE_OUTSIDE_NAVIGATION_MODAL]: (state, { url }) =>
        state.mergeIn(['outsideNavigation'], {
            isVisible: !!url,
            url,
        }),
    '@@router/LOCATION_CHANGE': (state, { payload }) => {
        const { pathname } = payload;
        const whitelistRoutes = ['/dashboard', '/draft', '/profileoverview'];
        if (pathname && whitelistRoutes.some(route => pathname.startsWith(route))) {
            return state.set('showSecondarySidebar', true);
        }
        return state.set('showSecondarySidebar', false);
    }
});

export default appState;
