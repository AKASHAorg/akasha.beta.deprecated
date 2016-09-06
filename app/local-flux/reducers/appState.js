import { fromJS } from 'immutable';
import * as types from '../constants/AppConstants';
import { createReducer } from './create-reducer';

const initialState = fromJS({
    error: [],
    updates: null,
    appLoading: false,
    appUpdating: false,
    showAuthDialog: false,
    showEntry: {
        modal: false
    },
    confirmationDialog: null
});

const appState = createReducer(initialState, {
    '@reduxAsyncConnect/BEGIN_GLOBAL_LOAD': (state) =>
        state.merge({ appLoading: true }),

    '@reduxAsyncConnect/END_GLOBAL_LOAD': (state) =>
        state.merge({ appLoading: false }),

    [types.CHECK_FOR_UPDATES]: (state, action) =>
        state.merge({ updates: action.updates }),

    [types.UPDATE_APP]: (state, action) =>
        state.set('appUpdating', action.updating),

    [types.SHOW_ERROR]: (state, action) =>
        state.merge({ error: action.error }),

    [types.CLEAR_ERRORS]: () => initialState,

    [types.SHOW_AUTH_DIALOG]: (state) =>
        state.set('showAuthDialog', true),

    [types.HIDE_AUTH_DIALOG]: (state) =>
        state.set('showAuthDialog', false),

    [types.SHOW_ENTRY_MODAL]: (state, action) =>
        state.set('showEntry', { modal: true, ...action.entryData, ...action.options }),

    [types.HIDE_ENTRY_MODAL]: (state) =>
        state.set('showEntry', { modal: false }),

    [types.SHOW_CONFIRMATION_DIALOG]: (state, action) =>
        state.set('confirmationDialog', {
            action: action.confirmAction,
            address: action.entryAddress
        }),

    [types.HIDE_CONFIRMATION_DIALOG]: (state) =>
        state.set('confirmationDialog', null),

});

export default appState;
