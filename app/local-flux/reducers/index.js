import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import appState from './appState';
import chatState from './chatState';
import commentsState from './commentsState';
import draftState from './draftState';
import entryState from './entryState';
import errorState from './errorState';
import externalProcState from './externalProcState';
import notificationsState from './notificationsState';
import panelState from './panelState';
import profileState, * as profileSelectors from './profileState';
import searchState from './searchState';
import settingsState from './settingsState';
import tagState from './tagState';
import tempProfileState from './temp-profile-state';
import transactionState from './transactionState';
import utilsState from './utilsState';

const rootReducer = combineReducers({
    appState,
    chatState,
    commentsState,
    draftState,
    entryState,
    errorState,
    externalProcState,
    notificationsState,
    panelState,
    profileState,
    searchState,
    settingsState,
    tagState,
    tempProfileState,
    transactionState,
    utilsState,
    router: routing,
});

export const getLocalProfiles = state => profileSelectors.getLocalProfiles(state.profileState);

export default rootReducer;
