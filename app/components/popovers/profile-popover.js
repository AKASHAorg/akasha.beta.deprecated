import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Button, Popover, Spin, Tooltip } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileEditToggle } from '../../local-flux/actions/app-actions';
import { selectIsFollower, selectLoggedEthAddress, selectPendingFollow,
    selectPendingTip, selectProfile, } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';
import { formatBalance } from '../../utils/number-formatter';
import { Avatar, Icon, SendTipForm } from '../';

class ProfilePopover extends Component {
    state = {
        followHovered: false,
        popoverVisible: false,
        sendTip: false
    };
    wasVisible = false;

    componentWillReceiveProps (nextProps) {
        const { tipPending } = nextProps;
        // Close the send tip form after sending tip
        if (tipPending && !this.props.tipPending) {
            this.toggleSendTip();
        }
    }

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
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
            popoverVisible
        });
        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    sendTip: false,
                });
            }, 100);
        }
    };

    profileEdit = () => {
        this.props.profileEditToggle();
        this.setState({ popoverVisible: false });
    }

    toggleSendTip = () => {
        this.setState({
            sendTip: !this.state.sendTip
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
                <Spin className="profile-popover__icon" size="small" />
                {intl.formatMessage(generalMessages.pending)}
              </div>
            );
        } else if (isFollower) {
            const message = followHovered ?
                intl.formatMessage(profileMessages.unfollow) :
                intl.formatMessage(profileMessages.following);
            const className = classNames('flex-center', {
                'profile-popover__contrast-color': followHovered
            });
            label = (
              <div className={className}>
                <Icon className="profile-popover__button-icon" type={followHovered ? 'close' : 'check'} />
                {message}
              </div>
            );
        } else {
            label = (
              <div className="flex-center">
                <Icon className="profile-popover__button-icon" type="plus" />
                {intl.formatMessage(profileMessages.follow)}
              </div>
            );
        }
        const className = classNames(
            'profile-popover__button',
            {
                'profile-popover__unfollow-button': !followPending && isFollower && followHovered,
                'profile-popover__following-button': !followPending && isFollower && !followHovered
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

    renderContent () {
        const { ethAddress, intl, loggedEthAddress, profile, tipPending } = this.props;
        if (!ethAddress) {
            return null;
        }
        const akashaId = profile.get('akashaId');
        const firstName = profile.get('firstName');
        const lastName = profile.get('lastName');
        const name = firstName || lastName ? `${firstName} ${lastName}` : null;
        const isOwnProfile = ethAddress === loggedEthAddress;

        if (this.state.sendTip) {
            return (
              <SendTipForm
                profile={profile}
                onCancel={this.toggleSendTip}
              />
            );
        }

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
              <div>
                <Link
                  className="unstyled-link"
                  onClick={() => this.onVisibleChange(false)}
                  to={`/${ethAddress}`}
                >
                  <div className="content-link flex-center-y overflow-ellipsis profile-popover__name">
                    {name || getDisplayName({ akashaId, ethAddress })}
                  </div>
                </Link>
                {name &&
                  <div className="profile-popover__akasha-id">
                    @{akashaId}
                  </div>
                }
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
                  <Icon className="profile-popover__icon" type="comment" />
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
              {!isOwnProfile && this.renderFollowButton()}
              {!isOwnProfile &&
                <Button
                  className="profile-popover__button"
                  disabled={tipPending}
                  onClick={this.toggleSendTip}
                  size="large"
                >
                  <div>
                    <Icon className="profile-popover__button-icon" type="heart" />
                    {intl.formatMessage(profileMessages.support)}
                  </div>
                </Button>
              }
              {isOwnProfile &&
                <Button
                  className="profile-popover__button"
                  onClick={this.profileEdit}
                  size="large"
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.editProfile)}
                </Button>
              }
            </div>
          </div>
        );
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
