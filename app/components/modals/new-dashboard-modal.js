import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Input, Form, Modal } from 'antd';
import { generalMessages, dashboardMessages, formMessages } from '../../locale-data/messages';
import { toggleNewDashboardModal } from '../../local-flux/actions/app-actions';
import { dashboardAdd } from '../../local-flux/actions/dashboard-actions';

class NewDashboardModal extends Component {
    componentDidMount () {
        setTimeout(() => {
            if (this.input) {
                this.input.focus();
            }
        }, 50);
    }

    handleCancel = () => {
        this.props.toggleNewDashboardModal();
    }

    handleSubmit = () => {
        const { form } = this.props;
        const { name } = form.getFieldsValue();
        this.props.dashboardAdd(name);
        this.props.toggleNewDashboardModal();
    }

    onKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            this.handleSubmit();
        }
    };

    getInputRef = (el) => { this.input = el; };

    render () {
        const { intl, form } = this.props;
        const { getFieldDecorator } = form;

        return (
          <Modal
            width="450px"
            onCancel={this.props.toggleNewDashboardModal}
            visible
            wrapClassName="new-dashboard-modal"
            footer={[
              <div key="dashboardModalFooterLeft" className="new-dashboard-modal__footer-left">
              </div>,
              <div key="dashboardModalFooterRight" className="new-dashboard-modal__footer-right">
                <Button onClick={this.handleCancel}>
                  {intl.formatMessage(generalMessages.cancel)}
                </Button>
                <Button type="primary" onClick={this.handleSubmit}>
                  {intl.formatMessage(generalMessages.create)}
                </Button>
              </div>
            ]}
          >
            <div className="new-dashboard-modal__title">
              {intl.formatMessage(dashboardMessages.createNew)}
            </div>
            <div className="new-dashboard-modal__subtitle">
              {intl.formatMessage(dashboardMessages.createNewSubtitle)}
            </div>
            <div className="new-dashboard-modal__form">
              <Form onSubmit={this.handleSubmit}>
                <Form.Item
                    label={intl.formatMessage(formMessages.name)}
                    colon={false}
                >
                  {getFieldDecorator('name')(
                    <Input
                        onKeyDown={this.onKeyDown}
                        placeholder={intl.formatMessage(dashboardMessages.modalInputPlaceholder)}
                        ref={this.getInputRef}
                    />
                )}
                </Form.Item>
              </Form>
            </div>
          </Modal>
        );
    }
    
}


NewDashboardModal.propTypes = {
    activeDashboard: PropTypes.string,
    dashboardAdd: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape(),
    match: PropTypes.shape(),
    form: PropTypes.shape(),
    toggleNewDashboardModal: PropTypes.func.isRequired,
};

export default Form.create()(connect(
    () => ({}),
    {
        dashboardAdd,
        toggleNewDashboardModal
    }
)(injectIntl(NewDashboardModal)));
