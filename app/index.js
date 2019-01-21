import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getHistory from './history';
import Route from 'react-router-dom/Route';
import Router from 'react-router-dom/Router';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './styles/ant-icons/iconfont.css';
import ConnectedIntlProvider from './connected-intl-provider';
import rootSaga from './local-flux/sagas';
import storeConfig from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import chReqService from './local-flux/services/channel-request-service';
import { AppContainer } from './containers';
import './styles/core.scss';
import './styles/ant-vars/extract-default-theme.less';

console.log('boostrapping app...');

export const bootstrap = (web3Enabled = false, vault = false, channel, logger) => {
    const history = getHistory();
    const MainContext = React.createContext({logger, channel});
    chReqService.setIPCChannel(channel);
    storeConfig.then(configMod => {
        const store = configMod.default();
        sagaMiddleware.run(rootSaga);
        console.log(store, 'the store');
        global.redux__store = store;
        render(
          <Provider store={store}>
            <ConnectedIntlProvider>
              <Router history={history}>
                <Route render={(props) =>
                  (
                    <MainContext.Consumer>
                      {(...contextProps) =>
                        <AppContainer unlocked={vault} web3={web3Enabled} {...props} {...contextProps}/>
                      }
                    </MainContext.Consumer>
                  )}/>
              </Router>
            </ConnectedIntlProvider>
          </Provider>,
          document.getElementById('root')
        )
    });
};
