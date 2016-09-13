import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { ProfileActions } from 'local-flux';

export default function requireAuthentication (Component) {
    class ProtectedComponent extends React.Component {
        componentWillMount () {
            this.props.profileActions.checkLoggedProfile().then(() => {
                this.checkAuth();
            });
        }
        checkAuth () {
            const { isAuth } = this.props;
            if (!isAuth) {
                const redirectAfterLogin = this.props.location.pathName;
                hashHistory.push(`/authenticate?r=${redirectAfterLogin}`);
            }
        }
        render () {
            return this.props.isAuth ? <Component {...this.props} /> : null;
        }
    }
    const mapStateToProps = (state) => ({
        userName: state.profileState.getIn(['loggedProfile', 'userName']),
        isAuth: (state.profileState.get('loggedProfile').size > 0)
    });
    const mapDispatchToProps = (dispatch) => ({
        profileActions: new ProfileActions(dispatch)
    });
    return connect(mapStateToProps, mapDispatchToProps)(ProtectedComponent);
}
