import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import actionState from './actionState';
import appState from './appState';
import chatState from './chatState';
import commentsState from './commentsState';
import dashboardState from './dashboardState';
import draftState from './draftState';
import entryState from './entryState';
import errorState from './errorState';
import externalProcState from './externalProcState';
import licenseState from './licenseState';
import listState from './listState';
import notificationsState from './notificationsState';
import panelState from './panelState';
import profileState from './profileState';
import searchState from './searchState';
import settingsState from './settingsState';
import tagState from './tagState';
import tempProfileState from './temp-profile-state';
import utilsState from './utilsState';

const rootReducer = combineReducers({
    actionState,
    appState,
    chatState,
    commentsState,
    dashboardState,
    draftState,
    entryState,
    errorState,
    externalProcState,
    licenseState,
    listState,
    notificationsState,
    panelState,
    profileState,
    searchState,
    settingsState,
    tagState,
    tempProfileState,
    utilsState,
    router: routing,
});

export default rootReducer;
