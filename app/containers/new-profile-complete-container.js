import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { tempProfileUpdate } from '../local-flux/actions/temp-profile-actions';

class NewProfileCompleteContainer extends Component {
    render () {
        return (
          <div>New Profile Complete</div>
        );
    }
}

function mapStateToProps (state) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile')
    }
}

export default connect(
    mapStateToProps,
    {
        tempProfileUpdate
    }
)(NewProfileCompleteContainer);

export { NewProfileCompleteContainer };
