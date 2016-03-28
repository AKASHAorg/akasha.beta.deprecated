import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import setupConfig from './setupConfig';
import syncStatus from './syncStatus';
import profile from './profile';

const rootReducer = combineReducers({
  setupConfig,
  syncStatus,
  profile,
  routing
});

export default rootReducer;
