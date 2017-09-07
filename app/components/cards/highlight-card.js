import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Card } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { HighlightHeader } from '../';

const HighlightCard = (props) => {
    const { containerRef, deleteHighlight, highlight, intl, publisher } = props;

    return (
      <Card
        className="highlight-card"
        title={
          <HighlightHeader
            containerRef={containerRef}
            deleteHighlight={deleteHighlight}
            editable
            highlight={highlight}
            publisher={publisher}
          />
        }
      >
        <div className="highlight-card__content">
          {highlight.get('content')}
        </div>
        {highlight.get('notes') &&
          <div className="highlight-card__notes">
            <div className="highlight-card__notes-title">
              {intl.formatMessage(generalMessages.notes)}
            </div>
            <div>{highlight.get('notes')}</div>
          </div>
        }
      </Card>
    );
};

HighlightCard.propTypes = {
    containerRef: PropTypes.shape(),
    deleteHighlight: PropTypes.func,
    highlight: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    publisher: PropTypes.shape().isRequired
};

export default injectIntl(HighlightCard);
