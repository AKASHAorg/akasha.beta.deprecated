import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { createHashHistory } from 'history';
import { ConnectedRouter } from 'react-router-redux';
import en from 'react-intl/locale-data/en';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactPerf from 'react-addons-perf';
import rootSaga from './local-flux/sagas';
import routes from './routes';
import configureStore from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import { getGeneralSettings } from './local-flux/services/settings-service';
// import { ruMessages } from './locale-data/ru';

addLocaleData([...en]);
const store = configureStore();
sagaMiddleware.run(rootSaga);
const history = createHashHistory();

window.Perf = ReactPerf;

// function hashLinkScroll () {
//     const { hash } = window.location;
//     if (hash.split('#')[2]) {
//         setTimeout(() => {
//             const id = hash.split('#')[2];
//             const element = document.getElementById(id);
//             if (element) {
//                 element.scrollIntoView();
//             }
//         }, 300);
//     }
// }

injectTapEventPlugin();
getGeneralSettings().then((settings) => {
    render(
      <Provider store={store} >
        <IntlProvider locale={settings.userlocale || 'en'} >
          <ConnectedRouter history={history}>
            {routes}
          </ConnectedRouter>
        </IntlProvider>
      </Provider>,
      document.getElementById('root')
    );
});

