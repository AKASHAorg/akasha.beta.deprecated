import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import Waypoint from 'react-waypoint';
import { selectPendingProfiles } from '../local-flux/selectors';
import { profileMessages } from '../locale-data/messages';
import { DataLoader, ProfileCard } from './index';

class ProfileList extends Component {
    render () {
        const { fetchingProfiles, fetchingMoreProfiles, intl, moreProfiles, pendingProfiles,
            placeholderMessage, profiles, style } = this.props;
        const profileRows = profiles && profiles.map((profile) => {
            if (!profile.ethAddress) {
                console.error('invalid profile');
                return null;
            }
            const isPending = pendingProfiles && pendingProfiles.get(profile.ethAddress);

            return (
              <ProfileCard
                isPending={isPending}
                key={profile.ethAddress}
                profile={profile}
              />
            );
        });

        return (
          <div
            className="profile-list"
            style={Object.assign({}, style)}
            ref={this.getContainerRef}
          >
            <DataLoader
              flag={fetchingProfiles}
              style={{ paddingTop: '80px' }}
            >
              <div className="profile-list__inner">
                {profiles.size === 0 &&
                  <div className="flex-center profile-list__placeholder">
                    {placeholderMessage || intl.formatMessage(profileMessages.noProfiles)}
                  </div>
                }
                {profileRows}
                {moreProfiles &&
                  <div style={{ height: '35px' }}>
                    <DataLoader flag={fetchingMoreProfiles} size="small">
                      <div className="flex-center">
                          <Waypoint onEnter={this.props.fetchMoreProfiles}/>
                      </div>
                    </DataLoader>
                  </div>
                }
              </div>
            </DataLoader>
          </div>
        );
    }
}

ProfileList.propTypes = {
    fetchingProfiles: PropTypes.bool,
    fetchingMoreProfiles: PropTypes.bool,
    fetchMoreProfiles: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    moreProfiles: PropTypes.bool,
    pendingProfiles: PropTypes.shape(),
    placeholderMessage: PropTypes.string,
    profiles: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
};

function mapStateToProps (state, ownProps) {
    const { context } = ownProps;
    return {
        pendingProfiles: selectPendingProfiles(state, context),
    };
}

export default connect(mapStateToProps)(withRouter(injectIntl(ProfileList)));
