import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Icon, Spin } from 'antd';
import classNames from 'classnames';
import { Avatar } from '../';
import * as actionTypes from '../../constants/action-types';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import imageCreator, { findBestMatch } from '../../utils/imageUtils';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileIsFollower } from '../../local-flux/actions/profile-actions';
import { selectIsFollower, selectLoggedAkashaId, selectProfile,
    selectProfileFlag } from '../../local-flux/selectors';

class ProfileDetails extends Component {
    state = {
        followHovered: false
    };

    getBackgroundImageClass = (backgroundImage) => {
        if (!backgroundImage) {
            return {};
        }
        const originalRatio = backgroundImage.width / backgroundImage.height;
        const actualRatio = 400 / 200;
        if (originalRatio > 4 || originalRatio < actualRatio) {
            return 'profile-details__background-image_fixed-width';
        }
        return 'profile-details__background-image_fixed-height';
    }

    onMouseEnter = () => {
        this.setState({
            followHovered: true
        });
    };

    onMouseLeave = () => {
        this.setState({
            followHovered: false
        });
    };

    onFollow = () => {
        const { isFollower, loggedAkashaId, profileData } = this.props;
        const akashaId = profileData.get('akashaId');
        if (isFollower) {
            this.props.actionAdd(loggedAkashaId, actionTypes.unfollow, { akashaId });
        } else {
            this.props.actionAdd(loggedAkashaId, actionTypes.follow, { akashaId });
        }
    };

    sendTip = () => {
        const { profileData } = this.props;
        const { akashaId, firstName, lastName, profile } = profileData;
        const payload = { akashaId, firstName, lastName, receiver: profile };
        this.props.actionAdd(this.props.loggedAkashaId, actionTypes.sendTip, payload);
    };

    renderFollowButton = () => {
        const { intl, isFollower, followPending } = this.props;
        const { followHovered } = this.state;
        const canFollow = !isFollower && !followPending;
        let label;
        if (followPending) {
            label = (
              <div className="flex-center">
                <Spin className="profile-details__button-icon" size="small" />
                {intl.formatMessage(generalMessages.pending)}
              </div>
            );
        } else if (isFollower) {
            const message = followHovered ?
                intl.formatMessage(profileMessages.unfollow) :
                intl.formatMessage(profileMessages.following);
            label = (
              <div className="flex-center">
                <Icon className="profile-details__button-icon" type={followHovered ? 'close' : 'check'} />
                {message}
              </div>
            );
        } else {
            label = (
              <div className="flex-center">
                <Icon className="profile-details__button-icon" type="plus" />
                {intl.formatMessage(profileMessages.follow)}
              </div>
            );
        }
        const className = classNames(
            'profile-details__button profile-details__button_large',
            {
                'profile-details__unfollow-button': !followPending && isFollower && followHovered,
                'profile-details__following-button': !followPending && isFollower && !followHovered
            }
        );

        return (
          <Button
            className={className}
            disabled={followPending}
            onClick={this.onFollow}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            size="large"
            type={canFollow ? 'primary' : 'default'}
          >
            {label}
          </Button>
        );
    };

    render () {
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};
        const { about, avatar, backgroundImage, links, firstName, lastName,
            followersCount, followingCount } = profileData;
        const { akashaId, intl, loggedAkashaId, sendingTip } = this.props;
        const isOwnProfile = akashaId === loggedAkashaId;
        const bestMatch = findBestMatch(400, backgroundImage);
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src, profileData.baseUrl) :
            '';
        const nameClass = classNames('overflow-ellipsis profile-details__name', {
            'profile-details__name_own-profile': isOwnProfile
        });

        return (
          <div className="profile-details">
            <div className="profile-details__background-image">
              {imageUrl ?
                <img
                  alt=""
                  className={this.getBackgroundImageClass(backgroundImage[bestMatch])}
                  src={imageUrl}
                /> :
                <div className="profile-details__background-image-placeholder" />
              }
            </div>
            <div className="profile-details__avatar-row">
              <div className="profile-details__avatar-wrapper">
                <Avatar
                  className="profile-details__avatar"
                  firstName={firstName}
                  image={avatar}
                  lastName={lastName}
                  size={'large'}
                />
              </div>
              <div className="profile-details__heading">
                <div className={nameClass}>
                  {firstName} {lastName}
                </div>
                <div className="profile-details__karma">
                  {intl.formatMessage(generalMessages.karma)}
                  <span className="profile-details__karma-score">85</span>
                </div>
                {isOwnProfile &&
                  <div className="flex-center-y profile-details__edit-button">
                    <Button
                      className="profile-details__button"
                      size="large"
                      type="primary"
                    >
                      {intl.formatMessage(generalMessages.edit)}
                    </Button>
                  </div>
                }
              </div>
            </div>
            {!isOwnProfile &&
              <div className="profile-details__actions">
                {this.renderFollowButton()}
                <Button
                  className="profile-details__button profile-details__button_large"
                  disabled={sendingTip.get(akashaId)}
                  onClick={() => this.sendTip(profileData)}
                  size="large"
                >
                  <div>
                    <Icon className="profile-details__button-icon" type="heart-o" />
                    {intl.formatMessage(profileMessages.support)}
                  </div>
                </Button>
              </div>
            }
            <div className="profile-details__counters-wrapper">
              <div>
                <div>{intl.formatMessage(profileMessages.followers)}</div>
                <div className="profile-details__counter">{followersCount}</div>
              </div>
              <div>
                <div>{intl.formatMessage(profileMessages.followings)}</div>
                <div className="profile-details__counter">{followingCount}</div>
              </div>
              <div>
                <div>{intl.formatMessage(profileMessages.supported)}</div>
                <div className="profile-details__counter">{0}</div>
              </div>
              <div>
                <div>{intl.formatMessage(profileMessages.supporting)}</div>
                <div className="profile-details__counter">{0}</div>
              </div>
            </div>
            {about &&
              <div className="profile-details__about">
                {about.split('\n').map((text, key) => (
                  <span key={key}>
                    {text}
                    <br />
                  </span>
                ))}
              </div>
            }
            {links && !!links.length &&
              <div className="profile-details__links-wrapper">
                {links.map(link => (
                  <a
                    key={link.id}
                    className="profile-details__link"
                    href={link.url}
                  >
                    <div className="overflow-ellipsis" style={{ width: '100%' }}>
                      {link.url}
                    </div>
                  </a>
                ))}
              </div>
            }
          </div>);
    }
}

ProfileDetails.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    akashaId: PropTypes.string.isRequired,
    followPending: PropTypes.bool,
    intl: PropTypes.shape(),
    isFollower: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    profileData: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
};

function mapStateToProps (state, ownProps) {
    return {
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        followPending: selectProfileFlag(state, 'followPending').get(ownProps.akashaId),
        isFollower: selectIsFollower(state, ownProps.akashaId),
        loggedAkashaId: selectLoggedAkashaId(state),
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
