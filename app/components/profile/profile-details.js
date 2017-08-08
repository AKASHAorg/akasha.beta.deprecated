import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { Avatar } from '../';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import imageCreator, { findBestMatch } from '../../utils/imageUtils';

class ProfileDetails extends Component {

    getBackgroundImageStyle = (backgroundImage) => {
        if (!backgroundImage) {
            return {};
        }
        const originalRatio = backgroundImage.width / backgroundImage.height;
        const actualRatio = 400 / 200;
        if (originalRatio > 4 || originalRatio < actualRatio) {
            return {
                flex: 'none',
                width: '400px'
            };
        }
        return {
            flex: 'none',
            height: '200px'
        };
    }

    render () {
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};
        const { about, avatar, akashaId, backgroundImage, links, firstName, lastName,
        followersCount, followingCount } = profileData;
        const { isFollower, intl, followProfile, unfollowProfile,
           sendTip, followPending, sendingTip } = this.props;
        const isOwnProfile = akashaId === this.props.loggedProfile.akashaId;
        const bestMatch = findBestMatch(400, backgroundImage);
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src, profileData.baseUrl) :
            '';
        return (
          <div className="profile-details">
            <div className="profile-details__background-image">
              {imageUrl ?
                <img
                  src={imageUrl}
                  style={this.getBackgroundImageStyle(backgroundImage[bestMatch])}
                  alt=""
                /> :
                <div className="profile-details__background-image profile-details__background-image_default" />
              }
            </div>

            <div className="profile-details__avatar-button-wrapper">
              <div className="profile-details__avatar-wrapper">
                <Avatar
                  image={avatar}
                  size={'large'}
                  firstName={firstName}
                  lastName={lastName}
                />
              </div>
              <div className="profile-details__follow-button">
                {isOwnProfile ? 
                  <Button type="primary" ghost>{intl.formatMessage(generalMessages.edit)}</Button> :
                  isFollower ?
                    <Button
                      type="primary"
                      ghost
                      onClick={() => unfollowProfile(akashaId)}
                      disabled={followPending.get(akashaId)}
                    >{intl.formatMessage(profileMessages.unfollow)}</Button> :
                    <Button
                      type="primary"
                      ghost
                      onClick={() => followProfile(akashaId)}
                      disabled={followPending.get(akashaId)}
                    >{intl.formatMessage(profileMessages.follow)}</Button>
                }
              </div>
            </div>

            <div className="profile-details__name-wrapper">
              <span className="profile-details__name">{firstName} {lastName}</span>
              {!isOwnProfile &&
                <Button
                  type="primary"
                  ghost
                  onClick={() => sendTip(profileData)}
                  disabled={sendingTip.get(akashaId)}
                >{intl.formatMessage(profileMessages.sendTip)}</Button>
              }
            </div>

            <div className="profile-details__akashaid-wrapper">
              <div className="profile-details__akashaid">
                @{akashaId}
              </div>

              <div className="profile-details__follow-info">
                {followersCount} {intl.formatMessage(profileMessages.followers)} | {followingCount} {intl.formatMessage(profileMessages.following)}
              </div>
            </div>


            {about &&
              <div className="profile-details__about-wrapper">
                <div className="profile-details__about-title">
                  {intl.formatMessage(profileMessages.aboutMeTitle)}
                </div>
                <div className="profile-details__about-info">
                  {about.split('\n').map((text, key) =>
                    (<span key={key}>
                      {text}
                      <br />
                    </span>)
                  )}
                </div>
              </div>
            }

            {links && !!links.length &&
              <div className="profile-details__links-wrapper">
                <div className="profile-details__links-title">
                  {intl.formatMessage(profileMessages.linksTitle)}
                </div>
                {links.map(link =>
                  (<div
                    key={link.id}
                    className="profile-details__links-info"
                  >
                    <div>
                      {link.url}
                    </div>
                  </div>)
                )}
              </div>
            }
          </div>);
    }
}

ProfileDetails.propTypes = {
    followPending: PropTypes.shape(),
    followProfile: PropTypes.func,
    isFollower: PropTypes.bool,
    intl: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    profileData: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
    sendTip: PropTypes.func,
    unfollowProfile: PropTypes.func,
};

export default injectIntl(ProfileDetails);
