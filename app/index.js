import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import createHashHistory from 'history/createHashHistory';
import Route from 'react-router/Route';
import { ConnectedRouter } from 'react-router-redux';
import en from 'react-intl/locale-data/en';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactPerf from 'react-addons-perf';
import rootSaga from './local-flux/sagas';
import configureStore from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import { getGeneralSettings } from './local-flux/services/settings-service';
import { AppContainer } from './containers';
import './styles/core.scss';
// import { ruMessages } from './locale-data/ru';

addLocaleData([...en]);
const history = createHashHistory();
const store = configureStore();
sagaMiddleware.run(rootSaga);

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

getGeneralSettings().then(settings =>
    render(
      <IntlProvider locale={settings.userlocale || 'en'} >
        <Provider store={store} >
          <ConnectedRouter history={history}>
            <Route component={AppContainer} />
          </ConnectedRouter>
        </Provider>
      </IntlProvider>,
      document.getElementById('root')
    )
);

