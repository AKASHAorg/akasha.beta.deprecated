import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CreateProfile from '../components/create-profile';
import { tempProfileCreate, tempProfileDelete } from '../local-flux/actions/temp-profile-actions';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile'),
    };
}

class CreateProfileContainer extends Component {
    render() {
        return (
            <div>
                Create profile container
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    {
        tempProfileCreate,
        tempProfileDelete
    }
)(CreateProfileContainer);
