import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { profileGetByAddress, profileGetData } from '../../local-flux/actions/profile-actions';
import { selectProfile } from '../../local-flux/selectors';
import { DataLoader, ProfileActivity, ProfileDetails } from '../';

class ProfilePage extends Component {
    componentDidMount () {
        const { akashaId, ethAddress } = this.props.match.params;
        if (akashaId) {
            this.props.profileGetData(akashaId, true);
        }
        if (ethAddress) {
            this.props.profileGetByAddress(`0x${ethAddress}`);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { akashaId, ethAddress } = nextProps.match.params;
        if (akashaId && akashaId !== this.props.match.params.akashaId) {
            this.props.profileGetData(akashaId, true);
        }
        if (ethAddress && ethAddress !== this.props.match.params.ethAddress) {
            this.props.profileGetByAddress(`0x${ethAddress}`);
        }
    }

    render () {
        const { match, profileData } = this.props;
        const { akashaId, ethAddress } = match;
        return (
          <DataLoader
            flag={!profileData}
            timeout={300}
            size="large"
            style={{ paddingTop: '120px' }}
          >
            <div className="profile-page">
              <ProfileDetails
                akashaId={akashaId}
                ethAddress={ethAddress}
              />
              <ProfileActivity
                akashaId={akashaId}
                ethAddress={ethAddress}
              />
            </div>
          </DataLoader>
        );
    }
}

ProfilePage.propTypes = {
    profileData: PropTypes.shape(),
    profileGetByAddress: PropTypes.func.isRequired,
    profileGetData: PropTypes.func.isRequired,
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
        profileGetByAddress,
        profileGetData,
    }
)(ProfilePage);
