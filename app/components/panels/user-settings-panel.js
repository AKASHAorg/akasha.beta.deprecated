import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Switch, Icon } from 'antd';
import styles from './user-settings-panel.scss';

class UserSettingsPanel extends Component {
    _handleThemeChange = (checked) => {
        if (checked) {
            document.body.className = 'dark';
        } else {
            document.body.className = '';
        }
    }
    render () {
        return (
          <div className={`${styles.root} row`}>
            <div className={`${styles.settingsWrapper} col-xs-12`}>
              <Row type="flex">
                <Col md={12}>Dark Theme</Col>
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
    onPanelNavigate: PropTypes.func,
};

export default UserSettingsPanel;
