import { fromJS } from 'immutable';
import { AppRecord, NotificationRecord, PendingActionRecord } from './records';
import * as types from '../constants';
import * as appTypes from '../constants/AppConstants';
import * as profileTypes from '../constants/ProfileConstants';
import { createReducer } from './create-reducer';

const initialState = new AppRecord();

const appState = createReducer(initialState, {
    [appTypes.APP_READY]: state =>
        state.set('appReady', true),

    [appTypes.SHOW_AUTH_DIALOG]: (state, { actionId }) =>
        state.set('showAuthDialog', actionId),

    [appTypes.HIDE_AUTH_DIALOG]: state =>
        state.set('showAuthDialog', null),

    [appTypes.SHOW_WEIGHT_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('weightConfirmDialog', resource),

    [appTypes.HIDE_WEIGHT_CONFIRM_DIALOG]: state =>
        state.set('weightConfirmDialog', null),

    [appTypes.SHOW_PUBLISH_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('publishConfirmDialog', resource),

    [appTypes.HIDE_PUBLISH_CONFIRM_DIALOG]: state =>
        state.set('publishConfirmDialog', null),

    [appTypes.SHOW_TRANSFER_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('transferConfirmDialog', resource),

    [appTypes.HIDE_TRANSFER_CONFIRM_DIALOG]: state =>
        state.set('transferConfirmDialog', null),

    [appTypes.SET_TIMESTAMP]: (state, action) =>
        state.set('timestamp', action.timestamp),

    [profileTypes.LOGIN_SUCCESS]: (state) => {
        const actionIndex = state.get('pendingActions').findIndex(action =>
            action.get('status') === 'checkAuth');
        if (actionIndex !== -1) {
            return state.merge({
                pendingActions: state.get('pendingActions').mergeIn([actionIndex], {
                    status: 'readyToPublish'
                }),
                showAuthDialog: null
            });
        }
        return state.set('showAuthDialog', null);
    },

    [appTypes.SHOW_NOTIFICATION]: (state, { notification }) => state.merge({
        notifications: state.get('notifications').push(new NotificationRecord(notification))
    }),

    [appTypes.HIDE_NOTIFICATION]: (state, { notification }) => {
        const indexToRemove = state.get('notifications').findIndex(notific =>
            notific.id === notification.id);

        return state.merge({
            notifications: state.get('notifications').delete(indexToRemove)
        });
    },

    [appTypes.ADD_PENDING_ACTION]: (state, { data }) =>
        state.merge({
            pendingActions: state.get('pendingActions').push(new PendingActionRecord(fromJS(data)))
        }),

    [appTypes.UPDATE_PENDING_ACTION]: (state, { data }) => {
        const index = state.get('pendingActions').findIndex(action =>
            action.get('id') === data.id);
        return state.merge({
            pendingActions: state.get('pendingActions').mergeIn([index], data)
        });
    },

    [appTypes.DELETE_PENDING_ACTION]: (state, { actionId }) =>
        state.merge({
            pendingActions: state.get('pendingActions').filter(action =>
                action.get('id') !== actionId)
        }),

    [appTypes.SHOW_TERMS]: state =>
        state.merge({
            showTerms: true
        }),

    [appTypes.HIDE_TERMS]: state =>
        state.merge({
            showTerms: false
        }),

    [appTypes.TOGGLE_GETH_DETAILS_MODAL]: state =>
        state.set('showGethDetailsModal', !state.get('showGethDetailsModal')),

    [appTypes.TOGGLE_IPFS_DETAILS_MODAL]: state =>
        state.set('showIpfsDetailsModal', !state.get('showIpfsDetailsModal')),

    [types.SHOW_LOGIN_DIALOG]: (state, { profileAddress }) =>
        state.set('showLoginDialog', profileAddress),

    [types.HIDE_LOGIN_DIALOG]: state =>
        state.set('showLoginDialog', null),
});

export default appState;
