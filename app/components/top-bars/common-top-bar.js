import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { selectBalance, selectLoggedProfileData } from '../../local-flux/selectors';
import { Breadcrumbs, TopBarRightSide } from '../';

const CommonTopBar = props => (
  <div style={{ display: 'flex', height: '32px', fontSize: '16px' }}>
    <Breadcrumbs />
  </div>
);

CommonTopBar.propTypes = {
    balance: PropTypes.string,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: selectLoggedProfileData(state),
    };
}

export default connect(mapStateToProps)(CommonTopBar);
