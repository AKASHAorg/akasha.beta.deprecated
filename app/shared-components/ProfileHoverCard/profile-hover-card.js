import React from 'react';
import { IconButton, RaisedButton, SvgIcon, Paper } from 'material-ui';
import { Avatar } from 'shared-components';
import { getInitials } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import imageCreator from 'utils/imageUtils';
import { UserDonate } from 'shared-components/svg'; // eslint-disable-line import/no-unresolved, import/extensions
import { profileMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './profile-hover-card.scss';

class ProfileHoverCard extends React.Component {
    render () {
        const { profile, onAuthorNameClick, onTip, onFollow, onUnfollow, intl,
            showCardActions, isFollowing, anchorNode, followDisabled } = this.props;
        const profileInitials = getInitials(profile.firstName, profile.lastName);
        const profileAvatar = imageCreator(profile.avatar, profile.baseUrl);

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
              zDepth={2}
              className={`${styles.root}`}
            >
              <div className="caret-up" />
              <div className={`${styles.hoverCardHeader} row`}>
                <div className={`${styles.avatar} col-xs-3 start-xs`}>
                  <Avatar
                    userInitials={profileInitials}
                    image={profileAvatar}
                    radius={60}
                    onClick={onAuthorNameClick}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                {showCardActions &&
                <div className={`${styles.cardActions} col-xs-9`}>
                  <div className="row end-xs">
                    <div className={`${styles.tipButton} col-xs-3`}>
                      <IconButton data-tip="Send tip" onClick={onTip}>
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
                        disabled={followDisabled}
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
                    onClick={onAuthorNameClick}
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
    }
};
ProfileHoverCard.propTypes = {
    profile: React.PropTypes.shape(),
    onAuthorNameClick: React.PropTypes.func,
    onTip: React.PropTypes.func,
    onFollow: React.PropTypes.func,
    onUnfollow: React.PropTypes.func,
    intl: React.PropTypes.shape().isRequired,
    showCardActions: React.PropTypes.bool,
    isFollowing: React.PropTypes.bool,
    anchorNode: React.PropTypes.shape(),
    followDisabled: React.PropTypes.bool,
};

export default ProfileHoverCard;
