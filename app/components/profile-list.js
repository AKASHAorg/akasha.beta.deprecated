import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import Masonry from 'react-masonry-component';
import { Waypoint } from 'react-waypoint';
import { profileSelectors, searchSelectors } from '../local-flux/selectors';
import { generalMessages, profileMessages } from '../locale-data/messages';
import { DataLoader, ProfileCard } from './index';

class ProfileList extends Component {
    getContainerRef = el => {
        this.container = el;
    };

    // eslint-disable-next-line complexity
    render () {
        const {
            fetchingProfiles,
            fetchingMoreProfiles,
            intl,
            loggedEthAddress,
            masonry,
            moreProfiles,
            pendingProfiles,
            placeholderMessage,
            profiles,
            style,
            searchQuery,
            searching
        } = this.props;
        const profileRows =
            profiles &&
            profiles.map(profile => {
                if (!profile.ethAddress) {
                    return null;
                }
                const isOwnProfile = profile.ethAddress === loggedEthAddress;
                const isPending = pendingProfiles && pendingProfiles.get(profile.ethAddress);
                return (
                    <ProfileCard
                        containerRef={ this.container }
                        isOwnProfile={ isOwnProfile }
                        isPending={ isPending }
                        key={ profile.ethAddress }
                        profile={ profile }
                    />
                );
            });

        return (
            <div className="profile-list" style={ Object.assign({}, style) }
                 ref={ this.getContainerRef }>
                <DataLoader flag={ fetchingProfiles } style={ { paddingTop: '80px' } }>
                    <div className="profile-list__inner">
                        { profiles.size === 0 && searching && (
                            <div className="profile-list__placeholder">
                                <div className="profile-list__placeholder-inner">
                                    <div className="profile-list__placeholder_image"/>
                                    <div className="profile-list__placeholder_text">
                                        { searchQuery.length === 0 &&
                                        intl.formatMessage(generalMessages.startTypingToSearch) }
                                        { searchQuery.length > 0 &&
                                        (placeholderMessage ||
                                            intl.formatMessage(generalMessages.searchingNoResults, {
                                                searchTerm: searchQuery,
                                                resource: intl.formatMessage(profileMessages.profiles)
                                            })) }
                                    </div>
                                </div>
                            </div>
                        ) }
                        { profiles.size === 0 && !searching && (
                            <div className="flex-center profile-list__empty-placeholder">
                                <div className="profile-list__empty-placeholder-inner">
                                    <div className="profile-list__empty-placeholder-image"/>
                                    <div className="profile-list__empty-placeholder-text">
                                        { placeholderMessage || intl.formatMessage(profileMessages.noProfiles) }
                                    </div>
                                </div>
                            </div>
                        ) }
                        { masonry ? (
                            <Masonry
                                options={ { transitionDuration: 0, fitWidth: true } }
                                style={ { margin: '0 auto' } }
                            >
                                { profileRows }
                            </Masonry>
                        ) : (
                            profileRows
                        ) }
                        { moreProfiles && (
                            <div style={ { height: '35px' } }>
                                <DataLoader flag={ fetchingMoreProfiles } size="small">
                                    <div className="flex-center">
                                        <Waypoint onEnter={ this.props.fetchMoreProfiles }/>
                                    </div>
                                </DataLoader>
                            </div>
                        ) }
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
    loggedEthAddress: PropTypes.string.isRequired,
    masonry: PropTypes.bool,
    moreProfiles: PropTypes.bool,
    pendingProfiles: PropTypes.shape(),
    placeholderMessage: PropTypes.string,
    profiles: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    searchQuery: PropTypes.string,
    searching: PropTypes.bool
};

function mapStateToProps (state, ownProps) {
    const { context } = ownProps;
    return {
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        pendingProfiles: profileSelectors.getPendingProfiles(state, context),
        searchQuery: searchSelectors.selectSearchQuery(state)
    };
}

export default connect(mapStateToProps)(withRouter(injectIntl(ProfileList)));
