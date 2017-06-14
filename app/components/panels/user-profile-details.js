import React, { Component } from 'react';
import UserProfileHeader from './user-profile-details-header';

class UserProfileDetails extends Component {
    render () {
        return (
          <div className="row">
            <UserProfileHeader {...this.props} />
              Profile details body!
          </div>
        );
    }
}

export default UserProfileDetails;
