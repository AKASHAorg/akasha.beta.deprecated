
import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from '../ui/svg';

import * as Colors from 'material-ui/lib/styles/colors';
import SvgIcon from 'material-ui/lib/svg-icon';

class CreateProfileStatus extends Component {

  componentDidMount() {
    if (this.firstNameInput) {
      this.firstNameInput.focus();
    }
  }

  render() {
    const { style, profile } = this.props;
    const paraStyle = { marginTop: '20px' };

    return (
      <div style={style}>
        <div className="row start-xs">
          <div className="col-xs">

            <SvgIcon
              color={Colors.lightBlack}
              viewBox="0 0 32 32"
              style={{ width: '32px', height: '32px', marginRight: '10px', verticalAlign: 'middle' }}
            >
              <MenuAkashaLogo />
            </SvgIcon>
            <h1 style={{ fontWeight: '400', display: 'inline', verticalAlign: 'middle' }}>
              {'Registering identity...'}
            </h1>
            <p style={paraStyle}>
              {'Your identity is broadcasted into the Ethereum world computer network.'}
            </p>
            <p style={paraStyle}>
              {'This will take a few moments ...'}
            </p>
            <span style={{ marginTop: '20px', fontSize: '13px' }}>
              { profile.getIn(['create', 'steps']).map((step) => <p>{step}</p>) }
            </span>
            <p style={{ marginTop: '20px', color: Colors.red300 }}>
              { profile.getIn(['create', 'err']) }
            </p>
          </div>

        </div>
      </div>
    );
  }
}

CreateProfileStatus.propTypes = {
  actions: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  style: PropTypes.object
};

CreateProfileStatus.contextTypes = {
  muiTheme: React.PropTypes.object
};

CreateProfileStatus.defaultProps = {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }
};

export default CreateProfileStatus;
