import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Card, Tooltip } from 'antd';
import { AddToBoardPopover, FollowButton, Icon, ProfileCardHeader } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileEditToggle } from '../../local-flux/actions/app-actions';
import { actionSelectors, profileSelectors } from '../../local-flux/selectors';
import { dashboardMessages, generalMessages, profileMessages } from '../../locale-data/messages';
import { formatBalance } from '../../utils/number-formatter';

class ProfileCard extends Component {
    onFollow = () => {
        const { isFollower, loggedEthAddress, profile } = this.props;
        const akashaId = profile.get('akashaId');
        const ethAddress = profile.get('ethAddress');

        if (isFollower) {
            this.props.actionAdd(loggedEthAddress, actionTypes.unfollow, { akashaId, ethAddress });
        } else {
            this.props.actionAdd(loggedEthAddress, actionTypes.follow, { akashaId, ethAddress });
        }
    };

    render () {
        const { containerRef, followPending, intl, isFollower, isPending, loggedEthAddress, profile,
            tipPending } = this.props;
        const isOwnProfile = profile.ethAddress === loggedEthAddress;
        const getPopupContainer = () => containerRef || document.body;
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
            title={
              <ProfileCardHeader
                isOwnProfile={isOwnProfile}
                profile={profile}
                tipPending={tipPending}
              />
            }
          >
            <div className="profile-card__details">
              <div className="flex-center-y">
                <Tooltip
                  getPopupContainer={getPopupContainer}
                  title={intl.formatMessage(generalMessages.entries)}
                >
                  <Icon className="profile-card__counter-icon" type="entry" />
                </Tooltip>
                <div className="profile-card__counter-text">
                  {profile.get('entriesCount')}
                </div>
                <Tooltip
                  getPopupContainer={getPopupContainer}
                  title={intl.formatMessage(generalMessages.comments)}
                >
                  <Icon className="profile-card__counter-icon" type="comment" />
                </Tooltip>
                <div className="profile-card__counter-text">
                  {profile.get('commentsCount')}
                </div>
                <Tooltip
                  getPopupContainer={getPopupContainer}
                  title={intl.formatMessage(generalMessages.karma)}
                >
                  <Icon className="profile-card__counter-icon profile-card__karma-icon" type="karma" />
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
            <div className="profile-card__counters-wrapper">
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
            </div>
            <div className="profile-popover__actions">
              {!isOwnProfile &&
                <FollowButton
                  followPending={followPending}
                  isFollower={isFollower}
                  onFollow={this.onFollow}
                />
              }
              {!isOwnProfile &&
                <AddToBoardPopover
                  containerRef={containerRef}
                  profile={profile}
                >
                  <Button className="profile-popover__button">
                    {intl.formatMessage(dashboardMessages.addToBoard)}
                  </Button>
                </AddToBoardPopover>
              }
              {isOwnProfile &&
                <Button
                  className="profile-popover__button"
                  onClick={this.props.profileEditToggle}
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.editProfile)}
                </Button>
              }
            </div>
          </Card>
        );
    }
}

ProfileCard.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    containerRef: PropTypes.shape(),
    followPending: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    isFollower: PropTypes.bool,
    isPending: PropTypes.bool,
    loggedEthAddress: PropTypes.string.isRequired,
    profile: PropTypes.shape().isRequired,
    profileEditToggle: PropTypes.func.isRequired,
    tipPending: PropTypes.bool
};

function mapStateToProps (state, ownProps) {
    const ethAddress = ownProps.itemId;
    const profile = ethAddress ? profileSelectors.selectProfileByEthAddress(state, ethAddress) : ownProps.profile;
    return {
        followPending: profileSelectors.getFollowIsPending(state, ethAddress),
        isFollower: profileSelectors.selectIsFollower(state, ethAddress),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        profile,
        tipPending: actionSelectors.getTipIsPending(state, ethAddress)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEditToggle
    }
)(injectIntl(ProfileCard));
