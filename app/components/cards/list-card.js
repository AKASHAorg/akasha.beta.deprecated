import PropTypes from 'prop-types';
import React from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import { Card, Icon } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { PanelLink } from '../';

const ListCard = (props) => {
    const { intl, list, deleteList } = props;
    const date = (
      <FormattedDate
        day="2-digit"
        month="long"
        value={new Date(list.get('timestamp'))}
        year="numeric"
      />
    );
    const listUrl = `lists/${list.get('name')}`;
    const title = (
      <div className="list-card__title">
        <div className="heading flex-center-y content-link list-card__list-name">
          <PanelLink to={listUrl}>
            {list.get('name')}
          </PanelLink>
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
        <div className="content-link">
          <PanelLink to={listUrl}>
            <div>
              {list.get('description')}
            </div>
          </PanelLink>
        </div>
        <div className="list-card__footer">
          <PanelLink to={listUrl}>
            <div className="content-link list-card__left-actions">
              <Icon type="file-text list-card__icon" />
              <div>{list.get('entryIds').size}</div>
            </div>
          </PanelLink>
          <div className="list-card__right-actions">
            <Icon className="content-link list-card__icon" type="edit" />
            <Icon
              className="content-link list-card__icon"
              onClick={() => deleteList(list.get('id'), list.get('name'))}
              type="delete"
            />
          </div>
        </div>
      </Card>
    );
};

ListCard.propTypes = {
    deleteList: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    list: PropTypes.shape(),
};

export default injectIntl(ListCard);
