import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RaisedButton, TextField } from 'material-ui';
import { formMessages, generalMessages, profileMessages } from '../../locale-data/messages';
import { PanelContainerFooter } from '../';

class NewProfileComplete extends Component {
    componentWillMount () {
        const { tempProfile, tempProfileGetRequest } = this.props;
        if (!tempProfile.get('akashaId')) {
            tempProfileGetRequest();
        }
    }

    _handleComplete = () => {
        const { history, tempProfileDelete, tempProfile } = this.props;
        tempProfileDelete({ akashaId: tempProfile.get('akashaId') });
        history.push('/setup/authenticate');
    };

    render () {
        const { tempProfile, intl } = this.props;
        const fullName = `${tempProfile.get('firstName')} ${tempProfile.get('lastName')}`;
        return (
          <div>
            <div className="row start-xs" >
              <div className="col-xs-6" >
                <TextField
                  disabled
                  floatingLabelText={intl.formatMessage(formMessages.name)}
                  style={{ cursor: 'default' }}
                  value={fullName || ''}
                  fullWidth
                />
              </div>
              <div className="col-xs-6">
                <TextField
                  disabled
                  floatingLabelText={intl.formatMessage(formMessages.akashaId)}
                  style={{ cursor: 'default' }}
                  value={tempProfile.get('akashaId') || ''}
                  fullWidth
                />
              </div>
              <div className="col-xs-12">
                <TextField
                  disabled
                  floatingLabelText={intl.formatMessage(generalMessages.ethereumAddress)}
                  style={{ cursor: 'default' }}
                  value={tempProfile.get('address') || ''}
                  fullWidth
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
            <PanelContainerFooter>
              <RaisedButton
                label="Enjoy AKASHA"
                onClick={this._handleComplete}
                primary
              />
            </PanelContainerFooter>
          </div>
        );
    }
}

NewProfileComplete.propTypes = {
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    tempProfile: PropTypes.shape(),
    tempProfileGetRequest: PropTypes.func,
    tempProfileDelete: PropTypes.func,
};

export default NewProfileComplete;
