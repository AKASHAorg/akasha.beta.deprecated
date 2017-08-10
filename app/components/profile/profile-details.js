import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Avatar } from '../';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import imageCreator, { findBestMatch } from '../../utils/imageUtils';
import { profileIsFollower, profileAddFollowAction,
    profileAddUnfollowAction, profileAddTipAction } from '../../local-flux/actions/profile-actions';

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

    followProfile = (akashaId, gas) => {
        const payload = { akashaId, gas };
        this.props.profileAddFollowAction(payload);
    }

    unfollowProfile = (akashaId, gas) => {
        const payload = { akashaId, gas };
        this.props.profileAddUnfollowAction(payload);
    }

    sendTip = (profileData) => {
        const { akashaId, firstName, lastName, profile } = profileData;
        const payload = { akashaId, firstName, lastName, profile };
        this.props.profileAddTipAction(payload);
    };

    render () {
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};
        const { about, avatar, akashaId, backgroundImage, links, firstName, lastName,
        followersCount, followingCount } = profileData;
        const { intl, followPending, followerList, sendingTip } = this.props;
        const isOwnProfile = akashaId === this.props.loggedProfile.akashaId;
        const bestMatch = findBestMatch(400, backgroundImage);
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src, profileData.baseUrl) :
            '';
        const followersCountMessage = intl.formatMessage(profileMessages.followersCount, {
            followers: followersCount
        });
        const followingCountMessage = intl.formatMessage(profileMessages.followingsCount, {
            followings: followingCount
        });
        const isFollower = followerList.get(profileData.akashaId);
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
                      onClick={() => this.unfollowProfile(akashaId)}
                      disabled={followPending.get(akashaId)}
                    >{intl.formatMessage(profileMessages.unfollow)}</Button> :
                    <Button
                      type="primary"
                      ghost
                      onClick={() => this.followProfile(akashaId)}
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
                  onClick={() => this.sendTip(profileData)}
                  disabled={sendingTip.get(akashaId)}
                >{intl.formatMessage(profileMessages.sendTip)}</Button>
              }
            </div>
            <div className="profile-details__akashaid-wrapper">
              <div className="profile-details__akashaid">
                @{akashaId}
              </div>

              <div className="profile-details__follow-info">
                {followersCountMessage} | {followingCountMessage}
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
    followerList: PropTypes.shape(),
    intl: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    profileData: PropTypes.shape(),
    profileAddFollowAction: PropTypes.func,
    profileAddUnfollowAction: PropTypes.func,
    profileAddTipAction: PropTypes.func,
    sendingTip: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        followerList: state.profileState.get('isFollower'),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        sendingTip: state.profileState.getIn(['flags', 'sendingTip']),
    };
}

export default connect(
    mapStateToProps,
    {
        profileIsFollower,
        profileAddFollowAction,
        profileAddUnfollowAction,
        profileAddTipAction
    }
)(injectIntl(ProfileDetails));
