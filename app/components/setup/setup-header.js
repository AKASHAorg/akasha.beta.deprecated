import PropTypes from 'prop-types';
import React from 'react';
import { ServiceStatusBar } from '../';

const SetupHeader = ({ split }) => (
  <div className="setup-header">
    <div className={`setup-header__title heading ${split && 'setup-pages_left'}`} />
    <div className={`setup-header__services ${split && 'setup-pages_right'}`}>
      {/* <ServiceStatusBar withCircles /> */}
    </div>
  </div>
);

SetupHeader.propTypes = {
    split: PropTypes.bool
};

export default SetupHeader;
