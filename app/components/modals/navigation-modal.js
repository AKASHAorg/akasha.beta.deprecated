import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
import { UrlInput } from '../';
import { formMessages } from '../../locale-data/messages';

const NavigationModal = ({ intl, toggleNavigationModal }) => (
  <Modal
    footer={null}
    onCancel={toggleNavigationModal}
    visible
  >
    <div className="navigation-modal">
      <div className="flex-center-x navigation-modal__title">
        {intl.formatMessage(formMessages.navigateTitle)}
      </div>
      <div className="flex-center-x navigation-modal__subtitle">
        {intl.formatMessage(formMessages.navigateSubtitle)}
      </div>
      <UrlInput autoFocus onSubmit={toggleNavigationModal} />
    </div>
  </Modal>
);

NavigationModal.propTypes = {
    intl: PropTypes.shape().isRequired,
    toggleNavigationModal: PropTypes.func.isRequired,
};

export default injectIntl(NavigationModal);
