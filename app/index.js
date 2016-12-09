import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import en from 'react-intl/locale-data/en';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactPerf from 'react-addons-perf';
import routes from './routes';
import configureStore from './local-flux/store/configureStore';
// import { ruMessages } from './locale-data/ru';

addLocaleData([...en]);
const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

window.Perf = ReactPerf;

function hashLinkScroll() {
    const { hash } = window.location;
    if (hash.split('#')[2] ) {
        setTimeout(() => {
            const id = hash.split('#')[2];
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView();
            }
        }, 300);
    }
}

injectTapEventPlugin();
render(
  <Provider store={store} >
    <IntlProvider locale="en" >
      <Router history={history} onUpdate={hashLinkScroll} >
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
