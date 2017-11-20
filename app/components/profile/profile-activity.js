import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import * as columnTypes from '../../constants/columns';
import { Column } from '../';

const ProfileActivity = ({ ethAddress }) => (
  <div className="profile-activity" id="profile-activity">
    <div className="profile-activity__column" id="profile-entries">
      <Column ethAddress={ethAddress} type={columnTypes.profileEntries} />
    </div>
    <div className="profile-activity__column" id="profile-followers">
      <Column ethAddress={ethAddress} type={columnTypes.profileFollowers} />
    </div>
    <div>
      <div className="profile-activity__column" id="profile-followings">
        <Column ethAddress={ethAddress} type={columnTypes.profileFollowings} />
      </div>
    </div>
  </div>
);

ProfileActivity.propTypes = {
    ethAddress: PropTypes.string,
};

export default injectIntl(ProfileActivity);
