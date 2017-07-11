import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../../locale-data/messages';
import { ServiceStatusBar } from '../';
import styles from './setup-header.scss';

const SetupHeader = ({ intl }) => (
  <div className={styles.root}>
    <div className={styles.title}>
      {intl.formatMessage(generalMessages.akasha)}
    </div>
    <div>
      <ServiceStatusBar />
    </div>
  </div>
);

SetupHeader.propTypes = {
    intl: PropTypes.shape()
};

export default injectIntl(SetupHeader);
