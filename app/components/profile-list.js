import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import throttle from 'lodash.throttle';
import { profileMessages } from '../locale-data/messages';
import { isInViewport } from '../utils/domUtils';
import { DataLoader } from './';

class ProfileList extends Component {

    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', this.throttledHandler);
        }
        window.addEventListener('resize', this.throttledHandler);
    }

    componentWillUnmount () {
        if (this.container) {
            this.container.removeEventListener('scroll', this.throttledHandler);
        }
        window.removeEventListener('resize', this.throttledHandler);
    }

    getContainerRef = (el) => { this.container = el; };

    getTriggerRef = (el) => { this.trigger = el; };

    checkTrigger = () => {
        if (this.trigger && isInViewport(this.trigger)) {
            this.props.fetchMoreProfiles();
        }
    };

    throttledHandler = throttle(this.checkTrigger, 500);

    renderProfileRow = profile => (
      <div
        className="flex-center"
        key={profile.ethAddress}
        style={{ backgroundColor: 'white', height: '64px', margin: '12px', width: '300px' }}
      >
        {profile.ethAddress}
      </div>
    );

    render () {
        const { fetchingProfiles, fetchingMoreProfiles, intl,
            moreProfiles, placeholderMessage, profiles, style } = this.props;

        const profileRows = profiles && profiles.map((profile) => {
            if (!profile || !profile.ethAddress) {
                return null;
            }

            return this.renderProfileRow(profile);
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
                  <div className="flex-center-x profile-list__placeholder">
                    {placeholderMessage || intl.formatMessage(profileMessages.noProfiles)}
                  </div>
                }
                {profileRows}
                {moreProfiles &&
                  <div style={{ height: '35px' }}>
                    <DataLoader flag={fetchingMoreProfiles} size="small">
                      <div className="flex-center">
                        <div ref={this.getTriggerRef} style={{ height: 0 }} />
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
    loggedAkashaId: PropTypes.string,
    moreProfiles: PropTypes.bool,
    placeholderMessage: PropTypes.string,
    profiles: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        loggedAkashaId: state.profileState.getIn(['loggedProfile', 'akashaId']),
    };
}

export default connect(mapStateToProps)(withRouter(injectIntl(ProfileList)));
