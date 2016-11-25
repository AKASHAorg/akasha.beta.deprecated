/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, Record, List } from 'immutable';
import * as types from '../constants/AppConstants';
import * as profileTypes from '../constants/ProfileConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: 0,
    fatal: null,
    message: ''
});

const Notification = Record({
    id: null,
    values: new Map()
});

const PendingAction = Record({
    id: null,
    type: null,
    payload: new Map(),
    titleId: null,
    messageId: null,
    gas: null,
    status: null
});

const initialState = fromJS({
    error: new ErrorRecord(),
    updates: null,
    appLoading: false,
    appUpdating: false,
    showAuthDialog: null,
    showEntry: {
        modal: false
    },
    weightConfirmDialog: null,
    timestamp: null,
    notifications: new List(),
    pendingActions: new List(),
    publishConfirmDialog: null
});

const appState = createReducer(initialState, {
    [types.CHECK_FOR_UPDATES]: (state, action) =>
        state.merge({ updates: action.hasUpdates }),

    [types.UPDATE_APP]: (state, action) =>
        state.set('appUpdating', action.updating),

    [types.SHOW_ERROR]: (state, action) =>
        state.merge({ error: new ErrorRecord(action.error) }),

    [types.CLEAR_ERRORS]: () => initialState,

    [types.SHOW_AUTH_DIALOG]: (state, { actionId }) =>
        state.set('showAuthDialog', actionId),

    [types.HIDE_AUTH_DIALOG]: state =>
        state.set('showAuthDialog', null),

    [types.SHOW_ENTRY_MODAL]: (state, action) =>
        state.set('showEntry', { modal: true, ...action.entryData, ...action.options }),

    [types.HIDE_ENTRY_MODAL]: state =>
        state.set('showEntry', { modal: false }),

    [types.SHOW_WEIGHT_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('weightConfirmDialog', resource),

    [types.HIDE_WEIGHT_CONFIRM_DIALOG]: state =>
        state.set('weightConfirmDialog', null),

    [types.SHOW_PUBLISH_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('publishConfirmDialog', resource),

    [types.HIDE_PUBLISH_CONFIRM_DIALOG]: state =>
        state.set('publishConfirmDialog', null),

    [types.SET_TIMESTAMP]: (state, action) =>
        state.set('timestamp', action.timestamp),

    [profileTypes.LOGIN_SUCCESS]: state => {
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

    [types.SHOW_NOTIFICATION]: (state, { notification }) => {
        if (state.get('notifications').findIndex(notif => notif.type === notification.type) > -1) {
            return state;
        }
        return state.merge({
            notifications: state.get('notifications').push(new Notification(notification))
        });
    },

    [types.HIDE_NOTIFICATION]: (state, { notification }) => {
        const indexToRemove = state.get('notifications').findIndex(notific =>
            notific.id === notification.id);

        return state.merge({
            notifications: state.get('notifications').delete(indexToRemove)
        });
    },

    [types.ADD_PENDING_ACTION]: (state, { data }) =>
        state.merge({
            pendingActions: state.get('pendingActions').push(new PendingAction(data))
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

});

export default appState;
