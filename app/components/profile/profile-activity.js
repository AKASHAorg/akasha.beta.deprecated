import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { profileMessages } from '../../locale-data/messages';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { profileFollowersIterator, profileFollowingsIterator, profileMoreFollowersIterator,
    profileMoreFollowingsIterator } from '../../local-flux/actions/profile-actions';
import { ACTIVITY } from '../../constants/context-types';
import { selectFetchingFollowers, selectFetchingFollowings, selectFetchingMoreFollowers,
    selectFetchingMoreFollowings, selectFollowers, selectFollowings, selectMoreFollowers,
    selectMoreFollowings, selectProfileEntries } from '../../local-flux/selectors';
import { EntryList, ProfileList } from '../';

class ProfileActivity extends Component {
    componentDidMount () {
        const { akashaId } = this.props;
        this.props.entryProfileIterator(null, akashaId);
        this.props.profileFollowersIterator(akashaId);
        this.props.profileFollowingsIterator(akashaId);
    }

    componentWillReceiveProps (nextProps) {
        const { akashaId } = this.props;
        if (akashaId !== nextProps.akashaId) {
            this.props.entryProfileIterator(null, nextProps.akashaId);
        }
    }

    fetchMoreFollowers = () => {
        const { akashaId } = this.props;
        this.props.profileMoreFollowersIterator(akashaId);
    };

    fetchMoreFollowings = () => {
        const { akashaId } = this.props;
        this.props.profileMoreFollowingsIterator(akashaId);
    };

    fetchMoreProfileEntries = () => {
        const { akashaId } = this.props;
        this.props.entryMoreProfileIterator(null, akashaId);
    }

    render () {
        const { fetchingFollowers, fetchingFollowings, fetchingMoreFollowers, fetchingMoreFollowings,
            fetchingProfileEntries, followers, followings, intl, moreProfileEntries,
            fetchingMoreProfileEntries, moreFollowers, moreFollowings, profileEntries,
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
                fetchingEntries={fetchingProfileEntries}
                fetchingMoreEntries={fetchingMoreProfileEntries}
                fetchMoreEntries={this.fetchMoreProfileEntries}
                moreEntries={moreProfileEntries}
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
    akashaId: PropTypes.string,
    entryMoreProfileIterator: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    fetchingFollowers: PropTypes.bool,
    fetchingFollowings: PropTypes.bool,
    fetchingMoreFollowers: PropTypes.bool,
    fetchingMoreFollowings: PropTypes.bool,
    fetchingMoreProfileEntries: PropTypes.bool,
    fetchingProfileEntries: PropTypes.bool,
    followers: PropTypes.shape(),
    followings: PropTypes.shape(),
    intl: PropTypes.shape(),
    moreFollowers: PropTypes.bool,
    moreFollowings: PropTypes.bool,
    moreProfileEntries: PropTypes.bool,
    profileEntries: PropTypes.shape(),
    profileFollowersIterator: PropTypes.func.isRequired,
    profileFollowingsIterator: PropTypes.func.isRequired,
    profileMoreFollowersIterator: PropTypes.func.isRequired,
    profileMoreFollowingsIterator: PropTypes.func.isRequired,
    profiles: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const akashaId = ownProps.akashaId;
    return {
        fetchingFollowers: selectFetchingFollowers(state, akashaId),
        fetchingFollowings: selectFetchingFollowings(state, akashaId),
        fetchingMoreFollowers: selectFetchingMoreFollowers(state, akashaId),
        fetchingMoreFollowings: selectFetchingMoreFollowings(state, akashaId),
        fetchingMoreProfileEntries: state.entryState.getIn(['flags', 'fetchingMoreProfileEntries']),
        fetchingProfileEntries: state.entryState.getIn(['flags', 'fetchingProfileEntries']),
        followers: selectFollowers(state, akashaId),
        followings: selectFollowings(state, akashaId),
        moreFollowers: selectMoreFollowers(state, akashaId),
        moreFollowings: selectMoreFollowings(state, akashaId),
        profileEntries: selectProfileEntries(state, akashaId),
        profiles: state.profileState.get('byEthAddress'),
        moreProfileEntries: state.entryState.get('moreProfileEntries'),
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
