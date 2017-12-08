import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedDate, injectIntl } from 'react-intl';
import { Modal, Popover } from 'antd';
import { generalMessages, highlightMessages } from '../../locale-data/messages';
import { Avatar, Icon, ProfilePopover } from '../';

class HighlightHeader extends Component {
    state = {
        visible: false,
        deleteModalVisible: false
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }

    edit = () => {
        const { highlight, toggleEditing, toggleNoteEditable } = this.props;
        toggleNoteEditable(highlight.get('id'));
        toggleEditing(highlight.get('id'));
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }

    deleteHighlight = () => {
        this.setState({
            deleteModalVisible: true
        });
    };

    showDeleteModal = () => {
        const { intl, deleteHighlight, highlight } = this.props;
        const onOk = () => {
            deleteHighlight(highlight.get('id'));
        };
        const content = intl.formatMessage(highlightMessages.delete);
        return (
          <Modal
            visible={this.state.deleteModalVisible}
            className={'delete-modal'}
            width={347}
            okText={intl.formatMessage(generalMessages.delete)}
            okType={'danger'}
            cancelText={intl.formatMessage(generalMessages.cancel)}
            onOk={onOk}
            onCancel={() => { this.setState({ deleteModalVisible: false }); }}
            closable={false}
          >
            {content}
          </Modal>
        );
    }

    render () {
        const { containerRef, highlight, intl, publisher } = this.props;

        const date = (
          <FormattedDate
            day="2-digit"
            month="long"
            value={new Date(highlight.get('timestamp'))}
            year="numeric"
          />
        );
        const entryUrl = `/${publisher.get('ethAddress')}/${highlight.get('entryId')}`;

        const menu = (
          <div onClick={this.hide}>
            <div className="popover-menu__item">
              {intl.formatMessage(highlightMessages.startEntry)}
            </div>
            <div
              onClick={this.edit}
              className="popover-menu__item"
            >
              {highlight.get('notes') ?
                  intl.formatMessage(highlightMessages.editNote) :
                  intl.formatMessage(highlightMessages.addNote)
                }
            </div>
            <div
              onClick={this.deleteHighlight}
              className="popover-menu__item"
            >
              {intl.formatMessage(highlightMessages.deleteHighlight)}
            </div>
          </div>
        );

        return (
          <div className="highlight-header">
            {this.showDeleteModal()}
            <ProfilePopover ethAddress={publisher.get('ethAddress')} containerRef={containerRef}>
              <Avatar
                className="highlight-header__avatar"
                firstName={publisher.get('firstName')}
                image={publisher.get('avatar')}
                lastName={publisher.get('lastName')}
                size="small"
              />
            </ProfilePopover>
            <div className="highlight-header__text">
              <ProfilePopover ethAddress={publisher.get('ethAddress')} containerRef={containerRef}>
                <span className="content-link">
                  {publisher.get('akashaId') || highlight.get('publisher')}
                </span>
              </ProfilePopover>
              <div className="highlight-header__subtitle">
                <div className="highlight-header__entry-title overflow-ellipsis">
                  <Link className="unstyled-link content-link highlight-header__link" to={entryUrl}>
                    {highlight.get('entryTitle')}
                  </Link>
                </div>
                <span style={{ margin: '0px 5px' }}>|</span>
                {date}
              </div>
            </div>
            <Popover
              arrowPointAtCenter
              placement="bottomLeft"
              content={menu}
              trigger="click"
              overlayClassName="popover-menu"
              visible={this.state.visible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Icon className="content-link highlight-header__more-icon" type="more" />
            </Popover>
          </div>
        );
    }
}

HighlightHeader.propTypes = {
    containerRef: PropTypes.shape(),
    deleteHighlight: PropTypes.func.isRequired,
    highlight: PropTypes.shape().isRequired,
    toggleEditing: PropTypes.func.isRequired,
    toggleNoteEditable: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    publisher: PropTypes.shape().isRequired
};

export default injectIntl(HighlightHeader);
