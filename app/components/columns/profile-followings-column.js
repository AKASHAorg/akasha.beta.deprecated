import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Waypoint from 'react-waypoint';
import { ColumnHeader, ProfileList } from '../';
import { profileMessages } from '../../locale-data/messages';
import { profileFollowingsIterator,
    profileMoreFollowingsIterator } from '../../local-flux/actions/profile-actions';
import { profileSelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';

class ProfileFollowingsColumn extends Component {
    firstCallDone = false;
    firstLoad = () => {
        if (!this.firstCallDone) {
            this.followingsIterator();
            this.firstCallDone = true;
        }
    }

    componentWillReceiveProps (nextProps) {
        const { ethAddress } = nextProps;
        if (this.props.ethAddress !== ethAddress) {
            this.followingsIterator(ethAddress);
        }
    }

    followingsIterator = (ethAddress) => {
        if (!ethAddress) {
            ethAddress = this.props.ethAddress;
        }
        this.props.dispatchAction(profileFollowingsIterator({ context: 'profilePageFollowings', ethAddress }));
    };

    render () {
        const { fetchingFollowings, fetchingMoreFollowings, followings, intl, moreFollowings } = this.props;

        return (
          <div className="column">
            <ColumnHeader
              onRefresh={this.followingsIterator}
              noMenu
              readOnly
              title={intl.formatMessage(profileMessages.followings)}
            />
            <Waypoint onEnter={this.firstLoad} horizontal />
            <ProfileList
              context="profilePageFollowings"
              fetchingProfiles={fetchingFollowings}
              fetchingMoreProfiles={fetchingMoreFollowings}
              fetchMoreProfiles={this.followingsIterator}
              moreProfiles={moreFollowings}
              profiles={followings}
            />
          </div>
        );
    }
}

ProfileFollowingsColumn.propTypes = {
    ethAddress: PropTypes.string.isRequired,
    fetchingFollowings: PropTypes.bool,
    fetchingMoreFollowings: PropTypes.bool,
    followings: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    moreFollowings: PropTypes.bool,
    profileFollowingsIterator: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps;
    return {
        fetchingFollowings: profileSelectors.getFetchingFollowings(state, ethAddress),
        fetchingMoreFollowings: profileSelectors.getFetchingMoreFollowings(state, ethAddress),
        followings: profileSelectors.selectFollowings(state, ethAddress),
        moreFollowings: profileSelectors.selectMoreFollowings(state, ethAddress),
    };
}

export default connect(
    mapStateToProps,
    {
        // profileFollowingsIterator,
    }
)(injectIntl(withRequest(ProfileFollowingsColumn)));
