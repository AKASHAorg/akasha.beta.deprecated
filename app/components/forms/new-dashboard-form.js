import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Input } from 'antd';
import * as columnTypes from '../../constants/columns';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { dashboardAdd } from '../../local-flux/actions/dashboard-actions';
import { selectAllDashboards } from '../../local-flux/selectors';

const FormItem = Form.Item;

const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

class NewDashboardForm extends Component {

    componentDidMount () {
        this.props.form.validateFields();
    }

    componentWillReceiveProps (nextProps) {
        const { dashboards } = nextProps;
        // "Navigate" back after dashboard was saved
        if (!dashboards.equals(this.props.dashboards)) {
            this.props.onCancel();
        }
    }

    onKeyDown = (ev) => {
        if (ev.key === 'Escape') {
            this.props.onCancel();
        }
    };

    onSubmit = (ev) => {
        ev.preventDefault();
        const { form, tag } = this.props;
        const { name } = form.getFieldsValue();
        const columns = [{ type: columnTypes.tag, value: tag }];
        this.props.dashboardAdd(name, columns);
    };

    validateName = (rule, value, callback) => {
        const { dashboards, intl } = this.props;
        if (dashboards.find(board => board.get('name') === value)) {
            callback(intl.formatMessage(dashboardMessages.dashboardNameUnique));
            return;
        }
        callback();
    };

    render () {
        const { form, intl, onCancel } = this.props;
        const { getFieldDecorator, getFieldError, getFieldsError, isFieldTouched } = form;
        // only show error after field was touched
        const nameError = isFieldTouched('name') && getFieldError('name');

        return (
          <Form className="new-dashboard-form" hideRequiredMark onSubmit={this.onSubmit}>
            <div className="new-dashboard-form__title">
              {intl.formatMessage(dashboardMessages.addToNewDashboard)}
            </div>
            <FormItem
              className="new-dashboard-form__form-item"
              colon={false}
              label={
                <span className="uppercase">
                  {intl.formatMessage(dashboardMessages.dashboardName)}
                </span>
              }
              validateStatus={nameError ? 'error' : ''}
              help={nameError || ''}
            >
              {getFieldDecorator('name', {
                  rules: [{
                      required: true,
                      message: intl.formatMessage(dashboardMessages.dashboardNameRequired)
                  }, {
                      validator: this.validateName,
                  }]
              })(
                <Input
                  autoFocus
                  onKeyDown={this.onKeyDown}
                  placeholder={intl.formatMessage(dashboardMessages.namePlaceholder)}
                />
              )}
            </FormItem>
            <div className="new-dashboard-form__actions">
              <Button className="new-dashboard-form__button" onClick={onCancel}>
                <span className="new-dashboard-form__button-label">
                  {intl.formatMessage(generalMessages.cancel)}
                </span>
              </Button>
              <Button
                className="new-dashboard-form__button"
                disabled={hasErrors(getFieldsError())}
                htmlType="submit"
                onClick={this.onSubmit}
                type="primary"
              >
                <span className="new-dashboard-form__button-label">
                  {intl.formatMessage(generalMessages.create)}
                </span>
              </Button>
            </div>
          </Form>
        );
    }
}

NewDashboardForm.propTypes = {
    dashboardAdd: PropTypes.func.isRequired,
    dashboards: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    onCancel: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,
};

function mapStateToProps (state) {
    return {
        dashboards: selectAllDashboards(state)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAdd
    }
)(Form.create()(injectIntl(NewDashboardForm)));
