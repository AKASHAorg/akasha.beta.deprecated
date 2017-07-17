import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserWalletPanel extends Component {
    render () {
        return (
            <div>
                This is my wallet!
            </div>
        )
    }
}

UserWalletPanel.propTypes = {
    onPanelNavigate: PropTypes.func,
};

export default UserWalletPanel;
