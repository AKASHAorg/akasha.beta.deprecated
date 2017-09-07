import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Avatar } from '../';
import * as actionTypes from '../../constants/action-types';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import imageCreator, { findBestMatch } from '../../utils/imageUtils';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileIsFollower } from '../../local-flux/actions/profile-actions';
import { selectLoggedAkashaId, selectProfile } from '../../local-flux/selectors';

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

    sendTip = (profileData) => {
        const { akashaId, firstName, lastName, profile } = profileData;
        const payload = { akashaId, firstName, lastName, receiver: profile };
        this.props.actionAdd(this.props.loggedAkashaId, actionTypes.sendTip, payload);
    };

    render () {
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};
        const { about, avatar, backgroundImage, links, firstName, lastName,
        followersCount, followingCount } = profileData;
        const { akashaId, intl, followPending, followerList, loggedAkashaId, sendingTip } = this.props;
        const isOwnProfile = akashaId === loggedAkashaId;
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
        const isFollower = followerList.get(akashaId);
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
                      onClick={() => this.props.actionAdd(loggedAkashaId, actionTypes.unfollow, { akashaId })}
                      disabled={followPending.get(akashaId)}
                    >{intl.formatMessage(profileMessages.unfollow)}</Button> :
                    <Button
                      type="primary"
                      ghost
                      onClick={() => this.props.actionAdd(loggedAkashaId, actionTypes.follow, { akashaId })}
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
    actionAdd: PropTypes.func.isRequired,
    akashaId: PropTypes.string.isRequired,
    followPending: PropTypes.shape(),
    followerList: PropTypes.shape(),
    intl: PropTypes.shape(),
    loggedAkashaId: PropTypes.string,
    profileData: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
};

function mapStateToProps (state, ownProps) {
    return {
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        followerList: state.profileState.get('isFollower'),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        loggedAkashaId: selectLoggedAkashaId(state),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        profileData: selectProfile(state, ownProps.akashaId),
        sendingTip: state.profileState.getIn(['flags', 'sendingTip']),
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileIsFollower
    }
)(injectIntl(ProfileDetails));
