import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import appState from './appState';
import draftState from './draftState';
import entryState from './entryState';
import externalProcState from './externalProcState';
import panelState from './panelState';
import profileState from './profileState';
import settingsState from './settingsState';
import tagState from './tagState';
import tempProfileState from './tempProfileState';
import transactionState from './transactionState';

const rootReducer = combineReducers({
    appState,
    draftState,
    entryState,
    externalProcState,
    panelState,
    profileState,
    settingsState,
    tagState,
    tempProfileState,
    transactionState,
    routing,
});

export default rootReducer;
