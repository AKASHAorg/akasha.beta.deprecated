import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from 'shared-components/svg';
import { PanelContainer } from 'shared-components';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon, RaisedButton, TextField } from 'material-ui';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from 'locale-data/messages';
import LoginHeader from '../../../components/LoginHeader';

class CreateProfileComplete extends Component {
    componentWillMount () {
        const { tempProfile, profileActions } = this.props;
        if (!tempProfile.get('username')) {
            profileActions.getTempProfile();
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.tempProfile.get('username') === '') {
            this.context.router.push('/authenticate');
        }
    }
    _handleFinishSetup = () => {
        const { profileActions, tempProfile } = this.props;
        profileActions.deleteTempProfile(tempProfile.get('username'));
    }
    render () {
        const { style, intl, tempProfile } = this.props;
        const akashaLogoStyles = {
            width: '32px',
            height: '32px',
            marginRight: '10px',
            verticalAlign: 'middle'
        };
        const fullName = `${tempProfile.get('firstName')} ${tempProfile.get('lastName')}`;

        return (
          <PanelContainer
            showBorder
            style={style}
            header={<LoginHeader title={intl.formatMessage(setupMessages.identityRegistered)} />}
            actions={[
                /* eslint-disable */
                <RaisedButton
                  label="Backup"
                  disabled
                  key="backup"
                />,
                <RaisedButton
                  key="enjoyAKSH"
                  label="Enjoy AKASHA"
                  primary
                  style={{ marginLeft: '12px' }}
                  onClick={this._handleFinishSetup}
                />
                /* eslint-enable */
            ]}
          >
            <div style={style} >
              <div className="row start-xs" >
                <div className="col-xs" style={{ flex: 1, padding: 0 }} >
                  <TextField
                    disabled
                    floatingLabelText="Name"
                    style={{ width: '210px' }}
                    value={fullName}
                  />
                  <TextField
                    disabled
                    floatingLabelText="Username"
                    style={{ width: '210px', marginLeft: '20px' }}
                    value={tempProfile.get('username')}
                  />
                  <TextField
                    disabled
                    floatingLabelText="Ethereum address"
                    style={{ width: '100%' }}
                    value={tempProfile.get('address')}
                  />
                  <h3>{'Tips before you get started'}</h3>
                  <p style={{ fontSize: '13px' }} >
                    {'Since we cannot help you recover passwords, or identities make sure to:'}<br />
                    {'1. Write down your password and keep it safe'}<br />
                    {'2. Backup your ID now and don’t be sorry later'}<br />
                    {'3. Don’t (ever) share your key with other people'}<br />
                  </p>
                </div>
              </div>
            </div>
          </PanelContainer>
        );
    }
}

CreateProfileComplete.propTypes = {
    style: PropTypes.shape(),
    intl: PropTypes.shape(),
    tempProfile: PropTypes.shape(),
    profileActions: PropTypes.shape()
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

export default injectIntl(CreateProfileComplete);
