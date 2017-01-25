import React from 'react';
import { IconButton, RaisedButton, SvgIcon, Paper } from 'material-ui';
import { Avatar } from 'shared-components';
import styles from './profile-hover-card.scss';
import { getInitials } from 'utils/dataModule';
import { UserDonate } from 'shared-components/svg';

const ProfileHoverCard = (props) => {
    const { profile, open, onAuthorNameClick, onTip, onFollow, intl, showCardActions } = props;
    const profileInitials = getInitials(profile.get('firstName'), profile.get('lastName'));
    const profileAvatar = (profile.get('avatar') === `${profile.get('baseUrl')}/`) ? null : profile.get('avatar');
    return (
      <div className={`${styles.rootWrapper} ${open ? styles.popover : ''}`}>
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
            <div className={`${styles.cardActions} col-xs-9 end-xs`}>
              <div className="row end-xs">
                <div className={`${styles.tipButton} col-xs-3`}>
                  <IconButton data-tip="Send tip" onClick={onTip}>
                    <SvgIcon>
                      <UserDonate />
                    </SvgIcon>
                  </IconButton>
                </div>
                <div className={`${styles.followButton} col-xs-5`}>
                  <RaisedButton
                    label={`Follow`}
                    primary
                    onClick={onFollow}
                  />
                </div>
              </div>
            </div>
            }
          </div>
          <div className={`${styles.cardBody} row`}>
            <div
              className={`${styles.profileName} col-xs-12`}
              onClick={onAuthorNameClick}
            >
              {profile.get('firstName')} {profile.get('lastName')}
            </div>
            <div className={`${styles.profileDetails} col-xs-12`}>
              @{profile.get('akashaId')} - {profile.get('followersCount')} followers
            </div>
          </div>
        </Paper>
      </div>
    );
};
ProfileHoverCard.propTypes = {
    profile: React.PropTypes.shape(),
    onAuthorNameClick: React.PropTypes.func,
    onTip: React.PropTypes.func,
    onFollow: React.PropTypes.func,
    open: React.PropTypes.bool,
    intl: React.PropTypes.shape().isRequired,
    showCardActions: React.PropTypes.bool
};

export default ProfileHoverCard;
