import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dashboardResetProfileColumns } from '../../local-flux/actions/dashboard-actions';
import { profileGetData, profileResetColumns } from '../../local-flux/actions/profile-actions';
import { profileSelectors } from '../../local-flux/selectors';
import { DataLoader, ProfileActivity, ProfileDetails } from '../';
import withRequest from '../high-order-components/with-request';

class ProfilePage extends Component {
    componentDidMount () {
        const { akashaId, ethAddress } = this.props.match.params;
        if (akashaId) {
            this.props.dispatchAction(profileGetData({ akashaId, full: true }));
        }
        if (ethAddress) {
            this.props.dispatchAction(profileGetData({ ethAddress: `0x${ethAddress}`, full: true }));
        }
    }

    componentWillReceiveProps (nextProps) {
        const { akashaId, ethAddress } = nextProps.match.params;
        if (akashaId && akashaId !== this.props.match.params.akashaId) {
            this.props.dispatchAction(profileGetData({ akashaId, full: true }));
        }
        if (ethAddress && ethAddress !== this.props.match.params.ethAddress) {
            this.props.dispatchAction(profileGetData({ ethAddress: `0x${ethAddress}`, full: true }));
        }
    }

    componentWillUnmount () {
        const { ethAddress } = this.props.match.params;
        this.props.profileResetColumns(`0x${ethAddress}`);
        this.props.dashboardResetProfileColumns();
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
    dashboardResetProfileColumns: PropTypes.func.isRequired,
    profileData: PropTypes.shape(),
    profileGetData: PropTypes.func.isRequired,
    profileResetColumns: PropTypes.func.isRequired,
    match: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps.match.params;
    const prefixed = `0x${ethAddress}`;
    return {
        profileData: profileSelectors.selectProfileByEthAddress(state, prefixed),
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardResetProfileColumns,
        // profileGetData,
        profileResetColumns,
    }
)(withRequest(ProfilePage));
