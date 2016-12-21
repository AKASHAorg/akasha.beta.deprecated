import React, { Component, PropTypes } from 'react';
import { IconButton, RaisedButton } from 'material-ui';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import { generalMessages, profileMessages } from 'locale-data/messages';
import imageCreator, { findBestMatch } from 'utils/imageUtils';
import { Avatar, PanelContainer } from 'shared-components';
import { FormattedMessage, injectIntl } from 'react-intl';

// Remember to update height and width values inside getBackgroundImageStyle method
const imageWrapperStyle = {
    height: '200px',
    width: '400px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const wrapTextStyle = {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis'
};

class ProfileDetails extends Component {

    getBackgroundImageStyle = (backgroundImage) => {
        if (!backgroundImage) {
            return {};
        }
        const originalRatio = backgroundImage.width / backgroundImage.height;
        const actualRatio = 400 / 200;
        if (originalRatio > 4 || originalRatio < actualRatio) {
            return {
                flex: 'none',
                width: '400px'
            }
        } else {
            return {
                flex: 'none',
                height: '200px'
            };
        }
    }

    handleCopyLink = (url) => {
        let textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.top = -99999;
        textArea.style.left = -99999;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    };

    renderHeader () {
        const { isFollowerPending, isFollower, followProfile, unfollowProfile, loggedAddress,
            followPending, intl, showPanel } = this.props;
        const profileData = this.props.profileData ?
            this.props.profileData.toJS() :
            {};
        const followProfilePending = followPending && followPending.find(follow =>
            follow.akashaId === profileData.akashaId);
        const { backgroundImage, avatar, profile } = profileData;
        const isOwnProfile = profile === loggedAddress;
        const bestMatch = findBestMatch(400, backgroundImage);
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src, profileData.baseUrl) :
            '';
        const profileName = `${profileData.firstName} ${profileData.lastName}`;
        const userInitials = profileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
        const followers = (<FormattedMessage
          id="app.profile.followersCount"
          description="counting a profile's followers"
          defaultMessage={`{followersCount, number} {followersCount, plural,
            one {follower}
            few {followers}
            many {followers}
            other {followers}
          }`}
          values={{ followersCount: profileData.followersCount || 0 }}
        />);

        return (<div>
          <div style={imageWrapperStyle}>
            <img
              src={imageUrl}
              style={this.getBackgroundImageStyle(backgroundImage[bestMatch])}
              role="presentation"
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Avatar
              image={avatar}
              radius={100}
              userInitials={userInitials}
              userInitialsStyle={{
                  textTransform: 'uppercase',
                  fontSize: '36px',
                  fontWeight: '600',
                  margin: '0px'
              }}
              style={{ position: 'absolute', left: '30px', bottom: '-50px' }}
            />
          </div>
          <div style={{ padding: '50px 30px 10px' }}>
            <div
              title={`${profileData.firstName} ${profileData.lastName}`}
              style={{
                  fontSize: '32px',
                  fontWeight: 400,
                  textTransform: 'capitalize',
                  maxWidth: '340px',
                  ...wrapTextStyle
              }}
            >
              {`${profileData.firstName} ${profileData.lastName}`}
            </div>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: '16px', fontWeight: 300 }}>
                <span style={{ display: 'inline-block', maxWidth: '340px', ...wrapTextStyle }}>
                  {`@${profileData.akashaId}`}
                  <span style={{ margin: '0 5px' }}>-</span>
                </span>
                {followers}
              </div>
            </div>
            <RaisedButton
              label={isOwnProfile ?
                  intl.formatMessage(generalMessages.edit) :
                  (!isFollowerPending && isFollower) ?
                      intl.formatMessage(profileMessages.unfollow) :
                      intl.formatMessage(profileMessages.follow)
              }
              primary
              style={{ margin: '20px 0' }}
              buttonStyle={{ width: '120px' }}
              labelStyle={{ fontWeight: 300 }}
              onClick={() => isOwnProfile ?
                  showPanel({ name: 'editProfile', overlay: true }) :
                  isFollower ?
                      unfollowProfile(profileData.akashaId) :
                      followProfile(profileData.akashaId)
              }
              disabled={isFollowerPending || (followProfilePending && followProfilePending.value)}
            />
          </div>
        </div>);
    }

    render () {
        const { intl } = this.props;
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};

        return (<PanelContainer
          style={{ flex: '0 0 400px', height: '100%' }}
          header={this.renderHeader()}
          headerStyle={{ padding: '0px' }}
          contentStyle={{ padding: '0 30px 30px', top: '408px', bottom: '0px' }}
          showBorder={false}
          headerHeight={408}
          headerMinHeight={408}
        >
          <div
            style={{
                maxWidth: '340px', overflowY: 'auto', overflowX: 'hidden'
            }}
          >
            {profileData.about &&
              <div style={{ paddingBottom: '15px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>
                  {intl.formatMessage(profileMessages.about)}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 300 }}>
                  {profileData.about}
                </div>
              </div>
            }
            {profileData.links && !!profileData.links.length &&
              <div style={{ paddingBottom: '15px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>
                  {intl.formatMessage(profileMessages.links)}
                </div>
                {profileData.links.map((link, key) =>
                  <div
                    key={key}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        fontSize: '16px',
                        fontWeight: 300,
                    }}
                  >
                    <div
                      style={{
                          width: '292px',
                          display: 'flex',
                          alignItems: 'center'
                      }}
                    >
                      <div
                        title={link.url}
                        style={{ display: 'inline-block', maxWidth: '100%', ...wrapTextStyle }}
                      >
                        {link.title}
                      </div>
                    </div>
                    <IconButton
                      onClick={() => { this.handleCopyLink(link.url) }}
                      title="Copy link address"
                      style={{ padding: '6px 12px', height: '36px' }}
                    >
                      <CopyIcon  />
                    </IconButton>
                  </div>
                )}
              </div>
            }
          </div>
        </PanelContainer>);
    }
}

ProfileDetails.contextTypes = {
    muiTheme: PropTypes.shape()
};

ProfileDetails.propTypes = {
    loggedAddress: PropTypes.string,
    profileData: PropTypes.shape(),
    followProfile: PropTypes.func,
    unfollowProfile: PropTypes.func,
    followPending: PropTypes.shape(),
    isFollowerPending: PropTypes.bool,
    isFollower: PropTypes.bool,
    intl: PropTypes.shape(),
    showPanel: PropTypes.func.isRequired
};

export default injectIntl(ProfileDetails);
