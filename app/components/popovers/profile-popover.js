import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Button, Icon, Popover, Spin } from 'antd';
import classNames from 'classnames';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectBalance, selectIsFollower, selectLoggedEthAddress, selectPendingFollow,
    selectPendingTip, selectProfile, } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';
import { Avatar, SendTipForm } from '../';

class ProfilePopover extends Component {
    state = {
        followHovered: false,
        popoverVisible: false,
        sendTip: false
    };

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
        this.setState({
            popoverVisible
        });
        if (!popoverVisible && this.state.sendTip) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    sendTip: false,
                });
            }, 100);
        }
    };

    toggleSendTip = () => {
        this.setState({
            sendTip: !this.state.sendTip
        });
    };

    sendTip = ({ value, message }) => {
        const { ethAddress, loggedEthAddress, profile } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.sendTip, {
            akashaId: profile.akashaId,
            ethAddress,
            firstName: profile.firstName,
            lastName: profile.lastName,
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
                <Spin className="profile-popover__button-icon" size="small" />
                {intl.formatMessage(generalMessages.pending)}
              </div>
            );
        } else if (isFollower) {
            const message = followHovered ?
                intl.formatMessage(profileMessages.unfollow) :
                intl.formatMessage(profileMessages.following);
            label = (
              <div className="flex-center">
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
        const { balance, ethAddress, intl, loggedEthAddress, profile, tipPending } = this.props;
        const akashaId = profile.get('akashaId');
        const firstName = profile.get('firstName');
        const lastName = profile.get('lastName');
        const name = firstName || lastName ? `${firstName} ${lastName}` : null;
        const isOwnProfile = ethAddress === loggedEthAddress;

        if (this.state.sendTip) {
            return (
              <SendTipForm
                balance={balance}
                name={name}
                onCancel={this.toggleSendTip}
                onSubmit={this.sendTip}
                tipPending={tipPending}
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
                  to={{ pathname: `/${ethAddress}`, state: { overlay: true } }}
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
                <Icon className="profile-popover__counter-icon" type="file" />
                <div className="profile-popover__counter-text">
                  {profile.get('entriesCount')}
                </div>
                <Icon className="profile-popover__counter-icon" type="message" />
                <div className="profile-popover__counter-text">
                  {profile.get('commentsCount') || 3}
                </div>
                <Icon className="profile-popover__counter-icon" type="trophy" />
                <div className="profile-popover__counter-text">
                  85
                </div>
              </div>
              {profile.get('about') &&
                <div className="profile-popover__about">
                  <span className="profile-popover__about-inner">{profile.get('about')}</span>
                </div>
              }
            </div>
            <div className="profile-popover__counters-wrapper">
              <div>
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
              <div>
                <div>{intl.formatMessage(profileMessages.supported)}</div>
                <div className="profile-popover__counter">{0}</div>
              </div>
              <div>
                <div>{intl.formatMessage(profileMessages.supporting)}</div>
                <div className="profile-popover__counter">{0}</div>
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
                    <Icon className="profile-popover__button-icon" type="heart-o" />
                    {intl.formatMessage(profileMessages.support)}
                  </div>
                </Button>
              }
              {isOwnProfile &&
                <Button
                  className="profile-popover__button"
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
            content={this.renderContent()}
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
    balance: PropTypes.string,
    children: PropTypes.node.isRequired,
    containerRef: PropTypes.shape(),
    ethAddress: PropTypes.string.isRequired,
    followPending: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    isFollower: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    placement: PropTypes.string,
    profile: PropTypes.shape().isRequired,
    tipPending: PropTypes.bool
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps;
    return {
        balance: selectBalance(state),
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
        actionAdd
    }
)(injectIntl(ProfilePopover));
