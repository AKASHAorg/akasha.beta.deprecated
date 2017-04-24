import PropTypes from 'prop-types';
import React from 'react';
import { PanelContainer } from '../';
import { akashaTerms } from '../../locale-data/messages';
import { injectIntl } from 'react-intl';

const TermsPanel = (props) => {
    const { intl } = props;
    return (
      <PanelContainer
        showBorder
        title={intl.formatMessage(akashaTerms.title)}
        actions={[
            /* eslint-disable */
            <RaisedButton
              key="cancel"
              label="Close"
              onTouchTap={this._handleCancelButton}
            />
            /* eslint-enable */
        ]}
      >
        <div className="akasha-terms">
            Akasha Terms
        </div>
      </PanelContainer>
    );
};

TermsPanel.propTypes = {
    intl: PropTypes.func
};

export default injectIntl(TermsPanel);
