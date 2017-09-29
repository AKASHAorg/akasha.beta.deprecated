import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { IconButton, RaisedButton, SvgIcon } from 'material-ui';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import NotificationsActiveIcon from 'material-ui/svg-icons/social/notifications-active';
import NotificationsDisabledIcon from 'material-ui/svg-icons/social/notifications-off';
import { generalMessages, profileMessages } from 'locale-data/messages';
import { getInitials, getUrl } from 'utils/dataModule';
import imageCreator, { findBestMatch } from 'utils/imageUtils';
import { Avatar, PanelContainer } from 'shared-components';
import { UserDonate } from '../../../../../../../components/svg';
import { injectIntl } from 'react-intl';

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
            };
        }
        return {
            flex: 'none',
            height: '200px'
        };
    }

    handleCopyLink = (url) => {
        const { showNotification } = this.props;
        showNotification({
            id: 'linkCopiedToClipboard',
            duration: 2000
        });
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.top = -99999;
        textArea.style.left = -99999;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    };

    toggleNotifications = () => {
        const { disableNotifFrom, enableNotifFrom, isMuted, profileData } = this.props;
        const { akashaId, profile } = profileData.toJS();
        if (isMuted) {
            enableNotifFrom(akashaId, profile);
        } else {
            disableNotifFrom(akashaId, profile);
        }
    };

    renderHeader () {
        const { followPending, followProfile, intl, isFollower, isMuted, loggedAddress, sendingTip,
            sendTip, showPanel, unfollowProfile } = this.props;
        const profileData = this.props.profileData ?
            this.props.profileData.toJS() :
            {};
        const followProfilePending = followPending && followPending.find(follow =>
            follow.akashaId === profileData.akashaId);
        const sendingTipPending = sendingTip && sendingTip.find(flag =>
            flag.akashaId === profileData.akashaId);
        const { backgroundImage, avatar, profile } = profileData;
        const isOwnProfile = profile === loggedAddress;
        const bestMatch = findBestMatch(400, backgroundImage);
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src, profileData.baseUrl) :
            '';
        const userInitials = profileData.firstName || profileData.lastName ?
            getInitials(profileData.firstName, profileData.lastName) :
            '';
        const followers = intl.formatMessage(profileMessages.followersCount, {
            followers: profileData.followers || 0
        });

        return (<div style={{ height: '100%' }}>
          <div style={imageWrapperStyle}>
            <img
              src={imageUrl}
              style={this.getBackgroundImageStyle(backgroundImage[bestMatch])}
              alt=""
            />
          </div>
          <div
            style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'flex-end',
                height: '52px'
            }}
          >
            <Avatar
              image={avatar}
              size={100}
              userInitials={userInitials}
              userInitialsStyle={{
                  textTransform: 'uppercase',
                  fontSize: '36px',
                  fontWeight: '600',
                  margin: '0px'
              }}
              style={{ position: 'absolute', left: '30px', top: '-50px' }}
            />
            {!isOwnProfile && isFollower &&
              <div
                data-tip={isMuted ?
                    intl.formatMessage(profileMessages.enableNotifications) :
                    intl.formatMessage(profileMessages.disableNotifications)
                }
              >
                <IconButton
                  iconStyle={{ width: '20px', height: '20px' }}
                  style={{ width: '32px', height: '32px', padding: '4px', margin: '10px 5px' }}
                  onClick={this.toggleNotifications}
                >
                  <SvgIcon viewBox="0 0 18 18">
                    {isMuted ?
                      <NotificationsActiveIcon /> :
                      <NotificationsDisabledIcon />
                    }
                  </SvgIcon>
                </IconButton>
              </div>
            }
            {!isOwnProfile &&
              <div
                data-tip={sendingTipPending && sendingTipPending.value ?
                    intl.formatMessage(profileMessages.sendingTip) :
                    intl.formatMessage(profileMessages.sendTip)
                }
              >
                <IconButton
                  iconStyle={{ width: '20px', height: '20px' }}
                  style={{ width: '32px', height: '32px', padding: '4px', margin: '10px 5px' }}
                  onClick={() => sendTip(profileData)}
                  disabled={sendingTipPending && sendingTipPending.value}
                >
                  <SvgIcon viewBox="0 0 18 18">
                    <UserDonate />
                  </SvgIcon>
                </IconButton>
              </div>
            }
          </div>
          <div style={{ padding: '5px 30px 10px' }}>
            <div
              data-tip={`${profileData.firstName} ${profileData.lastName}`.slice(0, 60)}
              style={{
                  fontSize: '32px',
                  fontWeight: 400,
                  maxWidth: '340px',
                  height: '36px',
                  lineHeight: '36px',
                  display: 'inline-block',
                  overflowY: 'hidden',
                  ...wrapTextStyle
              }}
            >
              {`${profileData.firstName} ${profileData.lastName}`}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: '16px', fontWeight: 300 }}>
              <span style={{ display: 'inline-block', maxWidth: '340px', ...wrapTextStyle }}>
                {`@${profileData.akashaId}`}
                <span style={{ margin: '0 5px' }}>-</span>
              </span>
              {followers}
            </div>
            <RaisedButton
              label={isOwnProfile ?
                  intl.formatMessage(generalMessages.edit) :
                  isFollower ?
                      intl.formatMessage(profileMessages.unfollow) :
                      intl.formatMessage(profileMessages.follow)
              }
              primary
              style={{ margin: '20px 0' }}
              buttonStyle={{ width: '120px' }}
              labelStyle={{ fontWeight: 300 }}
              onClick={() => (isOwnProfile ?
                  showPanel({ name: 'editProfile', overlay: true }) :
                  isFollower ?
                      unfollowProfile(profileData.akashaId, profileData.profile) :
                      followProfile(profileData.akashaId, profileData.profile))
              }
              disabled={followProfilePending && followProfilePending.value}
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
                <div style={{ fontSize: '16px', fontWeight: 300, wordWrap: 'break-word' }}>
                  {profileData.about.split('\n').map((text, key) =>
                    (<span key={key}>
                      {text}
                      <br />
                    </span>)
                  )}
                </div>
              </div>
            }
            {profileData.links && !!profileData.links.length &&
              <div style={{ paddingBottom: '15px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>
                  {intl.formatMessage(profileMessages.links)}
                </div>
                {profileData.links.map(link =>
                  (<div
                    key={link.id}
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
                        data-tip={getUrl(link.url).slice(0, 60)}
                        style={{ display: 'inline-block', maxWidth: '100%', ...wrapTextStyle }}
                      >
                        {link.title}
                      </div>
                    </div>
                    <div data-tip="Copy link address">
                      <IconButton
                        onClick={() => { this.handleCopyLink(getUrl(link.url)); }}
                        style={{ padding: '6px 12px', height: '36px' }}
                      >
                        <CopyIcon />
                      </IconButton>
                    </div>
                  </div>)
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
    disableNotifFrom: PropTypes.func.isRequired,
    enableNotifFrom: PropTypes.func.isRequired,
    followPending: PropTypes.shape(),
    followProfile: PropTypes.func,
    intl: PropTypes.shape(),
    isFollower: PropTypes.bool,
    isMuted: PropTypes.bool,
    loggedAddress: PropTypes.string,
    profileData: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
    sendTip: PropTypes.func,
    showNotification: PropTypes.func.isRequired,
    showPanel: PropTypes.func.isRequired,
    unfollowProfile: PropTypes.func,
};

export default injectIntl(ProfileDetails);
