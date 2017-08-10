import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { entryMessages } from '../../locale-data/messages';

const PublishOptionsPanel = props => (
  <div className="publish-options-panel">
    <div className="publish-options-panel__header">
      <div className="publish-options-panel__header-title">
        {props.intl.formatMessage(entryMessages.publishOptions)}
      </div>
      <div className="publish-options-panel__header-actions">
        <Button
          icon="close"
          onClick={props.onClose}
          className="borderless"
        />
      </div>
    </div>
    <div className="publish-options-panel__content">
        Content
    </div>
  </div>
);

PublishOptionsPanel.propTypes = {
    intl: PropTypes.shape(),
    onClose: PropTypes.func,
};

export default PublishOptionsPanel;
