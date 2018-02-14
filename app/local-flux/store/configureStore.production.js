import { createStore, applyMiddleware, compose } from 'redux';
import sagaMiddleware from './sagaMiddleware';
import rootReducer from '../reducers';

const finalCreateStore = compose(
    applyMiddleware(sagaMiddleware)
)(createStore);

export default function configureStore (initialState) {
    return finalCreateStore(rootReducer, initialState);
}
