import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Button, Icon, Popover } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectBalance, selectIsFollower, selectLoggedAkashaId, selectProfile,
    selectProfileFlag } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { Avatar, PanelLink, SendTipForm } from '../';

class ProfilePopover extends Component {
    state = {
        popoverVisible: false,
        sendTip: false
    };

    componentWillReceiveProps (nextProps) {
        const { sendingTip } = nextProps;
        // Close the send tip form after sending tip
        if (sendingTip && !this.props.sendingTip) {
            this.toggleSendTip();
        }
    }

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onFollow = () => {
        const { akashaId, isFollower, loggedAkashaId } = this.props;
        if (isFollower) {
            this.props.actionAdd(loggedAkashaId, actionTypes.unfollow, { akashaId });
        } else {
            this.props.actionAdd(loggedAkashaId, actionTypes.follow, { akashaId });
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
        const { loggedAkashaId, profile } = this.props;
        this.props.actionAdd(loggedAkashaId, actionTypes.sendTip, {
            akashaId: profile.akashaId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            message,
            receiver: profile.profile,
            value
        });
    };

    renderContent () {
        const { akashaId, balance, followPending, intl, isFollower, loggedAkashaId, profile,
            sendingTip } = this.props;
        const name = profile.get('firstName') || profile.get('lastName') ?
            `${profile.get('firstName')} ${profile.get('lastName')}` :
            profile.get('akashaId');
        const isLoggedProfile = akashaId === loggedAkashaId;

        if (this.state.sendTip) {
            return (
              <SendTipForm
                balance={balance}
                name={name}
                onCancel={this.toggleSendTip}
                onSubmit={this.sendTip}
                sendingTip={sendingTip}
              />
            );
        }

        return (
          <div className="profile-popover__content">
            <div className="profile-popover__header">
              <div className="profile-popover__avatar-wrapper" onClick={() => this.onVisibleChange(false)}>
                <Avatar
                  akashaId={profile.get('akashaId')}
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
                  to={{ pathname: `/@${profile.get('akashaId')}`, state: { overlay: true } }}
                >
                  <div className="content-link overflow-ellipsis profile-popover__name">
                    {name}
                  </div>
                </Link>
                <div className="profile-popover__send-tip">
                  {!isLoggedProfile &&
                    <div className="content-link flex-center-y" onClick={this.toggleSendTip}>
                      <Icon className="profile-popover__tip-icon" type="wallet" />
                      {intl.formatMessage(profileMessages.sendTip)}
                    </div>
                  }
                </div>
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
              </div>
              {profile.get('about') &&
                <div className="profile-popover__about">
                  {profile.get('about')}
                </div>
              }
            </div>
            <div className="profile-popover__footer">
              <div className="flex-center-y">
                <Icon className="profile-popover__counter-icon" type="user" />
                <div className="profile-popover__counter-text">
                  {profile.get('followersCount')}
                </div>
                <Icon className="profile-popover__counter-icon" type="user" />
                <div className="profile-popover__counter-text">
                  {profile.get('followingCount')}
                </div>
              </div>
              {!isLoggedProfile &&
                <Button
                  disabled={followPending || !loggedAkashaId}
                  onClick={this.onFollow}
                  type="primary"
                >
                  <span className="profile-popover__button-label">
                    {isFollower ?
                        intl.formatMessage(profileMessages.unfollow) :
                        intl.formatMessage(profileMessages.follow)
                    }
                  </span>
                </Button>
              }
              {isLoggedProfile &&
                <PanelLink to="editProfile">
                  <Button onClick={() => this.onVisibleChange(false)} type="primary">
                    <span className="profile-popover__button-label">
                      {intl.formatMessage(generalMessages.edit)}
                    </span>
                  </Button>
                </PanelLink>
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
    akashaId: PropTypes.string.isRequired,
    balance: PropTypes.string,
    children: PropTypes.node.isRequired,
    containerRef: PropTypes.shape(),
    followPending: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    isFollower: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    placement: PropTypes.string,
    profile: PropTypes.shape().isRequired,
    sendingTip: PropTypes.bool
};

function mapStateToProps (state, ownProps) {
    const { akashaId } = ownProps;
    return {
        balance: selectBalance(state),
        followPending: selectProfileFlag(state, 'followPending').get(akashaId),
        isFollower: selectIsFollower(state, akashaId),
        loggedAkashaId: selectLoggedAkashaId(state),
        profile: selectProfile(state, akashaId),
        sendingTip: selectProfileFlag(state, 'sendingTip').get(akashaId)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd
    }
)(injectIntl(ProfilePopover));
