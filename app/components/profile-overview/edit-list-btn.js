import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Input, Popover } from 'antd';
import { listEdit } from '../../local-flux/actions/list-actions';
import { listMessages } from '../../locale-data/messages/list-messages';
import { generalMessages } from '../../locale-data/messages/general-messages';
import { Icon } from '../';

class EditListBtn extends Component {
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
        const { form, list } = this.props;
        this.wasVisible = true;
        if (visible) {
            form.setFieldsValue({ name: list.get('name'), description: list.get('description') });
        }
        this.setState({ visible });
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        const { form, list } = this.props;
        const { name, description } = form.getFieldsValue();
        this.props.listEdit({ id: list.get('id'), name, description });
        this.hide();
    }

    onKeyDown = (ev) => {
        if (ev.key === 'Escape') {
            this.hide();
        }
    };

    render () {
        const { intl, form } = this.props;
        const { getFieldDecorator } = form;

        const newListForm = (
          <div className="edit-list-btn__form">
            <span className="edit-list-btn__header">
              {intl.formatMessage(listMessages.editList)}
            </span>
            <Form>
              <Form.Item
                label={intl.formatMessage(listMessages.listName)}
                colon={false}
              >
                {getFieldDecorator('name')(
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
              <div className="edit-list-btn__footer">
                <div className="edit-list-btn__cancel-btn">
                  <Button
                    onClick={this.hide}
                  >
                    {intl.formatMessage(generalMessages.cancel)}
                  </Button>
                </div>
                <div className="edit-list-btn__submit-btn">
                  <Button
                    htmlType="submit"
                    onClick={this.handleSubmit}
                    type="primary"
                  >
                    {intl.formatMessage(generalMessages.save)}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        );

        return (
          <div className="edit-list-btn__edit">
            <Popover
              arrowPointAtCenter
              placement="bottomRight"
              content={this.wasVisible ? newListForm : null}
              trigger="click"
              visible={this.state.visible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Icon
                className="content-link edit-list-btn__icon"
                type="edit"
              />
            </Popover>
          </div>
        );
    }
}

EditListBtn.propTypes = {
    intl: PropTypes.shape(),
    form: PropTypes.shape(),
    list: PropTypes.shape(),
    listEdit: PropTypes.func
};

export default Form.create()(connect(
    () => ({}),
    {
        listEdit
    }
)(injectIntl(EditListBtn)));

