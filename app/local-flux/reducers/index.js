import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import profileState from './profileState';
import panelState from './panelState';
import appState from './appState';
import settingsState from './settingsState';
import entryState from './entryState';
import externalProcState from './externalProcState';
import tagState from './tagState';
import draftState from './draftState';
import transactionState from './transactionState';

const rootReducer = combineReducers({
    profileState,
    panelState,
    appState,
    settingsState,
    entryState,
    externalProcState,
    tagState,
    draftState,
    transactionState,
    reduxAsyncConnect,
    routing,
});

export default rootReducer;
