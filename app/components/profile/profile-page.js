import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { profileGetData } from '../../local-flux/actions/profile-actions';
import { selectProfile } from '../../local-flux/selectors';
import { DataLoader, ProfileActivity, ProfileDetails } from '../';

class ProfilePage extends Component {
    componentDidMount () {
        const { akashaId, ethAddress } = this.props.match.params;
        if (akashaId) {
            this.props.profileGetData({ akashaId, full: true });
        }
        if (ethAddress) {
            this.props.profileGetData({ ethAddress: `0x${ethAddress}`, full: true });
        }
    }

    componentWillReceiveProps (nextProps) {
        const { akashaId, ethAddress } = nextProps.match.params;
        if (akashaId && akashaId !== this.props.match.params.akashaId) {
            this.props.profileGetData({ akashaId, full: true });
        }
        if (ethAddress && ethAddress !== this.props.match.params.ethAddress) {
            this.props.profileGetData({ ethAddress: `0x${ethAddress}`, full: true });
        }
    }

    render () {
        const { match, profileData } = this.props;
        const { akashaId, ethAddress } = match.params;
        const prefixed = `0x${ethAddress}`;

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
                ethAddress={prefixed}
              />
              <ProfileActivity
                akashaId={akashaId}
                ethAddress={prefixed}
              />
            </div>
          </DataLoader>
        );
    }
}

ProfilePage.propTypes = {
    profileData: PropTypes.shape(),
    profileGetData: PropTypes.func.isRequired,
    match: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps.match.params;
    const prefixed = `0x${ethAddress}`;
    return {
        profileData: selectProfile(state, prefixed),
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
