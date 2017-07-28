import React from 'react';
import './styles/ant-icons/iconfont.css';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import createHashHistory from 'history/createHashHistory';
import Route from 'react-router-dom/Route';
import { ConnectedRouter } from 'react-router-redux';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import ro from 'react-intl/locale-data/ro';
import ch from 'react-intl/locale-data/zh';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactPerf from 'react-addons-perf';
import rootSaga from './local-flux/sagas';
import configureStore from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import { generalSettingsRequest } from './local-flux/services/settings-service';
import { AppContainer } from './containers';
import './styles/core.scss';
import ruMessages from './locale-data/ru.json';
import zhMessages from './locale-data/zh.json';
import enMessages from './locale-data/en.json';

if (process.env.DARK_THEME) {
    require('./styles/ant-vars/extract-dark-theme.less');
} else {
    require('./styles/ant-vars/extract-default-theme.less');
}


const localeMessages = {
    en: enMessages,
    ru: ruMessages,
    zh: zhMessages
};

const DEFAULT_LOCALE = 'en';
addLocaleData([...en, ...ru, ...ro, ...ch]);
const history = createHashHistory();
const store = configureStore();
sagaMiddleware.run(rootSaga);

window.Perf = ReactPerf;

injectTapEventPlugin();

generalSettingsRequest().then(settings =>
    render(
      <IntlProvider
        locale={settings.userlocale || DEFAULT_LOCALE}
        messages={localeMessages[settings.userlocale] || localeMessages[DEFAULT_LOCALE]}
      >
        <Provider store={store} >
          <ConnectedRouter history={history}>
            <Route component={AppContainer} />
          </ConnectedRouter>
        </Provider>
      </IntlProvider>,
      document.getElementById('root')
    )
);

