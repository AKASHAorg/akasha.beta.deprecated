import React, { Component, PropTypes } from 'react';
import { PanelContainer } from 'shared-components';
import { RaisedButton, TextField } from 'material-ui';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages, profileMessages, formMessages } from 'locale-data/messages';
import PanelHeader from '../../../../components/panel-header';

class CreateProfileComplete extends Component {
    componentWillMount () {
        const { tempProfile, tempProfileActions } = this.props;
        if (!tempProfile.get('akashaId')) {
            tempProfileActions.getTempProfile();
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.tempProfile.get('akashaId') === '') {
            this.context.router.push('/authenticate');
        }
    }
    _handleFinishSetup = () => {
        const { tempProfileActions, profileActions, tempProfile } = this.props;
        profileActions.clearLoggedProfile();
        tempProfileActions.deleteTempProfile(tempProfile.get('akashaId'));
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
                    style={{ width: '210px', cursor: 'default' }}
                    value={fullName || ''}
                  />
                  <TextField
                    disabled
                    floatingLabelText={intl.formatMessage(formMessages.akashaId)}
                    style={{ width: '210px', marginLeft: '20px', cursor: 'default' }}
                    value={tempProfile.get('akashaId') || ''}
                  />
                  <TextField
                    disabled
                    floatingLabelText={intl.formatMessage(generalMessages.ethereumAddress)}
                    style={{ width: '100%', cursor: 'default' }}
                    value={tempProfile.get('address') || ''}
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
    tempProfileActions: PropTypes.shape(),
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
