import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import throttle from 'lodash.throttle';
import { selectPendingProfiles } from '../local-flux/selectors';
import { profileMessages } from '../locale-data/messages';
import { isInViewport } from '../utils/domUtils';
import { DataLoader, ProfileCard } from './';

class ProfileList extends Component {
    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', this.throttledHandler);
        }
        window.addEventListener('resize', this.throttledHandler);
    }

    componentDidUpdate (prevProps) {
        if (prevProps.fetchingProfiles && !this.props.fetchingProfiles) {
            this.checkTrigger();
        }
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
    context: PropTypes.string,
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
