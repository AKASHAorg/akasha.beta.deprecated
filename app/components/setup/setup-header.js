import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../../locale-data/messages';
import { ServiceStatusBar } from '../';
import styles from './setup-header.scss';
import setupStyles from './setup.scss';

const SetupHeader = ({ intl, split }) => (
  <div className={styles.root}>
    <div className={`${styles.title} ${split && setupStyles.leftColumn}`}>
      {intl.formatMessage(generalMessages.akasha)}
    </div>
    <div className={styles.services}>
      <ServiceStatusBar />
    </div>
  </div>
);

SetupHeader.propTypes = {
    intl: PropTypes.shape(),
    split: PropTypes.bool
};

export default injectIntl(SetupHeader);
