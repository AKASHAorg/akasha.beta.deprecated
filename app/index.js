import React from 'react';
import './styles/ant-icons/iconfont.css';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createHashHistory from 'history/createHashHistory';
import Route from 'react-router-dom/Route';
import { ConnectedRouter } from 'react-router-redux';
import ReactPerf from 'react-addons-perf';
import ConnectedIntlProvider from './connected-intl-provider';
import rootSaga from './local-flux/sagas';
import configureStore from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import { AppContainer } from './containers';
import './styles/core.scss';

if (process.env.DARK_THEME) {
    require('./styles/ant-vars/extract-dark-theme.less');
} else {
    require('./styles/ant-vars/extract-default-theme.less');
}

const history = createHashHistory();
const store = configureStore();
sagaMiddleware.run(rootSaga);

window.Perf = ReactPerf;

// @todo put this somewhere safe and remove from production
self.findIPCChannelByHash = (hash) => {
    Object.keys(self.Channel).forEach((rootKey) => {
        const rootCh = self.Channel[rootKey];
        Object.keys(rootCh).forEach((modKey) => {
            const mod = rootCh[modKey];
            Object.keys(mod).forEach((chKey) => {
                if (chKey === 'manager') {
                    if (
                        (mod[chKey].channel && mod[chKey].channel.includes(hash)) ||
                        (typeof mod[chKey] === 'string' && mod[chKey].includes(hash))
                    ) {
                        console.info(
                            `found ${rootKey} channel:`,
                            `Channel.${rootKey}.${modKey}.${chKey} :: \n`,
                            `channel hash: ${mod[chKey].channel ? mod[chKey].channel : mod[chKey]}`
                        );
                    }
                } else if (mod[chKey].channel.includes(hash)) {
                    console.info(
                        `found ${rootKey} channel:`,
                        `Channel.${rootKey}.${modKey}.${chKey} :: \n`,
                        `channel hash: ${mod[chKey].channel}`
                    );
                }
            });
        });
    });
};


render(
  <Provider store={store} >
    <ConnectedIntlProvider>
      <ConnectedRouter history={history}>
        <Route component={AppContainer} />
      </ConnectedRouter>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById('root')
);

