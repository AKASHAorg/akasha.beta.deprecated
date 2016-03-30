import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import setupConfig from './setupConfig';
import syncStatus from './syncStatus';

import profile from './profileRedux';
import authState from './authState';


const rootReducer = combineReducers({
  setupConfig,
  syncStatus,
  profile,
  authState,
  routing
});

export default rootReducer;
