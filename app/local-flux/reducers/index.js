import { combineReducers } from 'redux';
// import { routerReducer as routing } from 'react-router';
import actionState from './actionState';
import appState from './appState';
import claimableState from './claimableState';
import commentsState from './commentsState';
import dashboardState from './dashboardState';
import draftState from './draftState';
import entryState from './entryState';
import errorState from './errorState';
import externalProcState from './externalProcState';
import highlightState from './highlightState';
import licenseState from './licenseState';
import listState from './listState';
import notificationsState from './notificationsState';
import profileState from './profileState';
import requestState from './requestState';
import searchState from './searchState';
import settingsState from './settingsState';
import tagState from './tagState';
// import tempProfileState from './temp-profile-state'; (merged with profilestate)
// import utilsState from './utilsState'; (merged with appState)

const rootReducer = combineReducers({
    actionState,
    appState,
    claimableState,
    commentsState,
    dashboardState,
    draftState,
    entryState,
    errorState,
    externalProcState,
    highlightState,
    licenseState,
    listState,
    notificationsState,
    profileState,
    requestState,
    searchState,
    settingsState,
    tagState,
    // tempProfileState (merged with profilestate),
    // utilsState, (merged with appState)
    // router: routing,
});

export default rootReducer;
