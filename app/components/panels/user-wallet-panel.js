import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ProfilePanelsHeader } from '../';

class UserWalletPanel extends Component {
    render () {
        return (
          <div className="panel">
            <ProfilePanelsHeader />
            <div className="panel__content">This is my wallet!</div>
          </div>
        );
    }
}

UserWalletPanel.propTypes = {
};

export default UserWalletPanel;
