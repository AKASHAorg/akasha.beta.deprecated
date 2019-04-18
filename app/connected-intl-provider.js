import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import zh from 'react-intl/locale-data/zh';
import es from 'react-intl/locale-data/es';
import fi from 'react-intl/locale-data/fi';
import id from 'react-intl/locale-data/id';
import ru_RU_messages from './locale-data/ru_RU.json';
import zh_CN_messages from './locale-data/zh_CN.json';
import en_US_messages from './locale-data/en_US.json';
import es_ES_messages from './locale-data/es_ES.json';
import fi_FI_messages from './locale-data/fi_FI.json';
import id_ID_messages from './locale-data/id_ID.json';

// WARNING: we should use dashes instead underscores for the keys of this object
// because it is supported by react-intl! for example
// localeMessages = { 'en-EN': en_EN_messages, 'es-ES': es_ES_messages, ...etc }

const localeMessages = {
    'en-US': en_US_messages,
    'ru-RU': ru_RU_messages,
    'zh-CN': zh_CN_messages,
    'es-ES': es_ES_messages,
    'fi-FI': fi_FI_messages,
    'id-ID': id_ID_messages,
};

addLocaleData([...en, ...es, ...ru, ...zh, ...fi, ...id]);

const ConnectedIntlProvider = (props) => {
    const { children, locale } = props;
    return (
        <IntlProvider
            locale={ locale }
            messages={ localeMessages[locale] }
            key={ locale }
        >
            { children }
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
