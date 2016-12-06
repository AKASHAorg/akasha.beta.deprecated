import React, { Component, PropTypes } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Paper, FlatButton } from 'material-ui';
import { Avatar } from 'shared-components';
import { profileMessages } from 'locale-data/messages';

class ProfileCard extends Component {

    componentWillMount () {
        const { isFollowerAction, loggedProfileData, profileData } = this.props;
        isFollowerAction(loggedProfileData.get('akashaId'), profileData.akashaId);
    }

    selectProfile = () => {
        const { profileData, selectProfile } = this.props;
        selectProfile(profileData.profile);
    }

    render () {
        const { followProfile, unfollowProfile, followPending, isFollowerPending, profileData,
            loggedProfileData, intl } = this.props;
        if (!profileData) {
            return null;
        }
        const { avatar, akashaId, firstName, lastName, entriesCount, followersCount,
            followingCount } = profileData;
        const isOwnProfile = akashaId === loggedProfileData.get('akashaId');
        const isFollower = loggedProfileData.getIn(['isFollower', akashaId]);
        const entriesCountMessage = <FormattedMessage
          id="app.profile.entriesCount"
          description="counting a profile's entries"
          defaultMessage={`{entriesCount, number} {entriesCount, plural,
                one {entry}
                few {entries}
                many {entries}
                other {entries}
              }`}
          values={{ entriesCount }}
        />;
        const followersCountMessage = <FormattedMessage
          id="app.profile.followersCount"
          description="counting a profile's followers"
          defaultMessage={`{followersCount, number} {followersCount, plural,
                one {follower}
                few {followers}
                many {followers}
                other {followers}
              }`}
          values={{ followersCount }}
        />;
        const followingCountMessage = <FormattedMessage
          id="app.profile.followingCount"
          description="counting a profile's following"
          defaultMessage={`{followingCount, number} {followingCount, plural,
                one {following}
                few {following}
                many {following}
                other {following}
              }`}
          values={{ followingCount }}
        />;
        const titleStyle = {
            fontSize: '18px',
            fontWeight: '500',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            border: '0px',
            outline: 'none',
            background: 'transparent'
        };
        const actionsStyle = {
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0 10px'
        };
        const profileName = `${firstName} ${lastName}`;
        const userInitials = profileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');

        return (
          <Paper
            style={{ width: '215px', margin: '10px', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
              <button
                style={{
                    border: '0px', outline: 'none', background: 'transparent', borderRadius: '50%'
                }}
                onClick={this.selectProfile}
              >
                <Avatar
                  image={avatar}
                  radius={80}
                  userInitials={userInitials}
                  userInitialsStyle={{
                      textTransform: 'uppercase',
                      fontSize: '32px',
                      fontWeight: '600',
                      margin: '0px'
                  }}
                  style={{ marginRight: 0 }}
                />
              </button>
            </div>
            <div style={{ padding: '0 16px 8px', textAlign: 'center', flex: '1 1 auto' }}>
              <button
                style={titleStyle}
                title={akashaId}
                onClick={this.selectProfile}
              >
                {akashaId}
              </button>
              <div style={{ fontSize: '14px', fontWeight: '300' }}>
                {entriesCount !== null && <div>{entriesCountMessage}</div>}
                {followersCount !== null && <div>{followersCountMessage}</div>}
                {followingCount !== null && <div>{followingCountMessage}</div>}
              </div>
            </div>
            <div style={actionsStyle}>
              <FlatButton
                label={isFollower ?
                    intl.formatMessage(profileMessages.unfollow) :
                    intl.formatMessage(profileMessages.follow)
                }
                primary
                labelStyle={{ fontWeight: 400 }}
                onClick={() => isFollower ?
                    unfollowProfile(akashaId) :
                    followProfile(akashaId)
                }
                disabled={isOwnProfile || isFollowerPending ||
                    (followPending && followPending.value)
                }
              />
            </div>
          </Paper>
        );
    }
}

ProfileCard.propTypes = {
    profileData: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    followProfile: PropTypes.func,
    unfollowProfile: PropTypes.func,
    followPending: PropTypes.shape(),
    isFollowerPending: PropTypes.bool,
    isFollowerAction: PropTypes.func.isRequired,
    selectProfile: PropTypes.func.isRequired,
    intl: PropTypes.shape()
};

ProfileCard.contextTypes = {
    router: PropTypes.shape()
};

export default injectIntl(ProfileCard);
