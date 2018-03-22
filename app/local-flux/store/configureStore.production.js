import { createStore, applyMiddleware, compose } from 'redux';
import sagaMiddleware from './sagaMiddleware';
import rootReducer from '../reducers';
import batchedSubscribeMiddleware from './batching/middleware';
import batchedSubscribeEnhancer from './batching/enhancer';

const finalCreateStore = compose(
    applyMiddleware(batchedSubscribeMiddleware, sagaMiddleware),
    batchedSubscribeEnhancer,
)(createStore);

export default function configureStore (initialState) {
    return finalCreateStore(rootReducer, initialState);
}
