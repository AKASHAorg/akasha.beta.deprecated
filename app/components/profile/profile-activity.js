import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { profileMessages } from '../../locale-data/messages';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { profileFollowersIterator, profileFollowingsIterator, profileMoreFollowersIterator,
    profileMoreFollowingsIterator } from '../../local-flux/actions/profile-actions';
import { ACTIVITY } from '../../constants/context-types';
import { selectBlockNumber, selectFetchingFollowers, selectFetchingFollowings, selectFetchingMoreFollowers,
    selectFetchingMoreFollowings, selectFollowers, selectFollowings, selectMoreFollowers,
    selectMoreFollowings, selectProfileEntries, selectProfileEntriesFlags } from '../../local-flux/selectors';
import { EntryList, ProfileList } from '../';

class ProfileActivity extends Component {
    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.entryProfileIterator({ columnId: 'profileEntries', value: ethAddress });
        this.props.profileFollowersIterator(ethAddress);
        this.props.profileFollowingsIterator(ethAddress);
    }

    componentWillReceiveProps (nextProps) {
        const { ethAddress } = this.props;
        if (ethAddress !== nextProps.ethAddress) {
            this.props.entryProfileIterator(null, nextProps.ethAddress);
        }
    }

    fetchMoreFollowers = () => {
        const { ethAddress } = this.props;
        this.props.profileMoreFollowersIterator(ethAddress);
    };

    fetchMoreFollowings = () => {
        const { ethAddress } = this.props;
        this.props.profileMoreFollowingsIterator(ethAddress);
    };

    fetchMoreProfileEntries = () => {
        const { ethAddress } = this.props;
        this.props.entryMoreProfileIterator({ columnId: null, value: ethAddress });
    }

    render () {
        const { fetchingFollowers, fetchingFollowings, fetchingMoreFollowers, fetchingMoreFollowings,
            fetchingEntries, followers, followings, intl, moreEntries,
            fetchingMoreEntries, moreFollowers, moreFollowings, profileEntries,
            profiles } = this.props;

        return (
          <div className="profile-activity">
            <div className="flex-center-y profile-activity__column">
              <div className="profile-activity__column-header">
                <div className="profile-activity__column-title">
                  {intl.formatMessage(profileMessages.entries)}
                </div>
              </div>
              <EntryList
                style={{ height: '100%', flexFlow: 'row wrap' }}
                cardStyle={{ width: '340px' }}
                contextId={ACTIVITY}
                entries={profileEntries}
                fetchingEntries={fetchingEntries}
                fetchingMoreEntries={fetchingMoreEntries}
                fetchMoreEntries={this.fetchMoreProfileEntries}
                moreEntries={moreEntries}
                profiles={profiles}
              />
            </div>
            <div className="flex-center-y profile-activity__column">
              <div className="profile-activity__column-header">
                <div className="profile-activity__column-title">
                  {intl.formatMessage(profileMessages.followers)}
                </div>
              </div>
              <ProfileList
                profiles={followers}
                fetchingProfiles={fetchingFollowers}
                fetchingMoreProfiles={fetchingMoreFollowers}
                fetchMoreProfiles={this.fetchMoreFollowers}
                moreProfiles={moreFollowers}
              />
            </div>
            <div className="flex-center-y profile-activity__column">
              <div className="profile-activity__column-header">
                <div className="profile-activity__column-title">
                  {intl.formatMessage(profileMessages.followings)}
                </div>
              </div>
              <ProfileList
                profiles={followings}
                fetchingProfiles={fetchingFollowings}
                fetchingMoreProfiles={fetchingMoreFollowings}
                fetchMoreProfiles={this.fetchMoreFollowings}
                moreProfiles={moreFollowings}
              />
            </div>
          </div>
        );
    }
}

ProfileActivity.propTypes = {
    ethAddress: PropTypes.string,
    entryMoreProfileIterator: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    fetchingEntries: PropTypes.bool,
    fetchingFollowers: PropTypes.bool,
    fetchingFollowings: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    fetchingMoreFollowers: PropTypes.bool,
    fetchingMoreFollowings: PropTypes.bool,
    followers: PropTypes.shape(),
    followings: PropTypes.shape(),
    intl: PropTypes.shape(),
    moreEntries: PropTypes.bool,
    moreFollowers: PropTypes.bool,
    moreFollowings: PropTypes.bool,
    profileEntries: PropTypes.shape(),
    profileFollowersIterator: PropTypes.func.isRequired,
    profileFollowingsIterator: PropTypes.func.isRequired,
    profileMoreFollowersIterator: PropTypes.func.isRequired,
    profileMoreFollowingsIterator: PropTypes.func.isRequired,
    profiles: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const ethAddress = ownProps.ethAddress;
    const { fetchingEntries, fetchingMoreEntries, moreEntries } =
        selectProfileEntriesFlags(state, ethAddress);
    return {
        blockNr: selectBlockNumber(state),
        fetchingEntries,
        fetchingFollowers: selectFetchingFollowers(state, ethAddress),
        fetchingFollowings: selectFetchingFollowings(state, ethAddress),
        fetchingMoreEntries,
        fetchingMoreFollowers: selectFetchingMoreFollowers(state, ethAddress),
        fetchingMoreFollowings: selectFetchingMoreFollowings(state, ethAddress),
        followers: selectFollowers(state, ethAddress),
        followings: selectFollowings(state, ethAddress),
        moreEntries,
        moreFollowers: selectMoreFollowers(state, ethAddress),
        moreFollowings: selectMoreFollowings(state, ethAddress),
        profileEntries: selectProfileEntries(state, ethAddress),
        profiles: state.profileState.get('byEthAddress'),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator,
        profileFollowersIterator,
        profileFollowingsIterator,
        profileMoreFollowersIterator,
        profileMoreFollowingsIterator
    }
)(injectIntl(ProfileActivity));
