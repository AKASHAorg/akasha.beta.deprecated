import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { ProfileActions } from 'local-flux';
import { IconButton, RaisedButton, SvgIcon, Paper } from 'material-ui';
import { Avatar } from 'shared-components';
import { getInitials } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import imageCreator from 'utils/imageUtils';
import { UserDonate } from 'shared-components/svg'; // eslint-disable-line import/no-unresolved, import/extensions
import { profileMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './profile-hover-card.scss';

const ProfileHoverCard = (props, context) => {
    const { anchorNode, followPending, followingsList, intl, loggedProfile, profile,
        profileActions, sendingTip } = props;
    const { router } = context;
    const profileInitials = getInitials(profile.firstName, profile.lastName);
    const profileAvatar = imageCreator(profile.avatar, profile.baseUrl);
    const isLoggedProfile = profile.profile === loggedProfile.get('profile');
    const isFollowing = followingsList.includes(profile.profile);
    const followProfilePending = followPending && followPending.find(follow =>
        follow.akashaId === profile.akashaId);
    const tipProfilePending = sendingTip && sendingTip.find(prf =>
        prf.akashaId === profile.akashaId);

    const navigateToProfile = () => {
        router.push(`${loggedProfile.get('akashaId')}/profile/${profile.profile}`);
    };

    const onTip = () => {
        ReactTooltip.hide();
        profileActions.addSendTipAction({
            akashaId: profile.akashaId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profile: profile.profile
        });
    };

    const onFollow = () =>
        profileActions.addFollowProfileAction(profile.akashaId, profile.profile);

    const onUnfollow = () =>
        profileActions.addUnfollowProfileAction(profile.akashaId, profile.profile);

    return (
      <div
        className={`${styles.rootWrapper} ${styles.popover}`}
        style={{
            left: anchorNode ? anchorNode.offsetLeft : 0,
            top: anchorNode ?
                anchorNode.offsetTop + (anchorNode.getBoundingClientRect().height - 8) :
                28
        }}
      >
        <Paper
          zDepth={1}
          className={`${styles.root}`}
        >
          <div className="caret-up" />
          <div className={`${styles.hoverCardHeader} row`}>
            <div className={`${styles.avatar} col-xs-3 start-xs`}>
              <Avatar
                userInitials={profileInitials}
                image={profileAvatar}
                radius={60}
                onClick={navigateToProfile}
                style={{ cursor: 'pointer' }}
              />
            </div>
            {!isLoggedProfile &&
              <div className={`${styles.cardActions} col-xs-9`}>
                <div className="row end-xs">
                  <div className={`${styles.tipButton} col-xs-3`}>
                    <IconButton
                      data-tip="Send tip"
                      onClick={onTip}
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
                      onClick={isFollowing ? onUnfollow : onFollow}
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
                onClick={navigateToProfile}
                className={`${styles.profileName}`}
              >
                {profile.firstName} {profile.lastName}
              </div>
            </div>
            <div className={`${styles.profileDetails} col-xs-12`}>
              @{profile.akashaId} - {profile.followersCount} followers
            </div>
          </div>
        </Paper>
      </div>
    );
};

ProfileHoverCard.contextTypes = {
    router: PropTypes.shape()
};

ProfileHoverCard.propTypes = {
    anchorNode: PropTypes.shape(),
    followingsList: PropTypes.shape(),
    followPending: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
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
