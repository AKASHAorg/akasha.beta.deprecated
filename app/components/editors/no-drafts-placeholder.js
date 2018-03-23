import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { entryMessages } from '../../locale-data/messages';

const NoDraftsPlaceholder = (props) => {
    const { darkTheme, intl, onNewDraft } = props;
    return (
      <div
        className={
            `edit-entry-page__no-drafts
            edit-entry-page__no-drafts${darkTheme ? '_dark' : ''}`
        }
        >
        <div className="edit-entry-page__no-drafts_placeholder-image" />
        <div className="edit-entry-page__no-drafts_placeholder-text">
          <h3>
            {intl.formatMessage(entryMessages.youHaveNoDrafts)}
          </h3>
          <p>
            <a href="#" onClick={onNewDraft}>
              {intl.formatMessage(entryMessages.startANewDraft)}
            </a>
          </p>
        </div>
      </div>
    )
};

NoDraftsPlaceholder.propTypes = {
    darkTheme: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    onNewDraft: PropTypes.func.isRequired
};

export default injectIntl(NoDraftsPlaceholder);
