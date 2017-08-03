import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { TopBarRightSide } from '../';
import { selectBalance, selectLoggedProfileData } from '../../local-flux/selectors';
import { secondarySidebarToggle } from '../../local-flux/actions/app-actions';

const NewEntryTopBar = props => (
  <div style={{ display: 'flex', height: '32px', fontSize: '16px' }}>
    <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-start' }}>
      <Button
        icon={props.showSecondarySidebar ? 'double-left' : 'double-right'}
        onClick={props.secondarySidebarToggle}
      />
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

NewEntryTopBar.propTypes = {
    balance: PropTypes.string,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    onPanelNavigate: PropTypes.func,
    secondarySidebarToggle: PropTypes.func,
    history: PropTypes.shape(),
    location: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedProfileData: selectLoggedProfileData(state),
        loggedProfile: state.profileState.get('loggedProfile'),
        showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    };
}

export default connect(
    mapStateToProps,
    {
        secondarySidebarToggle
    }
)(NewEntryTopBar);
