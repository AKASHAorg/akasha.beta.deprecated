import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Button, Popover, Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileEditToggle } from '../../local-flux/actions/app-actions';
import { selectIsFollower, selectLoggedEthAddress, selectPendingFollow,
    selectPendingTip, selectProfile, } from '../../local-flux/selectors';
import { dashboardMessages, generalMessages, profileMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';
import { formatBalance } from '../../utils/number-formatter';
import { addPrefix } from '../../utils/url-utils';
import { AddToBoard, Avatar, FollowButton, Icon, NewDashboardForm, SendTipForm,
    ShareLinkModal } from '../';

const DEFAULT = 'DEFAULT';
const DASHBOARDS = 'DASHBOARDS';
const NEW_DASHBOARD = 'NEW_DASHBOARD';
const SEND_TIP = 'SEND_TIP';

class ProfilePopover extends Component {
    state = {
        content: null,
        followHovered: false,
        popoverVisible: false,
    };
    wasVisible = false;

    componentWillReceiveProps (nextProps, nextState) {
        const { tipPending } = nextProps;
        // Close the send tip form after sending tip
        if (tipPending && !this.props.tipPending && !nextState.popoverVisible) {
            this.setState({ content: null });
        }
    }

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    closePopover = () => this.onVisibleChange(false);

    onAddToDashboard = () => {
        this.setState({ content: DASHBOARDS });
    };

    onNewDashboard = () => {
        this.setState({ content: NEW_DASHBOARD });
    };

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

    onEditProfile = () => {
        this.onVisibleChange(false);
        this.props.profileEditToggle();
    };

    onFollow = () => {
        const { ethAddress, isFollower, loggedEthAddress, profile } = this.props;
        const akashaId = profile.get('akashaId');
        if (isFollower) {
            this.props.actionAdd(loggedEthAddress, actionTypes.unfollow, { akashaId, ethAddress });
        } else {
            this.props.actionAdd(loggedEthAddress, actionTypes.follow, { akashaId, ethAddress });
        }
    };

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        if (!this.props.ethAddress) {
            return;
        }
        this.setState({
            content: popoverVisible ? DEFAULT : this.state.content,
            popoverVisible
        });
        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    content: null,
                });
            }, 100);
        }
    };

    onDefaultContent = () => {
        this.setState({ content: DEFAULT });
    };

    onSendTip = () => {
        this.setState({
            content: SEND_TIP
        });
    };

    renderProfileInfo = () => {
        const { ethAddress, followPending, intl, isFollower, loggedEthAddress, profile,
            tipPending } = this.props;
        const akashaId = profile.get('akashaId');
        const firstName = profile.get('firstName');
        const lastName = profile.get('lastName');
        const name = firstName || lastName ? `${firstName} ${lastName}` : null;
        const isOwnProfile = ethAddress === loggedEthAddress;
        const tipTooltip = tipPending ?
            intl.formatMessage(profileMessages.sendingTip) :
            intl.formatMessage(profileMessages.sendTip);
        const url = addPrefix(`/${ethAddress}`);
        const textClassName = classNames('profile-popover__header-text-wrapper', {
            'profile-popover__header-text-wrapper_own-profile': isOwnProfile
        });
        const tipIconClass = classNames('profile-popover__tip-icon', {
            'content-link': !tipPending,
            'profile-popover__tip-icon_disabled': tipPending
        });

        return (
          <div className="profile-popover__content">
            <div className="profile-popover__header">
              <div className="profile-popover__avatar-wrapper" onClick={() => this.onVisibleChange(false)}>
                <Avatar
                  akashaId={profile.get('akashaId')}
                  ethAddress={ethAddress}
                  firstName={profile.get('firstName')}
                  image={profile.get('avatar')}
                  lastName={profile.get('lastName')}
                  link
                  size="small"
                />
              </div>
              <div className={textClassName}>
                <div className="overflow-ellipsis profile-popover__name-wrapper">
                  <Link
                    className="unstyled-link"
                    onClick={() => this.onVisibleChange(false)}
                    to={`/${ethAddress}`}
                  >
                    <span className="content-link">
                      {name || getDisplayName({ akashaId, ethAddress })}
                    </span>
                  </Link>
                </div>
                {name &&
                  <div className="overflow-ellipsis profile-popover__akasha-id">
                    @{akashaId}
                  </div>
                }
              </div>
              <div className="flex-center-y">
                {!isOwnProfile &&
                  <div className="flex-center profile-popover__tip-icon-wrapper">
                    <Tooltip title={tipTooltip}>
                      <Icon
                        className={tipIconClass}
                        onClick={tipPending ? undefined : this.onSendTip}
                        type="wallet"
                      />
                    </Tooltip>
                  </div>
                }
                <ShareLinkModal url={url} />
              </div>
            </div>
            <div className="profile-popover__details">
              <div className="flex-center-y">
                <Tooltip title={intl.formatMessage(generalMessages.entries)}>
                  <Icon className="profile-popover__icon" type="entry" />
                </Tooltip>
                <div className="profile-popover__counter-text">
                  {profile.get('entriesCount')}
                </div>
                <Tooltip title={intl.formatMessage(generalMessages.comments)}>
                  <Icon className="profile-popover__icon" type="comment" />
                </Tooltip>
                <div className="profile-popover__counter-text">
                  {profile.get('commentsCount')}
                </div>
                <Tooltip title={intl.formatMessage(generalMessages.karma)}>
                  <Icon className="profile-popover__icon profile-popover__karma-icon" type="karma" />
                </Tooltip>
                <div className="profile-popover__counter-text">
                  {formatBalance(profile.get('karma'))}
                </div>
              </div>
              {profile.get('about') &&
                <div className="profile-popover__about">
                  <span className="profile-popover__about-inner">{profile.get('about')}</span>
                </div>
              }
            </div>
            <div className="profile-popover__counters-wrapper">
              <div style={{ marginRight: '12px' }}>
                <div>{intl.formatMessage(profileMessages.followers)}</div>
                <div className="profile-popover__counter">
                  {profile.get('followersCount')}
                </div>
              </div>
              <div>
                <div>{intl.formatMessage(profileMessages.followings)}</div>
                <div className="profile-popover__counter">
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
                <Button
                  className="profile-popover__button"
                  onClick={this.onAddToDashboard}
                >
                  {intl.formatMessage(dashboardMessages.addToBoard)}
                </Button>
              }
              {isOwnProfile &&
                <Button
                  className="profile-popover__button"
                  onClick={this.onEditProfile}
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.editProfile)}
                </Button>
              }
            </div>
          </div>
        );
    };

    renderContent () {
        const { ethAddress, profile } = this.props;
        const { content } = this.state;
        if (!ethAddress) {
            return null;
        }

        switch (content) {
            case DEFAULT:
                return this.renderProfileInfo();
            case SEND_TIP:
                return (
                  <SendTipForm
                    className="profile-popover__send-tip-form"
                    profile={profile}
                    onCancel={this.onDefaultContent}
                  />
                );
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
                    onCancel={this.onAddToDashboard}
                    ethAddress={ethAddress}
                  />
                );
            default:
                return null;
        }
    }

    render () {
        const { containerRef, placement } = this.props;
        const getPopupContainer = () => containerRef || document.body;

        return (
          <Popover
            arrowPointAtCenter
            content={this.wasVisible ? this.renderContent() : null}
            getPopupContainer={getPopupContainer}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="profile-popover"
            placement={placement}
            trigger="click"
            visible={this.state.popoverVisible}
          >
            {this.props.children}
          </Popover>
        );
    }
}

ProfilePopover.defaultProps = {
    placement: 'bottomLeft'
};

ProfilePopover.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    containerRef: PropTypes.shape(),
    ethAddress: PropTypes.string,
    followPending: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    isFollower: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    placement: PropTypes.string,
    profile: PropTypes.shape().isRequired,
    profileEditToggle: PropTypes.func.isRequired,
    tipPending: PropTypes.bool
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps;
    return {
        followPending: selectPendingFollow(state, ethAddress),
        isFollower: selectIsFollower(state, ethAddress),
        loggedEthAddress: selectLoggedEthAddress(state),
        profile: selectProfile(state, ethAddress),
        tipPending: selectPendingTip(state, ethAddress)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEditToggle
    }
)(injectIntl(ProfilePopover));
