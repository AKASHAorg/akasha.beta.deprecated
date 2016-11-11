import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { ProfileActions } from 'local-flux';

export default function requireAuthentication (Component) {
    class ProtectedComponent extends React.Component {
        static propTypes = {
            profileActions: React.PropTypes.shape(),
            isAuth: React.PropTypes.bool
        }
        componentWillMount () {
            this.props.profileActions.checkLoggedProfile((err, isAuth) => {
                if (!isAuth) {
                    hashHistory.push('/authenticate');
                }
            });
        }
        render () {
            return this.props.isAuth ? <Component {...this.props} /> : null;
        }
    }
    const mapStateToProps = state => ({
        akashaId: state.profileState.getIn(['loggedProfile', 'akashaId']),
        isAuth: (state.profileState.get('loggedProfile').size > 0)
    });
    const mapDispatchToProps = dispatch => ({
        profileActions: new ProfileActions(dispatch)
    });
    return connect(mapStateToProps, mapDispatchToProps)(ProtectedComponent);
}


