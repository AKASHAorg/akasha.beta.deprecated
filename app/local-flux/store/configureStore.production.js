import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sagaMiddleware from './sagaMiddleware';
import rootReducer from '../reducers';

const finalCreateStore = compose(
  applyMiddleware(thunk, sagaMiddleware)
)(createStore);

export default function configureStore (initialState) {
    return finalCreateStore(rootReducer, initialState);
}
