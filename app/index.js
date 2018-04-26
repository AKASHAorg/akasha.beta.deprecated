import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getHistory from './history';
import Route from 'react-router-dom/Route';
import { ConnectedRouter } from 'react-router-redux';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './styles/ant-icons/iconfont.css';
import ConnectedIntlProvider from './connected-intl-provider';
import rootSaga from './local-flux/sagas';
import configureStore from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import { AppContainer } from './containers';
import './styles/core.scss';
import './styles/ant-vars/extract-default-theme.less';

if (process.env.NODE_ENV !== 'production') {
    const { whyDidYouUpdate } = require('why-did-you-update');
    // uncomment this for fun :D
    // whyDidYouUpdate(React, { groupByComponent: true, collapseComponentGroups: false });
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
}

export const history = getHistory();
const store = configureStore();
sagaMiddleware.run(rootSaga);


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

