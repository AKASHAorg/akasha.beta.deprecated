import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import appState from './appState';
import chatState from './chatState';
import commentsState from './commentsState';
import draftState from './draftState';
import entryState from './entryState';
import errorReducer from './error-reducer';
import externalProcState from './externalProcState';
import notificationsState from './notificationsState';
import panelState from './panelState';
import profileState from './profileState';
import searchState from './searchState';
import settingsState from './settingsState';
import tagState from './tagState';
import tempProfileState from './tempProfileState';
import transactionState from './transactionState';
import utilsState from './utilsState';

const rootReducer = combineReducers({
    appState,
    chatState,
    commentsState,
    draftState,
    entryState,
    errorReducer,
    externalProcState,
    notificationsState,
    panelState,
    profileState,
    routing,
    searchState,
    settingsState,
    tagState,
    tempProfileState,
    transactionState,
    utilsState
});

export default rootReducer;
