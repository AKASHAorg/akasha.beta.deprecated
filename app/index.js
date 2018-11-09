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
import configureStore from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import { AppContainer } from './containers';
import './styles/core.scss';
import(
  process.env.DARK_THEME ?
    './styles/ant-vars/extract-dark-theme.less' : './styles/ant-vars/extract-default-theme.less'
  );


// @TODO: add context logger
export const bootstrap = (web3Enabled = false, vault = false, channel, logger) => {
  const history = getHistory();
  const store = configureStore();
  const MainContext = React.createContext({logger, channel});
  sagaMiddleware.run(rootSaga);
  render(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <Router history={history}>
          <Route render={(props) =>
            (
              <MainContext.Consumer>
                <AppContainer unlocked={vault} web3={web3Enabled} {...props}/>
              </MainContext.Consumer>
            )}/>
        </Router>
      </ConnectedIntlProvider>
    </Provider>,
    document.getElementById('root')
  )
};
