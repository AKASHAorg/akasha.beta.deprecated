import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from '../ui/svg';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon, RaisedButton, TextField } from 'material-ui';

class CreateProfileComplete extends Component {

  // handleNext = () => {
  //   const { actions } = this.props;
  //   actions.finishSetup();
  // }

  render () {
    const { style, profile } = this.props;
    const akashaLogoStyles = {
      width: '32px',
      height: '32px',
      marginRight: '10px',
      verticalAlign: 'middle'
    };
    const fullName = `${profile.getIn(['name', 'first'])} ${profile.getIn(['name', 'last'])}`;

    return (
      <div style={style} >
        <div className="row start-xs" >
          <div className="col-xs" style={{ flex: 1, padding: 0 }} >
            <SvgIcon
              color={Colors.lightBlack}
              viewBox="0 0 32 32"
              style={ akashaLogoStyles }
            >
              <MenuAkashaLogo />
            </SvgIcon>
            <h1 style={{ fontWeight: '400', display: 'inline', verticalAlign: 'middle' }} >
              {'Identity registered!'}
            </h1>

            <TextField
              disabled
              floatingLabelText="Name"
              style={{ width: '210px' }}
              value={ fullName }
            />
            <TextField
              disabled
              floatingLabelText="Username"
              style={{ width: '210px', marginLeft: '20px' }}
              value={ profile.getIn(['user', 'value']) }
            />
            <TextField
              disabled
              floatingLabelText="Ethereum address"
              style={{ width: '100%' }}
              value={ profile.getIn(['create', 'address']) }
            />

            <h3>{'Tips before you get started'}</h3>
            <p style={{ fontSize: '13px' }} >
              {'Since we cannot help you recover passwords, or identities make sure to:'}<br />
              {'1. Write down your password and keep it safe'}<br />
              {'2. Backup your ID now and don’t be sorry later'}<br />
              {'3. Don’t (ever) share your key with other people'}<br />
            </p>
          </div>

          <div className="row end-xs" >
            <div className="col-xs" style={{ position: 'absolute', bottom: 0, right: 0 }} >
              <RaisedButton
                label="Backup"
                disabled
              />
              <RaisedButton
                label="Enjoy AKASHA"
                primary
                style={{ marginLeft: '12px' }}
                onClick={this._handleFinishSetup}
              />
            </div>
          </div>

        </div>
      </div>
    );
  }
  _handleFinishSetup = (ev) => {
    this.context.router.push('/severs');
  }
}

CreateProfileComplete.propTypes = {
  actions: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  style: PropTypes.object
};

CreateProfileComplete.contextTypes = {
  muiTheme: React.PropTypes.object,
  router: React.PropTypes.object
};

CreateProfileComplete.defaultProps = {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }
};

export default CreateProfileComplete;
