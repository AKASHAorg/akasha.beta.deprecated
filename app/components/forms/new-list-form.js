import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Form, Input } from 'antd';
import { generalMessages, listMessages } from '../../locale-data/messages';

const FormItem = Form.Item;

const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

class NewListForm extends Component {
    componentDidMount () {
        this.props.form.validateFields();
    }

    componentWillReceiveProps (nextProps) {
        const { lists } = nextProps;
        // "Navigate" back to list-popover after list was saved
        if (!lists.equals(this.props.lists)) {
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
        const { authorEthAddress, entryId, entryType, form, onSave } = this.props;
        const { name, description } = form.getFieldsValue();
        onSave({ name, description, entryIds: [{ entryId, entryType, authorEthAddress }] });
    };

    validateName = (rule, value, callback) => {
        const { intl, lists } = this.props;
        if (lists.find(list => list.get('name') === value)) {
            callback(intl.formatMessage(listMessages.listNameUnique));
            return;
        }
        callback();
    };

    render () {
        const { form, intl, onCancel } = this.props;
        const { getFieldDecorator, getFieldError, getFieldsError, isFieldTouched } = form;
        // only show error after field was touched
        const listNameError = isFieldTouched('name') && getFieldError('name');

        return (
          <Form className="new-list-form" hideRequiredMark onSubmit={this.onSubmit}>
            <div className="new-list-form__title">
              {intl.formatMessage(listMessages.addToNewList)}
            </div>
            <FormItem
              className="new-list-form__form-item"
              colon={false}
              label={
                <span className="uppercase">
                  {intl.formatMessage(listMessages.listName)}
                </span>
              }
              validateStatus={listNameError ? 'error' : ''}
              help={listNameError || ''}
            >
              {getFieldDecorator('name', {
                  rules: [{
                      required: true,
                      message: intl.formatMessage(listMessages.listNameRequired)
                  }, {
                      validator: this.validateName,
                  }]
              })(
                <Input
                  autoFocus
                  onKeyDown={this.onKeyDown}
                  placeholder={intl.formatMessage(listMessages.namePlaceholder)}
                />
              )}
            </FormItem>
            <FormItem
              className="new-list-form__form-item"
              colon={false}
              label={
                <span className="new-list-form__label">
                  {intl.formatMessage(listMessages.shortDescription)}
                </span>
              }
            >
              {getFieldDecorator('description')(
                <Input
                  onKeyDown={this.onKeyDown}
                  placeholder={intl.formatMessage(listMessages.descriptionPlaceholder)}
                />
              )}
            </FormItem>
            <div className="new-list-form__actions">
              <Button className="new-list-form__button" onClick={onCancel} size="small">
                <span className="new-list-form__button-label">
                  {intl.formatMessage(generalMessages.cancel)}
                </span>
              </Button>
              <Button
                className="new-list-form__button"
                disabled={hasErrors(getFieldsError())}
                htmlType="submit"
                onClick={this.onSubmit}
                size="small"
                type="primary"
              >
                <span className="new-list-form__button-label">
                  {intl.formatMessage(generalMessages.save)}
                </span>
              </Button>
            </div>
          </Form>
        );
    }
}

NewListForm.propTypes = {
    authorEthAddress: PropTypes.string,
    entryId: PropTypes.string.isRequired,
    entryType: PropTypes.number.isRequired,
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    lists: PropTypes.shape().isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default Form.create()(injectIntl(NewListForm));
