import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import * as columnTypes from '../../constants/columns';
import { Column } from '../';

const ProfileActivity = ({ ethAddress, intl }) => (
  <div className="profile-activity" id="profile-activity">
    <div className="profile-activity__column" id="profile-entries">
      <Column
        columnId={`${columnTypes.profileEntries}-${ethAddress}`}
        ethAddress={ethAddress}
        intl={intl}
        isVisible
        type={columnTypes.profileEntries}
      />
    </div>
    <div className="profile-activity__column" id="profile-comments">
      <Column
        columnId={columnTypes.profileComments}      
        ethAddress={ethAddress}
        intl={intl}
        isVisible
        type={columnTypes.profileComments}
      />
    </div>
    <div className="profile-activity__column" id="profile-followers">
      <Column
        columnId={columnTypes.profileFollowers}
        ethAddress={ethAddress}
        intl={intl}
        isVisible
        type={columnTypes.profileFollowers}        
      />
    </div>
    <div className="profile-activity__column" id="profile-followings">
      <Column
        columnId={columnTypes.profileFollowings} 
        ethAddress={ethAddress}
        intl={intl}
        isVisible
        type={columnTypes.profileFollowings}
      />
    </div>
  </div>
);

ProfileActivity.propTypes = {
    ethAddress: PropTypes.string,
    intl: PropTypes.shape(),
};

export default injectIntl(ProfileActivity);
