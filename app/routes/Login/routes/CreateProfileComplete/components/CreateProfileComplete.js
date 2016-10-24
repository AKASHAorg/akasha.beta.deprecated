import React, { Component, PropTypes } from 'react';
import { PanelContainer } from 'shared-components';
import { RaisedButton, TextField } from 'material-ui';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages, profileMessages, formMessages } from 'locale-data/messages';
import PanelHeader from '../../../../components/panel-header';

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
        const fullName = `${tempProfile.get('firstName')} ${tempProfile.get('lastName')}`;

        return (
          <PanelContainer
            showBorder
            style={style}
            header={<PanelHeader title={intl.formatMessage(setupMessages.identityRegistered)} />}
            actions={[
                /* eslint-disable */
                <RaisedButton
                  label={intl.formatMessage(generalMessages.backup)}
                  disabled
                  key="backup"
                />,
                <RaisedButton
                  key="enjoyAKSH"
                  label={intl.formatMessage(profileMessages.enjoyAkasha)}
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
                    floatingLabelText={intl.formatMessage(formMessages.name)}
                    style={{ width: '210px' }}
                    value={fullName}
                  />
                  <TextField
                    disabled
                    floatingLabelText={intl.formatMessage(formMessages.username)}
                    style={{ width: '210px', marginLeft: '20px' }}
                    value={tempProfile.get('username')}
                  />
                  <TextField
                    disabled
                    floatingLabelText={intl.formatMessage(generalMessages.ethereumAddress)}
                    style={{ width: '100%' }}
                    value={tempProfile.get('address')}
                  />
                  <h3>{intl.formatMessage(profileMessages.tipsBeforeStart)}</h3>
                  <p style={{ fontSize: '13px' }} >
                    {intl.formatMessage(profileMessages.weCannotHelpRecover)}<br />
                    {`1. ${intl.formatMessage(profileMessages.writePassKeepSafe)}`}<br />
                    {`2. ${intl.formatMessage(profileMessages.backupYourId)}`}<br />
                    {`3. ${intl.formatMessage(profileMessages.dontShareKey)}`}<br />
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
    muiTheme: React.PropTypes.shape(),
    router: React.PropTypes.shape()
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
