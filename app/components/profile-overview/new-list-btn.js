import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Input, Popover } from 'antd';
import { listAdd } from '../../local-flux/actions/list-actions';
import { selectLists } from '../../local-flux/selectors';
import { listMessages } from '../../locale-data/messages/list-messages';
import { generalMessages } from '../../locale-data/messages/general-messages';

class NewListBtn extends Component {
    state = {
        visible: false
    };
    wasVisible = false;

    hide = () => {
        this.setState({
            visible: false
        });
        this.props.form.setFieldsValue({ name: '', description: '' });
    }

    handleVisibleChange = (visible) => {
        this.wasVisible = true;
        this.setState({ visible });
        this.props.form.validateFields();
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        const { form } = this.props;
        const { name, description } = form.getFieldsValue();
        this.props.listAdd({ name, description, entryIds: [] });
        this.hide();
    }

    onKeyDown = (ev) => {
        if (ev.key === 'Escape') {
            this.hide();
        }
    };

    validateName = (rule, value, callback) => {
        const { intl, lists } = this.props;
        if (value === '') {
            callback(intl.formatMessage(listMessages.listNameRequired));
            return;
        }
        if (lists.find(list => list.get('name') === value)) {
            callback(intl.formatMessage(listMessages.listNameUnique));
            return;
        }
        callback();
    };

    render () {
        const { intl, form } = this.props;
        const { getFieldDecorator, getFieldError, getFieldsError, isFieldTouched } = form;
        // only show error after field was touched
        const listNameError = isFieldTouched('name') && getFieldError('name');
        const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

        const newListForm = (
          <div className="new-list-btn__form">
            <span className="new-list-btn__header">
              {intl.formatMessage(listMessages.createNew)}
            </span>
            <Form>
              <Form.Item
                label={intl.formatMessage(listMessages.listName)}
                colon={false}
                validateStatus={listNameError ? 'error' : ''}
                help={listNameError || ''}
              >
                {getFieldDecorator('name', {
                    rules: [{
                        validator: this.validateName,
                    }]
                })(
                  <Input
                    autoFocus
                    onKeyDown={this.onKeyDown}
                    maxLength="70"
                  />
                )}
              </Form.Item>
              <Form.Item
                label={intl.formatMessage(listMessages.shortDescription)}
                colon={false}
              >
                {getFieldDecorator('description')(
                  <Input
                    onKeyDown={this.onKeyDown}
                    maxLength="100"
                  />
                )}
              </Form.Item>
              <div className="new-list-btn__footer">
                <div className="new-list-btn__cancel-btn">
                  <Button
                    onClick={this.hide}
                  >
                    {intl.formatMessage(generalMessages.cancel)}
                  </Button>
                </div>
                <div className="new-list-btn__submit-btn">
                  <Button
                    disabled={hasErrors(getFieldsError())}
                    htmlType="submit"
                    onClick={this.handleSubmit}
                    type="primary"
                  >
                    {intl.formatMessage(generalMessages.create)}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        );

        return (
          <div className="new-list-btn__create">
            <Popover
              placement="bottomRight"
              content={this.wasVisible ? newListForm : null}
              trigger="click"
              visible={this.state.visible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Button
                size="large"
              >
                {intl.formatMessage(listMessages.createNew)}
              </Button>
            </Popover>
          </div>
        );
    }
}

NewListBtn.propTypes = {
    intl: PropTypes.shape(),
    form: PropTypes.shape(),
    lists: PropTypes.shape(),
    listAdd: PropTypes.func
};

function mapStateToProps (state) {
    return {
        lists: selectLists(state)
    };
}

export default Form.create()(connect(
    mapStateToProps,
    {
        listAdd
    }
)(injectIntl(NewListBtn)));

