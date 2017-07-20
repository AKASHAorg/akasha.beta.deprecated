import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'antd';
import { Avatar } from '../';
import imageCreator, { findBestMatch } from '../../utils/imageUtils';
import { getInitials } from '../../utils/dataModule';

const imageWrapperStyle = {
    height: '200px',
    width: '400px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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

    render () {
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};
        console.log(profileData);
        const { about, avatar, akashaId, backgroundImage, links, firstName, lastName,
        followersCount, followingCount } = profileData;
        const { isFollower, followProfile, unfollowProfile } = this.props;
        const isOwnProfile = akashaId === this.props.loggedProfile.akashaId;
        const bestMatch = findBestMatch(400, backgroundImage);
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src, profileData.baseUrl) :
            '';
        const userInitials = profileData.firstName || profileData.lastName ?
            getInitials(profileData.firstName, profileData.lastName) :
            '';
        return (<div style={{ height: '100%' }}>
          <div
            style={{
                maxWidth: '400px', overflowY: 'auto', overflowX: 'hidden'
            }}
          >
            <div style={imageWrapperStyle}>
              {imageUrl ?
                <img
                  src={imageUrl}
                  style={this.getBackgroundImageStyle(backgroundImage[bestMatch])}
                  alt=""
                /> :
                <div style={{ height: '200px', width: '400px', backgroundColor: '#6c747f' }} />
              }
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '-70px'
            }}
            >
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
                style={{ paddingLeft: '20px' }}
              />
              <div style={{ paddingRight: '20px' }}>
                {isOwnProfile ? 
                  <Button type="primary" ghost>Edit</Button> :
                  isFollower ?
                    <Button type="primary" ghost onClick={() => unfollowProfile(akashaId)}>Unfollow</Button> :
                    <Button type="primary" ghost onClick={() => followProfile(akashaId)}>Follow</Button>
                }
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '16px', fontWeight: 500 }}>{firstName} {lastName}</span>
              {!isOwnProfile &&
                <Button type="primary" ghost>Send Tip</Button>
              }
            </div>

            <div style={{ }}>
              @{akashaId}
            </div>

            <div style={{ }}>
              {followersCount} Followers | {followingCount} Following
            </div>


            {about &&
              <div style={{ paddingBottom: '15px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>
                  About
                </div>
                <div style={{ fontSize: '16px', fontWeight: 300, wordWrap: 'break-word' }}>
                  {about.split('\n').map((text, key) =>
                    (<span key={key}>
                      {text}
                      <br />
                    </span>)
                  )}
                </div>
              </div>
            }

            {links && !!links.length &&
              <div style={{ paddingBottom: '15px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>
                  Links
                </div>
                {links.map(link =>
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
                      <div>
                        {link.title}
                      </div>
                    </div>
                  </div>)
                )}
              </div>
            }
          </div>
        </div>);
    }
}

ProfileDetails.propTypes = {
    followPending: PropTypes.shape(),
    followProfile: PropTypes.func,
    isFollower: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    profileData: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
    sendTip: PropTypes.func,
    unfollowProfile: PropTypes.func,
};

export default ProfileDetails;
