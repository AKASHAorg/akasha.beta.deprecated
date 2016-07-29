import React from 'react';
import {
    Dialog,
    TextField } from 'material-ui';
import Avatar from '../avatar/avatar-editor';
const loginDialog = (props) => {
    const {
        profile,
        title,
        isOpen,
        modalActions
    } = props;
    return (
      <Dialog
        title={title}
        modal
        open={isOpen}
        actions={modalActions}
        contentStyle={{ width: '82%' }}
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
