import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import setupConfig from './setupConfig';
import syncStatus from './syncStatus';
import profileState from './profileState';
import panelState from './panelState';
import appState from './appState';
import settingsState from './settingsState';
import entryState from './entryState';
import externalProcState from './externalProcState';
import tagState from './tagState';

const rootReducer = combineReducers({
    setupConfig,
    syncStatus,
    profileState,
    panelState,
    appState,
    settingsState,
    entryState,
    externalProcState,
    tagState,
    reduxAsyncConnect,
    routing,
});

export default rootReducer;
