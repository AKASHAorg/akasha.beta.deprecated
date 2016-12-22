/**
 * From https://gist.github.com/mirague/c05f4da0d781a9b339b501f1d5d33c37
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */

import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';
import { getMuiTheme } from 'material-ui/styles';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import * as messages from '../../../app/locale-data/messages';

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
const { intl } = intlProvider.getChildContext();
const muiTheme = getMuiTheme();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp (node) {
    return React.cloneElement(node, { intl });
}

export function shallowWithIntl (node) {
    return shallow(nodeWithIntlProp(node), { context: { intl } });
}

export function mountWithIntl (node) {
    return mount(nodeWithIntlProp(node), {
        context: { intl, muiTheme },
        childContextTypes: {
            intl: intlShape,
            muiTheme: React.PropTypes.object
        },
        getChildContext () {
            return {
                muiTheme: getMuiTheme(baseTheme)
            };
        }
    });
}
