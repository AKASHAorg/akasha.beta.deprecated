import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { profileGetData, profileIsFollower } from '../local-flux/actions/profile-actions';
import { entryProfileIterator, entryMoreProfileIterator } from '../local-flux/actions/entry-actions';
import { DataLoader, ProfileActivity, ProfileDetails } from '../components';
import { selectProfile } from '../local-flux/selectors';

class ProfileContainer extends Component {
    componentDidMount () {
        const akashaId = this.props.match.params.akashaId;
        this.props.profileGetData(akashaId, true);
        this.props.profileIsFollower([akashaId]);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.match.params.akashaId !== this.props.match.params.akashaId) {
            this.props.profileGetData(nextProps.match.params.akashaId, true);
            this.props.profileIsFollower([nextProps.match.params.akashaId]);
        }
    }

    render () {
        const { match, profileData } = this.props;
        return (<DataLoader
          flag={!profileData}
          timeout={300}
          size={80}
          style={{ paddingTop: '120px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
            <ProfileDetails
              akashaId={match.params.akashaId}
            />
            <ProfileActivity
              akashaId={match.params.akashaId}
              firstName={profileData.firstName}
            />
          </div>
        </DataLoader>);
    }
}

ProfileContainer.propTypes = {
    profileData: PropTypes.shape(),
    profileGetData: PropTypes.func,
    profileIsFollower: PropTypes.func,
    match: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const akashaId = ownProps.match.params.akashaId;
    return {
        profileData: selectProfile(state, akashaId),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator,
        profileGetData,
        profileIsFollower
    }
)(ProfileContainer);
