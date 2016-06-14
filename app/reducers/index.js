import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import setupConfig from './setupConfig';
import syncStatus from './syncStatus';
import profile from './profileRedux';
import authState from './authState';
import panelState from './panelState';
import appState from './appState';

const rootReducer = combineReducers({
    setupConfig,
    syncStatus,
    profile,
    authState,
    panelState,
    appState,
    routing,
});

export default rootReducer;
