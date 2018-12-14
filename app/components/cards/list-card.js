import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import Link from 'react-router-dom/Link';
import { Card, Modal } from 'antd';
import { EditListBtn, Icon } from '../';
import { generalMessages } from '../../locale-data/messages';
import { listMessages } from '../../locale-data/messages/list-messages';

class ListCard extends Component {
    state = {
        deleteModalVisible: false
    }

    deleteList = () => {
        this.setState({
            deleteModalVisible: true
        });
    };

    showDeleteModal = () => {
        const { intl, deleteList, list } = this.props;
        const onOk = () => {
            deleteList(list.get('id'));
        };
        const content = intl.formatMessage(listMessages.deleteList);
        return (
          <Modal
            visible={this.state.deleteModalVisible}
            className={'delete-modal'}
            width={320}
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
        const { intl, list } = this.props;

        const date = (
          <FormattedDate
            day="2-digit"
            month="long"
            value={new Date(list.get('timestamp'))}
            year="numeric"
          />
        );
        const listUrl = `/profileoverview/lists/${list.get('id')}`;
        const title = (
          <div className="list-card__title">
            <div className="heading flex-center-y content-link list-card__list-name">
              <Link className="unstyled-link" to={listUrl}>
                {list.get('name')}
              </Link>
            </div>
            <div className="flex-center-y list-card__date">
              <span>
                {intl.formatMessage(generalMessages.created)}
              </span>
              {date}
            </div>
          </div>
        );

        return (
          <Card className="list-card" title={title}>
            {this.showDeleteModal()}
            <div className="content-link">
              <Link className="unstyled-link" to={listUrl}>
                <div className="list-card__description">
                  {list.get('description')}
                </div>
              </Link>
            </div>
            <div className="list-card__footer">
              <Link className="unstyled-link" to={listUrl}>
                <div className="content-link list-card__left-actions">
                  <div>{list.get('entryIds').size}</div>
                  <Icon className="list-card__icon" type="entry" />
                </div>
              </Link>
              <div className="list-card__right-actions">
                <EditListBtn
                  list={list}
                />
                <Icon
                  className="content-link list-card__icon list-card__icon_delete"
                  onClick={this.deleteList}
                  type="trash"
                />
              </div>
            </div>
          </Card>
        );
    }
}

ListCard.propTypes = {
    deleteList: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    list: PropTypes.shape(),
};

export default injectIntl(ListCard);
