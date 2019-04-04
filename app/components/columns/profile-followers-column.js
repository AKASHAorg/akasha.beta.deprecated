import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Waypoint from 'react-waypoint';
import { ColumnHeader, ProfileList } from '../';
import { profileMessages } from '../../locale-data/messages';
import { profileFollowersIterator,
    profileMoreFollowersIterator } from '../../local-flux/actions/profile-actions';
import { profileSelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';

class ProfileFollowersColumn extends Component {
    firstCallDone = false;
    firstLoad = () => {
        if (!this.firstCallDone) {
            this.followersIterator();
            this.firstCallDone = true;
        }
    }

    componentWillReceiveProps (nextProps) {
        const { ethAddress } = nextProps;
        if (this.props.ethAddress !== ethAddress) {
            this.followersIterator(ethAddress);
        }
    }

    followersIterator = (ethAddress) => {
        if (!ethAddress) {
            ethAddress = this.props.ethAddress;
        }
        this.props.dispatchAction(profileFollowersIterator({ context: 'profilePageFollowers', ethAddress }));
    };

    render () {
        const { fetchingFollowers, fetchingMoreFollowers, followers, intl, moreFollowers } = this.props;

        return (
          <div className="column">
            <ColumnHeader
              onRefresh={this.followersIterator}
              noMenu
              readOnly
              title={intl.formatMessage(profileMessages.followers)}
            />
            <Waypoint onEnter={this.firstLoad} horizontal />
            <ProfileList
              context="profilePageFollowers"
              fetchingProfiles={fetchingFollowers}
              fetchingMoreProfiles={fetchingMoreFollowers}
              fetchMoreProfiles={this.followersIterator}
              moreProfiles={moreFollowers}
              profiles={followers}
            />
          </div>
        );
    }
}

ProfileFollowersColumn.propTypes = {
    ethAddress: PropTypes.string.isRequired,
    fetchingFollowers: PropTypes.bool,
    fetchingMoreFollowers: PropTypes.bool,
    followers: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    moreFollowers: PropTypes.bool,
    profileFollowersIterator: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps;
    return {
        fetchingFollowers: profileSelectors.getFetchingFollowers(state, ethAddress),
        fetchingMoreFollowers: profileSelectors.getFetchingMoreFollowers(state, ethAddress),
        followers: profileSelectors.selectFollowers(state, ethAddress),
        moreFollowers: profileSelectors.selectMoreFollowers(state, ethAddress),
    };
}

export default connect(
    mapStateToProps,
    {
        // profileFollowersIterator,
    }
)(injectIntl(withRequest(ProfileFollowersColumn)));
