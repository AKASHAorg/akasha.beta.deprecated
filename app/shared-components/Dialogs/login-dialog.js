import React from 'react';
import {
    Dialog,
    TextField,
    Checkbox,
    SelectField,
    MenuItem } from 'material-ui';
import Avatar from '../Avatar/avatar';

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
    }
    return (
      <Dialog
        title={title}
        modal
        open={isOpen}
        actions={modalActions}
        contentStyle={{ width: '50%' }}
      >
        <Avatar
          editable={false}
          userName={
            `${profile.get('firstName')} ${profile.get('lastName')}`
          }
          image={`data:image/gif;base64,${
            btoa(String.fromCharCode.apply(
              null,
              profile.getIn(['optionalData', 'avatar'])
            ))
          }`}
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
              floatingLabelText="userName"
              value={`${profile.get('userName')}`}
              fullWidth
            />
          </div>
        </div>
        <TextField
          disabled
          fullWidth
          floatingLabelText="Ethereum address"
          value={profile.get('address')}
        />
        <TextField
          type="password"
          fullWidth
          floatingLabelText="Password"
          onKeyPress={props.onKeyPress}
          onChange={props.onPasswordChange}
        />
        <div className="row middle-xs">
          <div className="col-xs-7" style={{ paddingRight: 0 }}>
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
    profile: React.PropTypes.object.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    modalActions: React.PropTypes.array.isRequired,
    onPasswordChange: React.PropTypes.func.isRequired,
    onKeyPress: React.PropTypes.func.isRequired
};
export default loginDialog;
