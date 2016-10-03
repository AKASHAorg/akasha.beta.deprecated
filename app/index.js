import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxAsyncConnect } from 'redux-connect';
import { IntlProvider } from 'react-intl';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';
import configureStore from './local-flux/store/configureStore';
import { ruMessages } from './locale-data/ru';
import debug from 'debug';
import ReactPerf from 'react-addons-perf';

window.appDebug = debug.enable('App:*');
// temporary

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

global.Perf = ReactPerf;

injectTapEventPlugin();
render(
  <Provider store={store} >
    <IntlProvider locale="en" >
      <Router history={history} >
        {routes}
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production') {
  // Use require because imports can't be conditional.
  // In production, you should ensure process.env.NODE_ENV
  // is envified so that Uglify can eliminate this
  // module and its dependencies as dead code.
  // require('./createDevToolsWindow')(store);
}
