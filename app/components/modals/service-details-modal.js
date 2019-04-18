import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Button, Modal, Switch } from 'antd';
import { generalMessages } from '../../locale-data/messages';

const Footer = (props) => {
    const {
        intl, onCancel, onSave, onToggle, saveDisabled, toggleDisabled, toggleLabel,
        toggleOn
    } = props;
    return (
        <div className="service-details-modal__footer">
            <div className="service-details-modal__footer-left">
                <Switch
                    checked={ toggleOn }
                    disabled={ toggleDisabled }
                    onChange={ onToggle }
                    style={ { marginRight: '10px' } }
                />
                <div className="service-details-modal__toggle-label">
                    { toggleLabel }
                </div>
            </div>
            <div className="service-details-modal__footer-right">
                <Button onClick={ onCancel }>
                    <div className="service-details-modal__button-label">
                        { intl.formatMessage(generalMessages.cancel) }
                    </div>
                </Button>
                <Button
                    disabled={ saveDisabled }
                    onClick={ onSave }
                    type="primary"
                >
                    <div className="service-details-modal__button-label">
                        { intl.formatMessage(generalMessages.save) }
                    </div>
                </Button>
            </div>
        </div>
    );
};

const ServiceDetailsModal = props => (
    <Modal
        closable={ false }
        footer={ <Footer { ...props } /> }
        onCancel={ props.onCancel }
        visible
        width="600px"
        wrapClassName="service-details-modal"
    >
        { props.children }
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
