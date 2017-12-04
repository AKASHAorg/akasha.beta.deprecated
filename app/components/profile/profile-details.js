import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Popover, Spin } from 'antd';
import classNames from 'classnames';
import { Avatar, DisplayName, Icon, SendTipForm } from '../';
import * as actionTypes from '../../constants/action-types';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileEditToggle } from '../../local-flux/actions/app-actions';
import { selectEthBalance, selectIsFollower, selectLoggedEthAddress, selectPendingFollow, selectPendingTip,
    selectProfile } from '../../local-flux/selectors';
import imageCreator, { findBestMatch } from '../../utils/imageUtils';
import { formatBalance } from '../../utils/number-formatter';

class ProfileDetails extends Component {
    state = {
        followHovered: false,
        popoverVisible: false,
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
        const { isFollower, loggedEthAddress, profileData } = this.props;
        const ethAddress = profileData.get('ethAddress');
        if (isFollower) {
            this.props.actionAdd(loggedEthAddress, actionTypes.unfollow, { ethAddress });
        } else {
            this.props.actionAdd(loggedEthAddress, actionTypes.follow, { ethAddress });
        }
    };

    onVisibleChange = (popoverVisible) => {
        this.setState({
            popoverVisible
        });
    };

    sendTip = ({ value, message }) => {
        const { ethAddress, loggedEthAddress, profileData } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.sendTip, {
            akashaId: profileData.get('akashaId'),
            ethAddress,
            firstName: profileData.get('firstName'),
            lastName: profileData.get('lastName'),
            message,
            value
        });
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
                <Icon className="profile-details__follow-button" type="plus" />
                {intl.formatMessage(profileMessages.follow)}
              </div>
            );
        }
        const className = classNames(
            'profile-details__button',
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
        if (!this.props.profileData) {
            console.error('no profile data');
        }
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};
        const { about, akashaId, avatar, backgroundImage, links, firstName, lastName,
            followersCount, followingCount } = profileData;
        const { balance, ethAddress, intl, loggedEthAddress, tipPending } = this.props;
        const isOwnProfile = ethAddress === loggedEthAddress;
        const bestMatch = findBestMatch(400, backgroundImage);
        const displayName = firstName || lastName ?
            `${firstName} ${lastName}` :
            <DisplayName akashaId={akashaId} ethAddress={ethAddress} />;
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src, profileData.baseUrl) :
            '';

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
                <div className="overflow-ellipsis profile-details__name">
                  {displayName}
                </div>
                <div>
                  {(firstName || lastName) && `@${akashaId}`}
                </div>
              </div>
            </div>
            <div className="profile-details__scores-wrapper">
              <div>
                {intl.formatMessage(generalMessages.karmaTotalScore)}
                <span className="profile-details__score">
                  {formatBalance(profileData.karma)}
                </span>
              </div>
              <div>
                {intl.formatMessage(generalMessages.essenceTotalScore)}
                <span className="profile-details__score">216</span>
              </div>
            </div>
            <div className="profile-details__actions">
              {!isOwnProfile && this.renderFollowButton()}
              {!isOwnProfile &&
                <Popover
                  arrowPointAtCenter
                  content={
                    <SendTipForm
                      balance={balance}
                      onSubmit={this.sendTip}
                      tipPending={tipPending}
                    />
                  }
                  onVisibleChange={this.onVisibleChange}
                  overlayClassName="profile-details__popover"
                  placement="bottomLeft"
                  trigger="click"
                  visible={this.state.popoverVisible}
                >
                  <Button
                    className="profile-details__button profile-details__support-button"
                    disabled={tipPending}
                    size="large"
                  >
                    <div>
                      <Icon
                        className="profile-details__button-icon"
                        type="heart"
                      />
                      {intl.formatMessage(profileMessages.support)}
                    </div>
                  </Button>
                </Popover>
              }
              {isOwnProfile &&
                <Button
                  className="profile-details__button"
                  onClick={this.props.profileEditToggle}
                  size="large"
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.editProfile)}
                </Button>
              }
            </div>
            <div className="profile-details__counters-wrapper">
              <div style={{ marginRight: '12px' }}>
                <div>{intl.formatMessage(profileMessages.followers)}</div>
                <div className="profile-details__counter">{followersCount}</div>
              </div>
              <div>
                <div>{intl.formatMessage(profileMessages.followings)}</div>
                <div className="profile-details__counter">{followingCount}</div>
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
    balance: PropTypes.string,
    ethAddress: PropTypes.string.isRequired,
    followPending: PropTypes.bool,
    intl: PropTypes.shape(),
    isFollower: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    profileData: PropTypes.shape(),
    profileEditToggle: PropTypes.func.isRequired,
    tipPending: PropTypes.bool,
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps;
    return {
        balance: selectEthBalance(state),
        followPending: selectPendingFollow(state, ethAddress),
        isFollower: selectIsFollower(state, ethAddress),
        loggedEthAddress: selectLoggedEthAddress(state),
        profileData: selectProfile(state, ethAddress),
        tipPending: selectPendingTip(state, ethAddress)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEditToggle,
    }
)(injectIntl(ProfileDetails));
