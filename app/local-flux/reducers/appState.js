import { fromJS } from 'immutable';
import { AppRecord, NotificationRecord, PendingActionRecord } from './records';
import * as types from '../constants/AppConstants';
import * as profileTypes from '../constants/ProfileConstants';
import { createReducer } from './create-reducer';

const initialState = new AppRecord();

const appState = createReducer(initialState, {
    [types.APP_READY]: state =>
        state.set('appReady', true),

    [types.SHOW_AUTH_DIALOG]: (state, { actionId }) =>
        state.set('showAuthDialog', actionId),

    [types.HIDE_AUTH_DIALOG]: state =>
        state.set('showAuthDialog', null),

    [types.SHOW_WEIGHT_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('weightConfirmDialog', resource),

    [types.HIDE_WEIGHT_CONFIRM_DIALOG]: state =>
        state.set('weightConfirmDialog', null),

    [types.SHOW_PUBLISH_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('publishConfirmDialog', resource),

    [types.HIDE_PUBLISH_CONFIRM_DIALOG]: state =>
        state.set('publishConfirmDialog', null),

    [types.SHOW_TRANSFER_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('transferConfirmDialog', resource),

    [types.HIDE_TRANSFER_CONFIRM_DIALOG]: state =>
        state.set('transferConfirmDialog', null),

    [types.SET_TIMESTAMP]: (state, action) =>
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

    [types.SHOW_NOTIFICATION]: (state, { notification }) => state.merge({
        notifications: state.get('notifications').push(new NotificationRecord(notification))
    }),

    [types.HIDE_NOTIFICATION]: (state, { notification }) => {
        const indexToRemove = state.get('notifications').findIndex(notific =>
            notific.id === notification.id);

        return state.merge({
            notifications: state.get('notifications').delete(indexToRemove)
        });
    },

    [types.ADD_PENDING_ACTION]: (state, { data }) =>
        state.merge({
            pendingActions: state.get('pendingActions').push(new PendingActionRecord(fromJS(data)))
        }),

    [types.UPDATE_PENDING_ACTION]: (state, { data }) => {
        const index = state.get('pendingActions').findIndex(action =>
            action.get('id') === data.id);
        return state.merge({
            pendingActions: state.get('pendingActions').mergeIn([index], data)
        });
    },

    [types.DELETE_PENDING_ACTION]: (state, { actionId }) =>
        state.merge({
            pendingActions: state.get('pendingActions').filter(action =>
                action.get('id') !== actionId)
        }),

    [types.SHOW_TERMS]: state =>
        state.merge({
            showTerms: true
        }),

    [types.HIDE_TERMS]: state =>
        state.merge({
            showTerms: false
        }),

    [types.TOGGLE_GETH_DETAILS_MODAL]: state =>
        state.set('showGethDetailsModal', !state.get('showGethDetailsModal')),

    [types.TOGGLE_IPFS_DETAILS_MODAL]: state =>
        state.set('showIpfsDetailsModal', !state.get('showIpfsDetailsModal')),

});

export default appState;
