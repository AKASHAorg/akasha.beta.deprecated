import { createStore, applyMiddleware, compose } from 'redux';
import { batchedSubscribe } from 'redux-batched-subscribe';
import debounce from 'lodash.debounce';
import sagaMiddleware from './sagaMiddleware';
import rootReducer from '../reducers';
import * as actionCreators from '../actions';

const finalCreateStore = compose(
    applyMiddleware(sagaMiddleware),
    global.devToolsExtension ?
        global.devToolsExtension({ actionCreators }) :
        noop => noop,
    batchedSubscribe(debounce(notify => notify(), 75)),
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
    self.redux__store = store;
    return store;
}
