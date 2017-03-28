import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { tempProfileUpdate } from '../local-flux/actions/temp-profile-actions';

class NewProfileContainer extends Component {
    render() {
        return (
            <div>New Profile</div>
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
)(NewProfileContainer);

export { NewProfileContainer };
