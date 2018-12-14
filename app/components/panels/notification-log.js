import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'react-router-dom/Link';
import { injectIntl } from 'react-intl';
import Waypoint from 'react-waypoint';
import { Tooltip } from 'antd';
import { Icon, ProfilePopover, Avatar } from '../';
import * as notificationEvents from '../../constants/notification-events';
import { entryGetShort } from '../../local-flux/actions/entry-actions';
import { profileGetData, profileIsFollower } from '../../local-flux/actions/profile-actions';
import { selectEntry, selectLoggedEthAddress, selectPendingEntries, selectPendingProfiles,
    selectProfile } from '../../local-flux/selectors';
import { generalMessages, notificationMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';

const getEthAddress = (notification) => {
    switch (notification.type) {
        case notificationEvents.COMMENT_EVENT:
            return notification.payload.author;
        case notificationEvents.DONATION_EVENT:
            return notification.payload.from;
        case notificationEvents.FOLLOWING_EVENT:
            return notification.payload.follower;
        case notificationEvents.VOTE_EVENT:
            return notification.payload.voter;
        default:
            return null;
    }
};

class NotificationLog extends Component {
    firstLoad = true;

    shouldComponentUpdate (nextProps) {
        const { entry, notification, pendingEntry, pendingProfile, profile } = nextProps;
        if (
            (notification.payload.entryId && entry && !entry.equals(this.props.entry)) ||
            pendingEntry !== this.props.pendingEntry ||
            pendingProfile !== this.props.pendingProfile ||
            !profile.equals(this.props.profile)
        ) {
            return true;
        }
        return false;
    }

    loadData = () => {
        if (!this.firstLoad) {
            return;
        }
        const { entry, loggedEthAddress, notification, profile } = this.props;
        this.firstLoad = false;
        const ethAddress = getEthAddress(notification);
        if (!entry && notification.payload.entryId) {
            this.props.entryGetShort({
                context: 'notifications',
                entryId: notification.payload.entryId,
                ethAddress: loggedEthAddress
            });
        }
        if (!profile.get('ethAddress')) {
            this.props.profileGetData({ context: 'notifications', ethAddress });
            this.props.profileIsFollower([ethAddress]);
        }
    };

    getNotificationMessage = () => {
        const { notification } = this.props;
        if (notification.type === notificationEvents.DONATION_EVENT) {
            const { eth, aeth } = notification.payload;
            if (!Number(eth)) {
                return notificationMessages.DONATION_EVENT_AETH;
            } else if (!Number(aeth)) {
                return notificationMessages.DONATION_EVENT_ETH;
            }
            return notificationMessages.DONATION_EVENT_BOTH;
        }
        return notificationMessages[notification.type];
    }

    render () {
        const { containerRef, entry, intl, loggedEthAddress, notification, pendingEntry, pendingProfile,
            profile } = this.props;
        const hasEntry = !!notification.payload.entryId;
        const entryLoading = hasEntry && (!entry || pendingEntry);

        if (!profile.get('ethAddress') || pendingProfile || entryLoading) {
            return (
              <div className="notification-log">
                <Waypoint scrollableAncestor={containerRef} onEnter={this.loadData} />
                <div className="content-placeholder notification-log__avatar-placeholder" />
                <div className="notification-log__text-wrapper">
                  <div className="content-placeholder notification-log__text-placeholder" />
                  <div className="content-placeholder notification-log__text-placeholder-2" />
                </div>
              </div>
            );
        }
        const blockNr = notification.blockNumber;
        const url = `https://rinkeby.etherscan.io/block/${blockNr}`;
        const akashaId = profile.get('akashaId');
        const ethAddress = profile.get('ethAddress');
        const displayName = getDisplayName({ akashaId, ethAddress });
        const entryTitle = (entry && entry.getIn(['content', 'title'])) ||
            intl.formatMessage(generalMessages.anEntry);

        return (
          <div className="notification-log">
            <div className="notification-log__avatar-wrapper">
              <ProfilePopover ethAddress={ethAddress} containerRef={containerRef}>
                <Avatar
                  className="notification-log__avatar"
                  firstName={profile.get('firstName')}
                  image={profile.get('avatar')}
                  lastName={profile.get('lastName')}
                  size="small"
                />
              </ProfilePopover>
            </div>
            <div className="notification-log__text-wrapper">
              <div className="notification-log__description">
                <ProfilePopover ethAddress={ethAddress} containerRef={containerRef}>
                  <span className="content-link">{displayName}</span>
                </ProfilePopover>
                <span className="notification-log__message">
                  {intl.formatMessage(this.getNotificationMessage(), { ...notification.payload })}
                </span>
                {hasEntry &&
                  <Link
                    className="unstyled-link content-link"
                    to={{
                        pathname: `/${loggedEthAddress}/${entry.get('entryId')}`,
                        state: { overlay: true }
                    }}
                  >
                    {entryTitle}
                  </Link>
                }
              </div>
              <div>
                <Tooltip
                  arrowPointAtCenter
                  title={intl.formatMessage(generalMessages.seeOnEtherscan)}
                >
                  <a
                    className="unstyled-link has-hidden-action flex-center-y notification-log__link"
                    href={url}
                  >
                    {intl.formatMessage(notificationMessages.notifBlockNr, { blockNr })}
                    <Icon className="hidden-action notification-log__link-icon" type="link" />
                  </a>
                </Tooltip>
              </div>
            </div>
          </div>
        );
    }
}

NotificationLog.propTypes = {
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape(),
    entryGetShort: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
    notification: PropTypes.shape().isRequired,
    pendingEntry: PropTypes.bool,
    pendingProfile: PropTypes.bool,
    profile: PropTypes.shape().isRequired,
    profileGetData: PropTypes.func.isRequired,
    profileIsFollower: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
    const { notification } = ownProps;
    const ethAddress = getEthAddress(notification);
    const entryId = notification.payload.entryId;
    const pendingEntries = entryId && selectPendingEntries(state, 'notifications');
    const pendingProfiles = selectPendingProfiles(state, 'notifications');
    return {
        entry: selectEntry(state, entryId),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingEntry: entryId && pendingEntries && pendingEntries.get(entryId),
        pendingProfile: pendingProfiles && pendingProfiles.get(ethAddress),
        profile: selectProfile(state, ethAddress),
    };
}

export default connect(
    mapStateToProps,
    {
        entryGetShort,
        profileGetData,
        profileIsFollower,
    }
)(injectIntl(NotificationLog));
