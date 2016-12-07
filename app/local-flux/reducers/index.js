import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import appState from './appState';
import commentsState from './commentsState';
import draftState from './draftState';
import entryState from './entryState';
import externalProcState from './externalProcState';
import notificationsState from './notificationsState';
import panelState from './panelState';
import profileState from './profileState';
import settingsState from './settingsState';
import tagState from './tagState';
import tempProfileState from './tempProfileState';
import transactionState from './transactionState';

const rootReducer = combineReducers({
    appState,
    commentsState,
    draftState,
    entryState,
    externalProcState,
    notificationsState,
    panelState,
    profileState,
    settingsState,
    tagState,
    tempProfileState,
    transactionState,
    routing,
});

export default rootReducer;
