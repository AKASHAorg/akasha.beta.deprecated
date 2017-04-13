import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { profileLogout } from '../local-flux/actions/profile-actions';

class HomeContainer extends Component {
    render() {
        return (
            <div>Home container..<button onClick={this.props.profileLogout}>Logout</button></div>
        )
    }
};

export default connect(
    null,
    {
        profileLogout
    }
)(HomeContainer);