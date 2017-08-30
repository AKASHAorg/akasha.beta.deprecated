import { List } from 'immutable';
import { AppRecord, NotificationRecord } from './records';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const initialState = new AppRecord();

const appState = createReducer(initialState, {

    [types.HIDE_NOTIFICATION]: (state, { notification }) => {
        const indexToRemove = state.get('notifications').findIndex(notific =>
            notific.id === notification.id);

        return state.merge({
            notifications: state.get('notifications').delete(indexToRemove)
        });
    },

    [types.HIDE_TERMS]: state =>
        state.merge({
            showTerms: false
        }),

    [types.APP_READY]: state =>
        state.set('appReady', true),

    [types.APP_SETTINGS_TOGGLE]: state =>
        state.set('showAppSettings', !state.get('showAppSettings')),

    [types.BOOTSTRAP_HOME_SUCCESS]: state =>
        state.set('homeReady', true),

    [types.HIDE_REPORT_MODAL]: state =>
        state.set('showReportModal', false),

    [types.PROFILE_LOGIN_SUCCESS]: state =>
        state.set('showAuthDialog', false),

    [types.PROFILE_LOGOUT]: state =>
        state.merge({
            notifications: new List(),
        }),

    [types.PROFILE_LOGOUT_SUCCESS]: state =>
        state.set('homeReady', false),

    [types.SHOW_NOTIFICATION]: (state, { notification }) => state.merge({
        notifications: state.get('notifications').push(new NotificationRecord(notification))
    }),

    [types.SHOW_REPORT_MODAL]: state =>
        state.set('showReportModal', true),

    [types.SHOW_TERMS]: state =>
        state.merge({
            showTerms: true
        }),

    [types.TOGGLE_AUTH_DIALOG]: state =>
        state.set('showAuthDialog', !state.get('showAuthDialog')),

    [types.TOGGLE_GETH_DETAILS_MODAL]: state =>
        state.set('showGethDetailsModal', !state.get('showGethDetailsModal')),

    [types.TOGGLE_IPFS_DETAILS_MODAL]: state =>
        state.set('showIpfsDetailsModal', !state.get('showIpfsDetailsModal')),

});

export default appState;
