import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton, SvgIcon } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import { dashboardAddNewColumn } from '../../local-flux/actions/dashboard-actions';
import { selectBalance, selectLoggedProfileData } from '../../local-flux/selectors';
import { Navigation, TopBarRightSide } from '../';

const DashboardTopBar = props => (
  <div style={{ display: 'flex', height: '32px', fontSize: '16px' }}>
    <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-start' }}>
      <Navigation />
      <IconButton
        iconStyle={{ width: '24px', height: '24px' }}
        onClick={props.dashboardAddNewColumn}
        style={{ width: '32px', height: '32px', padding: '0px', margin: '0 10px' }}
      >
        <SvgIcon viewBox="0 0 18 18">
          <AddIcon />
        </SvgIcon>
      </IconButton>
    </div>
    <TopBarRightSide
      balance={props.balance}
      history={props.history}
      onPanelNavigate={props.onPanelNavigate}
      location={props.location}
      canEditProfile={!!props.loggedProfile.get('akashaId')}
      loggedProfileData={props.loggedProfileData}
    />
  </div>
);

DashboardTopBar.propTypes = {
    balance: PropTypes.string,
    dashboardAddNewColumn: PropTypes.func.isRequired,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    onPanelNavigate: PropTypes.func,
    history: PropTypes.shape(),
    location: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedProfileData: selectLoggedProfileData(state),
        loggedProfile: state.profileState.get('loggedProfile'),
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAddNewColumn
    }
)(DashboardTopBar);
