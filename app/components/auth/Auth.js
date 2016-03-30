//noinspection JSUnresolvedVariable
import React, { Component, PropTypes } from 'react'
import LoginHeader from '../../components/ui/partials/LoginHeader'

class Auth extends Component {

  render() {
    const { style, authState } = this.props;
    return (
      <div style={style}>
        <div className="start-xs">
          <div
            className="col-xs"
            style={{ flex: 1, padding: 0 }}
          >
            <LoginHeader />
            <div>{'Foking login m8'}</div>
          </div>
        </div>
      </div>
    )
  }
}

Auth.propTypes = {
  actions: PropTypes.object.isRequired,
  authState: PropTypes.object.isRequired,
  style: PropTypes.object
};

Auth.contextTypes = {
  muiTheme: React.PropTypes.object
};

Auth.defaultProps = {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }
};

export default Auth;


