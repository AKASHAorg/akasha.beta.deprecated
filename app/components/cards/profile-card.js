import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Card, Popover, Tooltip } from 'antd';
import { AddToBoard, FollowButton, Icon, NewDashboardForm, ProfileCardHeader } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileEditToggle } from '../../local-flux/actions/app-actions';
import { selectIsFollower, selectPendingFollow, selectPendingTip,
    selectLoggedEthAddress } from '../../local-flux/selectors';
import { dashboardMessages, generalMessages, profileMessages } from '../../locale-data/messages';
import { formatBalance } from '../../utils/number-formatter';

const DASHBOARDS = 'DASHBOARDS';
const NEW_DASHBOARD = 'NEW_DASHBOARD';

class ProfileCard extends Component {
    state = {
        content: null,
        popoverVisible: false
    };
    wasVisible = false;

    componentWillUnmount () {
        if (this.resetTimeout) {
            clearTimeout(this.resetTimeout);
        }
        if (this.focusTimeout) {
            clearTimeout(this.focusTimeout);
        }
    }

    closePopover = () => this.onVisibleChange(false);

    onAddToDashboard = () => {
        this.setInputFocusAsync();
        this.setState({
            content: DASHBOARDS
        });
    };

    onNewDashboard = () => {
        this.setState({
            content: NEW_DASHBOARD
        });
    };

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        this.setState({
            content: popoverVisible ? DASHBOARDS : this.state.content,
            popoverVisible
        });
        // Delay state reset until popover animation is finished
        if (!popoverVisible) {
            this.resetTimeout = setTimeout(() => {
                this.resetTimeout = null;
                // this.props.dashboardSearch('');
                this.setState({
                    content: null
                });
            }, 100);
        } else {
            this.setInputFocusAsync();
        }
    };

    setInputFocusAsync = () => {
        this.focusTimeout = setTimeout(() => {
            this.focusTimeout = null;
            const input = document.getElementById('add-to-board-search');
            if (input) {
                input.focus();
            }
        }, 100);
    };

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

    renderContent = () => {
        const { profile } = this.props;
        const { content } = this.state;

        switch (content) {
            case DASHBOARDS:
                return (
                  <AddToBoard
                    closePopover={this.closePopover}
                    onNewDashboard={this.onNewDashboard}
                    profile={profile}
                  />
                );
            case NEW_DASHBOARD:
                return (
                  <NewDashboardForm
                    ethAddress={profile.ethAddress}
                    onCancel={this.onAddToDashboard}
                  />
                );
            default:
                return null;
        }
    };

    render () {
        const { containerRef, followPending, intl, isFollower, isOwnProfile, isPending, profile,
            tipPending } = this.props;
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
            className="profile-card has-hidden-action"
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
                <Popover
                  content={this.wasVisible ? this.renderContent() : null}
                  getPopupContainer={getPopupContainer}
                  onVisibleChange={this.onVisibleChange}
                  overlayClassName="profile-popover"
                  placement="bottomLeft"
                  trigger="click"
                  visible={this.state.popoverVisible}
                >
                  <Button className="profile-popover__button">
                    {intl.formatMessage(dashboardMessages.addToBoard)}
                  </Button>
                </Popover>
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
    isOwnProfile: PropTypes.bool,
    isPending: PropTypes.bool,
    loggedEthAddress: PropTypes.string.isRequired,
    profile: PropTypes.shape().isRequired,
    profileEditToggle: PropTypes.func.isRequired,
    tipPending: PropTypes.bool
};

function mapStateToProps (state, ownProps) {
    const ethAddress = ownProps.profile.ethAddress;
    return {
        followPending: selectPendingFollow(state, ethAddress),
        isFollower: selectIsFollower(state, ethAddress),
        loggedEthAddress: selectLoggedEthAddress(state),
        tipPending: selectPendingTip(state, ethAddress)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEditToggle
    }
)(injectIntl(ProfileCard));
