import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import sagaMiddleware from './sagaMiddleware';
import rootReducer from '../reducers';
import * as actionCreators from '../actions';

const finalCreateStore = compose(
    applyMiddleware(thunk, sagaMiddleware),
    global.devToolsExtension ?
        global.devToolsExtension({ actionCreators }) :
        noop => noop,
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
    self.findIPCChannelByHash = (hash) => {
        Object.keys(self.Channel).forEach((rootKey) => {
            const rootCh = self.Channel[rootKey];
            Object.keys(rootCh).forEach((modKey) => {
                const mod = rootCh[modKey];
                Object.keys(mod).forEach((chKey) => {
                    if (chKey === 'manager') {
                        if (mod[chKey] === hash) {
                            console.log(
                                `found ${rootKey} channel:`,
                                `Channel.${rootKey}.${modKey}.${chKey}`
                            );
                        }
                    } else {
                        if (mod[chKey].channel === hash) {
                            return console.log(
                                `found ${rootKey} channel:`,
                                `Channel.${rootKey}.${modKey}.${chKey}`
                            );
                        }
                        return null;
                    }
                });
            });
        });
    };
    return store;
}
