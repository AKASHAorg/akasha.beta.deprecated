import React, { Component, PropTypes } from 'react';
import styles from './user-settings-panel.scss';

class UserSettingsPanel extends Component {
    render () {
        return (
            <div className={`${styles.root} row`}>
                <div className={`${styles.settingsWrapper} col-xs-12`}>
                    <div>Layout</div>
                    <div>Option 1</div>
                </div>
            </div>
        );
    }
}

UserSettingsPanel.propTypes = {
    onPanelNavigate: PropTypes.func,
};

export default UserSettingsPanel;
