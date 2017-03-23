import React, { Component, PropTypes } from 'react';
import { Dialog, TextField, Checkbox, SelectField, MenuItem, Avatar } from 'material-ui';
import { getInitials } from '../../utils/dataModule';

class LoginDialog extends Component {
    componentDidMount () {
        const { getUserSettings, profile } = this.props;
        getUserSettings(profile.get('akashaId'));
    }

    componentWillUnmount () {
        const { cleanUserSettings } = this.props;
        cleanUserSettings();
    }

    render () {
        const minute = 'min';
        const { profile, title, isOpen, modalActions, onUnlockTimerChange, onUnlockCheck,
            onKeyPress, onPasswordChange, loginErrors, unlockTimerKey,
            isUnlockedChecked } = this.props;
        const handleUnlockChange = (ev, key, payload) => onUnlockTimerChange(key, payload);
        const handleUnlockCheck = (ev, isUnlocked) => onUnlockCheck(isUnlocked);
        const userInitials = getInitials(profile.get('firstName'), profile.get('lastName'));
        const avatarImage = profile.get('avatar');
        return (
          <Dialog
            title={title}
            modal
            open={isOpen}
            actions={modalActions}
            contentStyle={{ width: '50%' }}
          >
            {avatarImage &&
              <Avatar src={avatarImage} size={100} style={{ border: '1px solid #bcbcbc' }} />
            }
            {!avatarImage &&
              <Avatar src={avatarImage} size={100} >
                {userInitials}
              </Avatar>
            }
            <div className="row" >
              <div className="col-xs-6" >
                <TextField
                  disabled
                  fullWidth
                  floatingLabelText="Name"
                  value={`${profile.get('firstName')} ${profile.get('lastName')}`}
                  style={{ cursor: 'default' }}
                />
              </div>
              <div className="col-xs-6" >
                <TextField
                  disabled
                  floatingLabelText="Akasha Id"
                  value={`${profile.get('akashaId')}`}
                  style={{ cursor: 'default' }}
                  fullWidth
                />
              </div>
            </div>
            <TextField
              disabled
              fullWidth
              floatingLabelText="Ethereum address"
              value={profile.get('ethAddress')}
              style={{ cursor: 'default' }}
            />
            <TextField
              type="password"
              fullWidth
              autoFocus
              floatingLabelText="Passphrase"
              onKeyPress={onKeyPress}
              onChange={onPasswordChange}
              errorText={loginErrors.size ? loginErrors.first().message : null}
            />
            <div className="row middle-xs" >
              <div className="col-xs-6" style={{ paddingRight: 0 }} >
                <Checkbox
                  label="Remember my passphrase for"
                  onCheck={handleUnlockCheck}
                  checked={isUnlockedChecked}
                />
              </div>
              <div className="col-xs-3 start-xs" style={{ paddingLeft: 0, display: 'flex' }} >
                <SelectField
                  value={unlockTimerKey}
                  style={{ width: 120 }}
                  onChange={handleUnlockChange}
                >
                  <MenuItem value={5} primaryText={`5 ${minute}`} />
                  <MenuItem value={10} primaryText={`10 ${minute}`} />
                  <MenuItem value={15} primaryText={`15 ${minute}`} />
                  <MenuItem value={30} primaryText={`30 ${minute}`} />
                  <MenuItem value={60} primaryText="1 hour" />
                </SelectField>
              </div>
            </div>
          </Dialog>
        );
    }
}

LoginDialog.propTypes = {
    cleanUserSettings: PropTypes.func.isRequired,
    getUserSettings: PropTypes.func.isRequired,
    profile: PropTypes.shape().isRequired,
    isOpen: PropTypes.bool.isRequired,
    isUnlockedChecked: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    modalActions: PropTypes.arrayOf(React.PropTypes.element).isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onUnlockCheck: PropTypes.func.isRequired,
    onUnlockTimerChange: PropTypes.func.isRequired,
    unlockTimerKey: PropTypes.number.isRequired,
    loginErrors: PropTypes.shape()
};

export default LoginDialog;
