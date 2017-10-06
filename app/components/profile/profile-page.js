import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { profileGetData } from '../../local-flux/actions/profile-actions';
import { selectProfile } from '../../local-flux/selectors';
import { DataLoader, ProfileActivity, ProfileDetails } from '../';

class ProfilePage extends Component {
    componentDidMount () {
        const akashaId = this.props.match.params.akashaId;
        this.props.profileGetData(akashaId, true);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.match.params.akashaId !== this.props.match.params.akashaId) {
            this.props.profileGetData(nextProps.match.params.akashaId, true);
        }
    }

    render () {
        const { match, profileData } = this.props;
        return (
          <DataLoader
            flag={!profileData}
            timeout={300}
            size="large"
            style={{ paddingTop: '120px' }}
          >
            <div className="profile-page">
              <ProfileDetails
                akashaId={match.params.akashaId}
              />
              <ProfileActivity
                akashaId={match.params.akashaId}
              />
            </div>
          </DataLoader>
        );
    }
}

ProfilePage.propTypes = {
    profileData: PropTypes.shape(),
    profileGetData: PropTypes.func,
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
    }
)(ProfilePage);
