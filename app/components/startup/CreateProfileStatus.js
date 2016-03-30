
import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from '../ui/svg';

import * as Colors from 'material-ui/lib/styles/colors';
import SvgIcon from 'material-ui/lib/svg-icon';
import TextField from 'material-ui/lib/text-field';

class CreateProfileStatus extends Component {

  componentDidMount () {
    if (this.firstNameInput) {
      this.firstNameInput.focus();
    }
  }

  render () {
    const { style, profile } = this.props;
    const floatLabelStyle = { color: Colors.lightBlack };
    const inputStyle      = { color: Colors.darkBlack };

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
            <p style={{ marginTop: '20px' }}>
              {'Your identity is broadcasted into the Ethereum world computer network.'}
            </p>
            <p style={{ marginTop: '20px' }}>
              [ {profile.getIn(['create', 'step'])} ... ]
            </p>
            <p style={{ marginTop: '20px' }}>
              {'This will take a few moments.'}
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
  style:   PropTypes.object
};

CreateProfileStatus.contextTypes = {
  muiTheme: React.PropTypes.object
};

CreateProfileStatus.defaultProps = {
  style: {
    width:         '100%',
    height:        '100%',
    display:       'flex',
    flexDirection: 'column',
    position:      'relative'
  }
};

export default CreateProfileStatus;
