import React from 'react';
import { Dialog, TextField, Checkbox, SelectField, MenuItem, Avatar } from 'material-ui';

const loginDialog = (props) => {
    const minute = 'min';
    const {
        profile,
        title,
        isOpen,
        modalActions
    } = props;
    const handleUnlockChange = (ev, key, payload) => {
        props.onUnlockTimerChange(key, payload);
    };
    const handleUnlockCheck = (ev, isUnlocked) => {
        props.onUnlockCheck(isUnlocked);
    };
    const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
    const userInitials = profileName.match(/\b\w/g);
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
            {userInitials &&
              ((userInitials.shift() || '') + (userInitials.pop() || '')).toUpperCase()
            }
          </Avatar>
        }
        <div className="row" >
          <div className="col-xs-6" >
            <TextField
              disabled
              fullWidth
              floatingLabelText="Name"
              value={
                `${profile.get('firstName')} ${profile.get('lastName')}`
              }
            />
          </div>
          <div className="col-xs-6" >
            <TextField
              disabled
              floatingLabelText="Username"
              value={`${profile.get('username')}`}
              fullWidth
            />
          </div>
        </div>
        <TextField
          disabled
          fullWidth
          floatingLabelText="Ethereum address"
          value={profile.get('ethAddress')}
        />
        <TextField
          type="password"
          fullWidth
          floatingLabelText="Password"
          onKeyPress={props.onKeyPress}
          onChange={props.onPasswordChange}
          errorText={props.errors.reduce((prev, current) => `${prev.message} ${current.message}`)}
        />
        <div className="row middle-xs" >
          <div className="col-xs-6" style={{ paddingRight: 0 }} >
            <Checkbox
              label="Remember my password for"
              onCheck={handleUnlockCheck}
            />
          </div>
          <div className="col-xs-3 start-xs" style={{ paddingLeft: 0 }} >
            <SelectField
              value={props.unlockTimerKey}
              style={{ width: 100 }}
              onChange={handleUnlockChange}
            >
              <MenuItem value={5} primaryText={`5 ${minute}`} />
              <MenuItem value={10} primaryText={`10 ${minute}`} />
              <MenuItem value={15} primaryText={`15 ${minute}`} />
              <MenuItem value={30} primaryText={`30 ${minute}`} />
            </SelectField>
          </div>
        </div>
      </Dialog>
    );
};
loginDialog.propTypes = {
    profile: React.PropTypes.shape().isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    modalActions: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
    onPasswordChange: React.PropTypes.func.isRequired,
    onKeyPress: React.PropTypes.func.isRequired,
    onUnlockCheck: React.PropTypes.func.isRequired,
    unlockTimerKey: React.PropTypes.number.isRequired,
    errors: React.PropTypes.shape()
};
export default loginDialog;
