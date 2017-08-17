import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import zh from 'react-intl/locale-data/zh';
import ruMessages from './locale-data/ru.json';
import zhMessages from './locale-data/zh.json';
import enMessages from './locale-data/en.json';

const localeMessages = {
    en: enMessages,
    ru: ruMessages,
    zh: zhMessages
};

addLocaleData([...en, ...ru, ...zh]);

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
    const locale = state.settingsState.getIn(['general', 'locale']);
    return { locale, messages: localeMessages[locale] };
}

export default connect(mapStateToProps)(ConnectedIntlProvider);
