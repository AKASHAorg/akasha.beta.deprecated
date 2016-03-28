
import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from '../ui/svg';

import * as Colors from 'material-ui/lib/styles/colors';
import SvgIcon from 'material-ui/lib/svg-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Checkbox from 'material-ui/lib/checkbox';

class CreateProfile extends Component {

  componentDidMount () {
    this.firstNameInput.focus();
  }

  handleUpdateName = () => {
    const { actions } = this.props;
    const name1 = this.firstNameInput.getValue();
    const name2 = this.refs.lastName.getValue();
    if (!name1 || !name2) {
      return;
    }
    actions.updateName(`${name1} ${name2}`);
  }

  handleUpdateUser = (event) => {
    const { actions } = this.props;
    const target      = event.target;
    if (!target.value) {
      return;
    }
    actions.updateUser(target.value);
  }

  handleUpdatePasswd = () => {
    const { actions } = this.props;
    const passwd1 = this.refs.passwd1.getValue();
    const passwd2 = this.refs.passwd2.getValue();
    if (!passwd1 || !passwd2) {
      return;
    }
    if (passwd1 !== passwd2) {
      console.warn('PASSWORD MISSMATCH');
      return;
    }
    actions.updatePasswd(passwd1);
  }

  handleSubmit = (event) => {
    const { actions } = this.props;
  }

  render () {
    const { style } = this.props;

    const buttonsStyle     = { padding: 0, position: 'absolute', bottom: 0, right: 0 };
    const errorStyle       = { color: Colors.minBlack };
    const floatingLblStyle = { color: Colors.lightBlack };
    const inputStyle       = { color: Colors.darkBlack };

    return (
      <div style={style}>
        <div className="start-xs">
          <div className="col-xs" style={{ flex: 1, padding: 0 }}>
            <SvgIcon
                color={Colors.lightBlack}
                viewBox="0 0 32 32"
                style={{ width: '32px', height: '32px', marginRight: '10px', verticalAlign: 'middle' }}
              >
              <MenuAkashaLogo />
            </SvgIcon>
            <h1 style={{ fontWeight: '400', display: 'inline', verticalAlign: 'middle' }}>
              {'Create new identity'}
            </h1>

            <TextField
                errorStyle={errorStyle}
                floatingLabelStyle={floatingLblStyle}
                floatingLabelText="First Name *"
                inputStyle={inputStyle}
                style={{width: '210px'}}
                ref={(c) => this.firstNameInput = c}
                onBlur={this.handleUpdateName}
            />
            <TextField
                errorStyle={errorStyle}
                floatingLabelStyle={floatingLblStyle}
                floatingLabelText="Last Name"
                inputStyle={inputStyle}
                style={{width: '210px', marginLeft: '20px'}}
                ref="lastName"
                onBlur={this.handleUpdateName}
            />
            <TextField
                fullWidth={true}
                errorStyle={errorStyle}
                floatingLabelStyle={floatingLblStyle}
                floatingLabelText="User Name *"
                inputStyle={inputStyle}
                onBlur={this.handleUpdateUser}
            />
            <TextField type="password"
                fullWidth={true}
                errorStyle={errorStyle}
                floatingLabelStyle={floatingLblStyle}
                floatingLabelText="Password *"
                inputStyle={inputStyle}
                ref="passwd1"
                onBlur={this.handleUpdatePasswd}
            />
            <TextField type="password"
                fullWidth={true}
                errorStyle={errorStyle}
                floatingLabelStyle={floatingLblStyle}
                floatingLabelText="Verify Password *"
                inputStyle={inputStyle}
                ref="passwd2"
                onBlur={this.handleUpdatePasswd}
            />
            <Checkbox
                label="Optional details"
                style={{marginTop: '18px', marginLeft: '-4px'}}
            />
            <div style={{marginTop: '20px'}}>
              <small>
                {'By proceeding to create your account and use AKASHA, you are agreeing to our' +
                 'Terms of Service and Privacy Policy. If you do not agree, you cannot use AKASHA.'}
              </small>
              </div>
          </div>
        </div>
        <div className="end-xs" style={{ flex: 1 }}>
          <div className="col-xs" style={buttonsStyle}>
            <RaisedButton label="Cancel"
            />
            <RaisedButton label="Submit"
                primary={true}
                style={{marginLeft: '12px'}}
                onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  actions:   PropTypes.object.isRequired,
  style:     PropTypes.object
};

CreateProfile.contextTypes = {
  muiTheme: React.PropTypes.object
};

CreateProfile.defaultProps = {
  style: {
    width:         '100%',
    height:        '100%',
    display:       'flex',
    flexDirection: 'column',
    position:      'relative'
  }
};
export default CreateProfile;
