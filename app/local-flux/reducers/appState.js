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
    type: null,
    message: ''
});

const initialState = fromJS({
    error: new ErrorRecord(),
    updates: null,
    appLoading: false,
    appUpdating: false,
    showAuthDialog: false,
    showEntry: {
        modal: false
    },
    confirmationDialog: null,
    timestamp: null,
    notifications: new List(),
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

    [types.SHOW_AUTH_DIALOG]: state =>
        state.set('showAuthDialog', true),

    [types.HIDE_AUTH_DIALOG]: state =>
        state.set('showAuthDialog', false),

    [types.SHOW_ENTRY_MODAL]: (state, action) =>
        state.set('showEntry', { modal: true, ...action.entryData, ...action.options }),

    [types.HIDE_ENTRY_MODAL]: state =>
        state.set('showEntry', { modal: false }),

    [types.SHOW_CONFIRMATION_DIALOG]: (state, action) =>
        state.set('confirmationDialog', action.entity),

    [types.HIDE_CONFIRMATION_DIALOG]: state =>
        state.set('confirmationDialog', null),

    [types.SHOW_PUBLISH_CONFIRM_DIALOG]: (state, { resource }) =>
        state.set('publishConfirmDialog', resource),

    [types.HIDE_PUBLISH_CONFIRM_DIALOG]: state =>
        state.set('publishConfirmDialog', null),

    [types.SET_TIMESTAMP]: (state, action) =>
        state.set('timestamp', action.timestamp),

    [profileTypes.LOGIN_SUCCESS]: state =>
        state.set('showAuthDialog', false),

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
            notific.type === notification.type);

        return state.merge({
            notifications: state.get('notifications').delete(indexToRemove)
        });
    },
});

export default appState;
