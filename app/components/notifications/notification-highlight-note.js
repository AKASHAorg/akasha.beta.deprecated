import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Icon, Input } from 'antd';
import { generalMessages, notificationMessages } from '../../locale-data/messages';

class NotificationHighlightNote extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    handleSave = () => {
        const { btnClose, editNote, notif } = this.props;
        editNote(notif.getIn(['values', 'id']), this.state.value);
        btnClose();
    }

    render () {
        const { intl, notif } = this.props;
        const hasText = !!this.state.value;
        return (
          <div className="notif-note">
            <div className="notif-note__message">
              <div className="notif-note__icon">
                <Icon type="check-circle" style={{ color: '#108ee9' }} />
              </div>
              <div className="notif-note__text">
                { intl.formatMessage(notificationMessages[notif.get('id')]) }
              </div>
            </div>
            <div className="notif-note__input">
              <Input
                size="large"
                placeholder={intl.formatMessage(notificationMessages.highlightSaveSuccessInputPlaceholder)}
                value={this.state.value}
                onChange={this.handleChange}
              />
            </div>
            {hasText &&
            <div className="notif-note__buttons">
              <div className="notif-note__cancel">
                <Button
                  size="small"
                  onClick={() => this.setState({ value: '' })}
                >
                  {intl.formatMessage(generalMessages.cancel)}
                </Button>
              </div>
              <div className="notif-note__save">
                <Button
                  type="primary"
                  size="small"
                  onClick={this.handleSave}
                >
                  {intl.formatMessage(generalMessages.save)}
                </Button>
              </div>
            </div>
            }
          </div>
        );
    }
}

NotificationHighlightNote.propTypes = {
    btnClose: PropTypes.func,
    editNote: PropTypes.func,
    intl: PropTypes.shape(),
    notif: PropTypes.shape()
};

export default NotificationHighlightNote;
