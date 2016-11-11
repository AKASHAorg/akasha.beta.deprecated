import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class PeopleContainer extends Component {

    navigate = () => {
        const basePath = this.props.loggedProfileData.get('akashaId');
        this.context.router.push(`/${basePath}/profile/0xc06e2c18565d356b2e85e02eef1d2c26854bb976`);
    }

    render () {
        const { params } = this.props;
        if (params.profileAddress) {
            return this.props.children;
        }

        return <div>
          <div>
            People Container
            <button onClick={this.navigate}>Navigate</button>
          </div>
        </div>;
    }
}

PeopleContainer.propTypes = {
    loggedProfileData: PropTypes.shape(),
    params: PropTypes.shape(),
    children: PropTypes.element
};

PeopleContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    return {
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        ...ownProps
    };
}

export default connect(mapStateToProps)(PeopleContainer);
