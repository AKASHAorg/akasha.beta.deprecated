import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import setupConfig from './setupConfig';
import syncStatus from './syncStatus';
import profile from './profileRedux';
import profileState from './profileState';
import panelState from './panelState';
import appState from './appState';
import settingsState from './settingsState';

const rootReducer = combineReducers({
    setupConfig,
    syncStatus,
    profile,
    profileState,
    panelState,
    appState,
    settingsState,
    routing,
});

export default rootReducer;
