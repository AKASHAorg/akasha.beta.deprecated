import PropTypes from 'prop-types';
import React from 'react';
import { getDisplayName } from '../../utils/dataModule';
import { Avatar, ProfilePopover } from '../';

const getSubtitle = (profile) => {
    const { akashaId, ethAddress, firstName, lastName } = profile.toJS();
    if (firstName || lastName) {
        return getDisplayName({ akashaId, ethAddress });
    }
    return null;
};

const getTitle = (profile) => {
    const { akashaId, ethAddress, firstName, lastName } = profile.toJS();
    if (firstName || lastName) {
        return `${firstName} ${lastName}`;
    }
    return getDisplayName({ akashaId, ethAddress });
};

const ProfileCardHeader = (props) => {
    const { containerRef, loading, profile } = props;
    if (loading) {
        return (
          <div className="profile-card-header">
            <div className="profile-card-header__avatar profile-card-header__avatar_placeholder" />
            <div className="profile-card-header__text">
              <div className="profile-card-header__title_placeholder" />
              <div className="profile-card-header__subtitle_placeholder" />
            </div>
          </div>
        );
    }
    const ethAddress = profile.get('ethAddress');
    const title = getTitle(profile);
    const subtitle = getSubtitle(profile);

    return (
      <div className="profile-card-header">
        <ProfilePopover ethAddress={ethAddress} containerRef={containerRef}>
          <Avatar
            className="profile-card-header__avatar"
            firstName={profile.get('firstName')}
            image={profile.get('avatar')}
            lastName={profile.get('lastName')}
            size="small"
          />
        </ProfilePopover>
        <div className="profile-card-header__text">
          <ProfilePopover ethAddress={ethAddress} containerRef={containerRef}>
            <div className="content-link overflow-ellipsis profile-card-header__title">
              {title}
            </div>
          </ProfilePopover>
          {subtitle &&
            <div className="profile-card-header__subtitle">
              {subtitle}
            </div>
          }
        </div>
      </div>
    );
};

ProfileCardHeader.propTypes = {
    containerRef: PropTypes.shape(),
    loading: PropTypes.bool,
    profile: PropTypes.shape(),
};

export default ProfileCardHeader;
