import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../../locale-data/messages';
import { ServiceStatusBar } from '../';

const SetupHeader = ({ intl, split }) => (
  <div className="setup-header">
    <div className={`setup-header__title heading ${split && 'setup-pages_left'}`}>
      {intl.formatMessage(generalMessages.akasha)}
    </div>
    <div className={`setup-header__services ${split && 'setup-pages_right'}`}>
      <ServiceStatusBar />
    </div>
  </div>
);

SetupHeader.propTypes = {
    intl: PropTypes.shape(),
    split: PropTypes.bool
};

export default injectIntl(SetupHeader);
