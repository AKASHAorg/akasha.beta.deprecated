import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedDate } from 'react-intl';
import { Icon } from 'antd';
import { Avatar, PanelLink } from './';

const HighlightHeader = (props) => {
    const { deleteHighlight, editable, highlight, publisher } = props;

    const date = (
      <FormattedDate
        day="2-digit"
        month="long"
        value={new Date(highlight.get('timestamp'))}
        year="numeric"
      />
    );
    const highlightUrl = `highlights/${highlight.get('id')}`;
    const publisherUrl = `/@${highlight.get('publisher')}`;
    const entryUrl = `${publisherUrl}/${highlight.get('entryId')}`;

    return (
      <div className="highlight-header">
        <Link className="highlight-header__link" to={publisherUrl}>
          <Avatar
            className="highlight-header__avatar"
            firstName={publisher.get('firstName')}
            image={publisher.get('avatar')}
            lastName={publisher.get('lastName')}
            size="small"
          />
        </Link>
        <div className="highlight-header__text">
          <Link className="unstyled-link content-link highlight-header__link" to={publisherUrl}>
            {highlight.get('publisher')}
          </Link>
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
        <div className="highlight-header__actions">
          <div className="content-link highlight-header__button">
            <Icon className="highlight-header__icon" type="file" />
            <span className="highlight-header__button-text">
              Start an entry
            </span>
          </div>
          {editable &&
            <div className="content-link highlight-header__button">
              <PanelLink to={highlightUrl}>
                <Icon className="highlight-header__icon" type="edit" />
                <span className="highlight-header__button-text">Edit note</span>
              </PanelLink>
            </div>
          }
          <div className="content-link highlight-header__button">
            <Icon
              className="highlight-header__icon"
              onClick={() => deleteHighlight(highlight.get('id'))}
              type="delete"
            />
          </div>
        </div>
      </div>
    );
};

HighlightHeader.propTypes = {
    deleteHighlight: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    highlight: PropTypes.shape().isRequired,
    publisher: PropTypes.shape()
};

export default HighlightHeader;
