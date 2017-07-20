import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Button, Modal, Switch } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import styles from './service-details-modal.scss';

const Footer = (props) => {
    const { intl, onCancel, onSave, onToggle, saveDisabled, toggleDisabled, toggleLabel,
        toggleOn } = props;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '0 0 auto', height: '36px', display: 'flex', alignItems: 'center' }}>
          <Switch
            checked={toggleOn}
            disabled={toggleDisabled}
            onChange={onToggle}
            style={{ marginRight: '10px' }}
          />
          <div style={{ fontSize: '14px', fontWeight: '500' }}>
            {toggleLabel}
          </div>
        </div>
        <div style={{ flex: '1 1 auto' }} >
          <Button
            onClick={onCancel}
            size="large"
          >
            <div className={styles.buttonLabel}>
              {intl.formatMessage(generalMessages.cancel)}
            </div>
          </Button>
          <Button
            disabled={saveDisabled}
            onClick={onSave}
            size="large"
            type="primary"
          >
            <div className={styles.buttonLabel}>
              {intl.formatMessage(generalMessages.save)}
            </div>
          </Button>
        </div>
      </div>
    );
};

const ServiceDetailsModal = props => (
  <Modal
    closable={false}
    footer={<Footer {...props} />}
    onCancel={props.onCancel}
    visible
    width="600px"
    wrapClassName={`${styles.root} service-details-modal`}
  >
    {props.children}
  </Modal>
);

Footer.propTypes = {
    intl: PropTypes.shape().isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    saveDisabled: PropTypes.bool,
    toggleDisabled: PropTypes.bool,
    toggleLabel: PropTypes.string,
    toggleOn: PropTypes.bool
};

ServiceDetailsModal.propTypes = {
    children: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
};

export default injectIntl(ServiceDetailsModal);
