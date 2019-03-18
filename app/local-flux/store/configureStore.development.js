import { createStore, applyMiddleware, compose } from 'redux';
// import { persistState } from 'redux-devtools';
import sagaMiddleware from './sagaMiddleware';
import rootReducer from '../reducers';
import batchedSubscribeMiddleware from './batching/middleware';
import batchedSubscribeEnhancer from './batching/enhancer';
import * as actionCreators from '../actions';

const finalCreateStore = compose(
    applyMiddleware(sagaMiddleware),
    global.devToolsExtension ?
        global.devToolsExtension({
            actionCreators,
            maxAge: 200,
            actionBlacklist: ['ENTRY_GET_SHORT']
        }) :
        noop => noop,
    // batchedSubscribe(updateBatcher),
    // persistState(
    //   global.location.href.match(
    //     /[?&]debug_session=([^&]+)\b/
    //   )
    // )
)(createStore);

export default function configureStore (initialState) {
    const store = finalCreateStore(rootReducer, initialState);

    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
        );
    }
    return store;
}
