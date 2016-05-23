import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ruMessages } from './locale-data/ru';
// temporary

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

injectTapEventPlugin();

render(
  <Provider store={store} >
    <IntlProvider locale="ru" messages={ruMessages} >
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
