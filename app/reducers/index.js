import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import setupConfig from './setupConfig';

const rootReducer = combineReducers({
  setupConfig,
  routing
});

export default rootReducer;
