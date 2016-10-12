import React from 'react';
import {
    Dialog,
    TextField,
    Checkbox,
    SelectField,
    MenuItem,
    Avatar } from 'material-ui';
import imageCreator from 'utils/imageUtils';

const loginDialog = (props) => {
    const minute = 'min';
    const {
        profile,
        title,
        isOpen,
        modalActions
    } = props;
    const handleUnlockChange = (ev, key, payload) => {
        console.log('change to key, payload', key, payload);
        props.onUnlockTimerChange(key, payload);
    };
    const handleUnlockCheck = (ev, isUnlocked) => {
        console.log('want auto unlock?', isUnlocked);
        props.onUnlockCheck(isUnlocked);
    };
    return (
      <Dialog
        title={title}
        modal
        open={isOpen}
        actions={modalActions}
        contentStyle={{ width: '50%' }}
      >
        <Avatar
          src={imageCreator(profile.get('avatar'))}
          size={100}
        />
        <div className="row">
          <div className="col-xs-6">
            <TextField
              disabled
              fullWidth
              floatingLabelText="Name"
              value={
                `${profile.get('firstName')} ${profile.get('lastName')}`
              }
            />
          </div>
          <div className="col-xs-6">
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
        <div className="row middle-xs">
          <div className="col-xs-6" style={{ paddingRight: 0 }}>
            <Checkbox
              label="Keep account unlocked for"
              onCheck={handleUnlockCheck}
            />
          </div>
          <div className="col-xs-3 start-xs" style={{ paddingLeft: 0 }}>
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
