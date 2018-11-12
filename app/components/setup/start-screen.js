import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { setupMessages } from '../../locale-data/messages';
import { getThemeSettings, selectIsLightSync } from '../../local-flux/selectors';

const StartScreen = (props) => {
    const { darkTheme, lightSync, intl } = props;
    return (
      <div
        className={`start-screen start-screen${lightSync ? '_light' : ''}`}
      >
        <div
          className={
            `start-screen__image
            start-screen__image${darkTheme ? '_dark' : ''}`
          }
        />
        <p className="start-screen__text">
          {intl.formatMessage(setupMessages.normalSyncDescription)}
        </p>
      </div>
    );
};

StartScreen.propTypes = {
    darkTheme: PropTypes.bool,
    lightSync: PropTypes.bool,
};

function mapStateToProps (state) {
    return {
        darkTheme: getThemeSettings(state),
        lightSync: selectIsLightSync(state),
    };
}

export default connect(
    mapStateToProps,
    {}
)(injectIntl(StartScreen));
