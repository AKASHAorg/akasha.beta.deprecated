import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import sagaMiddleware from './sagaMiddleware';
import rootReducer from '../reducers';
import * as actionCreators from '../actions/action-creators';

const finalCreateStore = compose(
  applyMiddleware(thunk, sagaMiddleware),
  window.devToolsExtension ?
    window.devToolsExtension({ actionCreators }) :
    noop => noop,
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
)(createStore);

export default function configureStore (initialState) {
    const store = finalCreateStore(rootReducer, initialState);

    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
        );
    }
    window.__store = store;
    return store;
}
