import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Switch, Icon } from 'antd';
import { profileMessages } from '../../locale-data/messages';
import styles from './user-settings-panel.scss';

class UserSettingsPanel extends Component {
    _handleThemeChange = (checked) => {
        if (checked) {
            document.body.id = 'dark';
        } else {
            document.body.id = '';
        }
    }
    render () {
        const { intl, onPanelNavigate } = this.props;
        return (
          <div className={`${styles.root} row`}>
            <div className={`${styles.settingsWrapper} col-xs-12`}>
              <Row type="flex">
                <Col md={12}>{intl.formatMessage(profileMessages.darkTheme)}</Col>
                <Col md={12}>
                  <Switch
                    onChange={this._handleThemeChange}
                    defaultChecked={false}
                  />
                </Col>
              </Row>
            </div>
          </div>
        );
    }
}

UserSettingsPanel.propTypes = {
    intl: PropTypes.shape(),
    onPanelNavigate: PropTypes.func,
};

export default UserSettingsPanel;
