import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Icon } from 'antd';
import { entryMessages } from '../../locale-data/messages';

const { SubMenu } = Menu;

class PublishOptionsPanel extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render () {
        const { intl, onClose } = this.props;
        return (
          <div className="publish-options-panel">
            <div className="publish-options-panel__header">
              <div className="publish-options-panel__header-title">
                {intl.formatMessage(entryMessages.publishOptions)}
              </div>
              <div className="publish-options-panel__header-actions">
                <Button
                  icon="close"
                  onClick={onClose}
                  className="borderless"
                />
              </div>
            </div>
            <div className="publish-options-panel__content">
              Content
            </div>
          </div>
        );
    }
}

PublishOptionsPanel.propTypes = {
    intl: PropTypes.shape(),
    onClose: PropTypes.func,
};

export default PublishOptionsPanel;
