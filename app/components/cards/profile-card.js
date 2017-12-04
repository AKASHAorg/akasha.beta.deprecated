import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, Tooltip } from 'antd';
import { Icon, ProfileCardHeader } from '../';
import { generalMessages } from '../../locale-data/messages';
import { formatBalance } from '../../utils/number-formatter';

const ProfileCard = (props) => {
    const { intl, isPending, profile } = props;
    if (isPending) {
        return (
          <Card
            className="profile-card profile-card_transparent profile-card_fixed-height"
            title={<ProfileCardHeader loading />}
          >
            <div className="profile-card__details">
              <div className="profile-card__counters-placeholder" />
              <div className="profile-card__about_placeholder" />
              <div className="profile-card__about_placeholder profile-card__about_placeholder-2" />
            </div>
          </Card>
        );
    }

    return (
      <Card
        className="profile-card"
        title={<ProfileCardHeader profile={profile} />}
      >
        <div className="profile-card__details">
          <div className="flex-center-y">
            <Tooltip title={intl.formatMessage(generalMessages.entries)}>
              <Icon className="profile-card__counter-icon" type="entry" />
            </Tooltip>
            <div className="profile-card__counter-text">
              {profile.get('entriesCount')}
            </div>
            <Tooltip title={intl.formatMessage(generalMessages.comments)}>
              <Icon className="profile-card__counter-icon" type="comment" />
            </Tooltip>
            <div className="profile-card__counter-text">
              {profile.get('commentsCount')}
            </div>
            <Tooltip title={intl.formatMessage(generalMessages.karma)}>
              <Icon className="profile-card__counter-icon" type="comment" />
            </Tooltip>
            <div className="profile-card__counter-text">
              {formatBalance(profile.get('karma'))}
            </div>
          </div>
          {profile.get('about') &&
            <div className="profile-card__about">
              <span className="profile-card__about-inner">{profile.get('about')}</span>
            </div>
          }
        </div>
        {/* <div className="profile-card__counters-wrapper">
          <div style={{ marginRight: '12px' }}>
            <div>{intl.formatMessage(profileMessages.followers)}</div>
            <div className="profile-card__counter">
              {profile.get('followersCount')}
            </div>
          </div>
          <div>
            <div>{intl.formatMessage(profileMessages.followings)}</div>
            <div className="profile-card__counter">
              {profile.get('followingCount')}
            </div>
          </div>
        </div> */}
      </Card>
    );
};

ProfileCard.propTypes = {
    intl: PropTypes.shape().isRequired,
    isPending: PropTypes.bool,
    profile: PropTypes.shape().isRequired
};

export default injectIntl(ProfileCard);
