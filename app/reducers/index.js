import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import setupConfig from './setupConfig';
import syncStatus from './syncStatus';

const rootReducer = combineReducers({
  setupConfig,
  syncStatus,
  routing
});

export default rootReducer;
