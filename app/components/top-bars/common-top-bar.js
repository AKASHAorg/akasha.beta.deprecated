import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { selectBalance, selectLoggedProfileData } from '../../local-flux/selectors';
import { Navigation, TopBarRightSide } from '../';

const CommonTopBar = props => (
  <div style={{ display: 'flex', height: '32px', fontSize: '16px' }}>
    <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-start' }}>
      <Navigation />
    </div>
    <TopBarRightSide
      balance={props.balance}
      onPanelNavigate={props.onPanelNavigate}
      loggedProfileData={props.loggedProfileData}
      loggedProfile={props.loggedProfile}
      canEditProfile={!!props.loggedProfile.get('akashaId')}
    />
  </div>
);

CommonTopBar.propTypes = {
    balance: PropTypes.string,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    onPanelNavigate: PropTypes.func
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: selectLoggedProfileData(state),
    };
}

export default connect(mapStateToProps)(CommonTopBar);
