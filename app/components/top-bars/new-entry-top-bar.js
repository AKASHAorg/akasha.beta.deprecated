import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
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
  </div>
);

NewEntryTopBar.propTypes = {
    secondarySidebarToggle: PropTypes.func,
    showSecondarySidebar: PropTypes.bool,
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
