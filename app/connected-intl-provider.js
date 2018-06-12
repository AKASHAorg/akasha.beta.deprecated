import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import zh from 'react-intl/locale-data/zh';
import es from 'react-intl/locale-data/es';
import fi from 'react-intl/locale-data/fi';
import id from 'react-intl/locale-data/id';
import ruMessages from './locale-data/ru.json';
import zhMessages from './locale-data/zh.json';
import enMessages from './locale-data/en.json';
import esMessages from './locale-data/es.json';
import fiMessages from './locale-data/fi.json';
import idMessages from './locale-data/id.json';

const localeMessages = {
    en: enMessages,
    ru: ruMessages,
    zh: zhMessages,
    es: esMessages,
    fi: fiMessages,
    id: idMessages,
};

addLocaleData([...en, ...es, ...ru, ...zh, ...fi, ...id]);

const ConnectedIntlProvider = (props) => {
    const { children, locale } = props;
    return (
      <IntlProvider
        locale={locale}
        messages={localeMessages[locale]}
        key={locale}
      >
        {children}
      </IntlProvider>
    );
};

ConnectedIntlProvider.propTypes = {
    children: PropTypes.element,
    locale: PropTypes.string
};


function mapStateToProps (state) {
    return {
        locale: state.settingsState.getIn(['general', 'locale'])
    };
}

export default connect(mapStateToProps)(ConnectedIntlProvider);
