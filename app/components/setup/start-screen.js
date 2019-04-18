import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { setupMessages } from '../../locale-data/messages';
import { settingsSelectors } from '../../local-flux/selectors';

const StartScreen = (props) => {
    const { darkTheme, lightSync, intl } = props;
    return (
        <div
            className={ `start-screen start-screen${ (lightSync === 'fast') ? '_light' : '' }` }
        >
            <div
                className={
                    `start-screen__image
            start-screen__image${ darkTheme ? '_dark' : '' }`
                }
            />
            <p className="start-screen__text">
                { intl.formatMessage(setupMessages.normalSyncDescription) }
            </p>
        </div>
    );
};

StartScreen.propTypes = {
    darkTheme: PropTypes.bool,
    lightSync: PropTypes.string,
};

function mapStateToProps (state) {
    return {
        darkTheme: settingsSelectors.getThemeSettings(state),
        lightSync: settingsSelectors.getGethSyncModeSettings(state),
    };
}

export default connect(
    mapStateToProps,
    {}
)(injectIntl(StartScreen));
