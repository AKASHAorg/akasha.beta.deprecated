import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { ProfileActions } from 'local-flux';
import { IconButton, RaisedButton, SvgIcon, Paper } from 'material-ui';
import { Avatar, DataLoader } from 'shared-components';
import { getInitials } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import imageCreator from 'utils/imageUtils'; // eslint-disable-line import/no-unresolved, import/extensions
import { UserDonate } from 'shared-components/svg'; // eslint-disable-line import/no-unresolved, import/extensions
import { profileMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './profile-hover-card.scss';

class ProfileHoverCard extends Component {

    state = {
        isHovered: false
    };

    onMouseEnter = () => {
        this.setState({
            isHovered: true
        });
    };

    onMouseLeave = () => {
        this.setState({
            isHovered: false
        });
    };

    onTip = () => {
        const { profile, profileActions } = this.props;
        ReactTooltip.hide();
        profileActions.addSendTipAction({
            akashaId: profile.akashaId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profile: profile.profile
        });
    };

    onFollow = () => {
        const { profile, profileActions } = this.props;
        profileActions.addFollowProfileAction(profile.akashaId, profile.profile);
    };

    onUnfollow = () => {
        const { profile, profileActions } = this.props;
        profileActions.addUnfollowProfileAction(profile.akashaId, profile.profile);
    };

    getPosition = () => {
        const { anchorNode, containerNode } = this.props;
        let left;
        let top;
        if (containerNode) {
            const anchorRect = anchorNode.getBoundingClientRect();
            const containerRect = containerNode.getBoundingClientRect();
            left = anchorRect.left - containerRect.left;
            top = anchorRect.bottom - containerRect.top;
        } else {
            left = anchorNode.offsetLeft;
            top = anchorNode.offsetTop + (anchorNode.getBoundingClientRect().height);
        }

        return {
            left,
            top
        };
    };

    navigateToProfile = () => {
        const { loggedProfile, profile } = this.props;
        const { router } = this.context;
        router.push(`${loggedProfile.get('akashaId')}/profile/${profile.profile}`);
    };

    render () {
        const { anchorNode, anchorHovered, followPending, followingsList, intl,
            loading, loggedProfile, profile, sendingTip } = this.props;
        if (!anchorNode || (!anchorHovered && !this.state.isHovered)) {
            return null;
        }
        const profileInitials = getInitials(profile.firstName, profile.lastName);
        let profileAvatar;
        if (profile.avatar) {
            profileAvatar = imageCreator(profile.avatar, profile.baseUrl);
        }
        const isLoggedProfile = profile.profile === loggedProfile.get('profile');
        const isFollowing = followingsList.includes(profile.profile);
        const followProfilePending = followPending && followPending.find(follow =>
            follow.akashaId === profile.akashaId);
        const tipProfilePending = sendingTip && sendingTip.find(prf =>
            prf.akashaId === profile.akashaId);
        const { left, top } = this.getPosition();

        return (
          <div
            className={`${styles.rootWrapper} ${styles.popover}`}
            style={{ left, top }}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            <Paper
              zDepth={1}
              className={`${styles.root}`}
            >
              <DataLoader flag={loading || !profile}>
                <div>
                  <div className="caret-up" />
                  <div className={`${styles.hoverCardHeader} row`}>
                    <div className={`${styles.avatar} col-xs-3 start-xs`}>
                      <Avatar
                        userInitials={profileInitials}
                        image={profileAvatar}
                        radius={60}
                        onClick={this.navigateToProfile}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    {!isLoggedProfile &&
                      <div className={`${styles.cardActions} col-xs-9`}>
                        <div className="row end-xs">
                          <div className={`${styles.tipButton} col-xs-3`}>
                            <IconButton
                              data-tip="Send tip"
                              onClick={this.onTip}
                              disabled={tipProfilePending && tipProfilePending.value}
                            >
                              <SvgIcon>
                                <UserDonate />
                              </SvgIcon>
                            </IconButton>
                          </div>
                          <div className={`${styles.followButton} ${isFollowing ? 'col-xs-6' : 'col-xs-5'}`}>
                            <RaisedButton
                              label={isFollowing ?
                                  intl.formatMessage(profileMessages.unfollow) :
                                  intl.formatMessage(profileMessages.follow)
                              }
                              primary={!isFollowing}
                              onClick={isFollowing ? this.onUnfollow : this.onFollow}
                              disabled={followProfilePending && followProfilePending.value}
                            />
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  <div className={`${styles.cardBody} row`}>
                    <div
                      className="col-xs-12"
                    >
                      <div
                        onClick={this.navigateToProfile}
                        className={`${styles.profileName}`}
                      >
                        {profile.firstName} {profile.lastName}
                      </div>
                    </div>
                    <div className={`${styles.profileDetails} col-xs-12`}>
                      @{profile.akashaId} - {profile.followersCount} followers
                    </div>
                  </div>
                </div>
              </DataLoader>
            </Paper>
          </div>
        );
    }
}

ProfileHoverCard.defaultProps = {
    profile: {},
    loading: false
};

ProfileHoverCard.contextTypes = {
    router: PropTypes.shape()
};

ProfileHoverCard.propTypes = {
    anchorHovered: PropTypes.bool,
    anchorNode: PropTypes.shape(),
    containerNode: PropTypes.shape(),
    followingsList: PropTypes.shape(),
    followPending: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    loading: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    profile: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        followingsList: state.profileState.get('followingsList'),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        loggedProfile: state.profileState.get('loggedProfile'),
        sendingTip: state.profileState.getIn(['flags', 'sendingTip']),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ProfileHoverCard));
