import React from 'react';
import { TextField, Dialog, RaisedButton, Checkbox, SelectField, MenuItem } from 'material-ui';
import { LogoIcon } from 'shared-components/svg';

export default function AuthDialog (props) {
    const DialogTitle = (
      <div className="row middle-xs">
        <LogoIcon />
        <div className="col-xs-11">
          Confirm Password
        </div>
      </div>
    );
    const dialogActions = [
      <RaisedButton
        label="Cancel"
        style={{ marginRight: 8 }}
        onTouchTap={props.onCancel}
      />,
      <RaisedButton
        label="Confirm"
        primary
        onTouchTap={props.onSubmit}
      />
    ];
    const minute = 'min';
    return (
      <Dialog
        contentStyle={{ width: '40%', maxWidth: 'none' }}
        actions={dialogActions}
        title={DialogTitle}
        open={props.isVisible}
      >
        <small>You need to confirm your password to continue</small>
        <TextField
          fullWidth
          hintText="Type your password"
          floatingLabelText={"Password"}
          autoFocus
          onChange={props.onPasswordChange}
          type="password"
          value={props.password}
        />
        <div className="row middle-xs">
          <div className="col-xs-7" style={{ paddingRight: 0 }}>
            <Checkbox
              label="Keep account unlocked for"
              onCheck={props.onUnlockCheck}
            />
          </div>
          <div className="col-xs-3 start-xs" style={{ paddingLeft: 0 }}>
            <SelectField value={1} style={{ width: 100 }}>
              <MenuItem value={1} primaryText={`30 ${minute}`} />
              <MenuItem value={2} primaryText={`20 ${minute}`} />
              <MenuItem value={3} primaryText={`10 ${minute}`} />
            </SelectField>
          </div>
        </div>
      </Dialog>
    );
}
AuthDialog.propTypes = {
    isVisible: React.PropTypes.bool,
    onPasswordChange: React.PropTypes.func,
    onUnlockCheck: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    password: React.PropTypes.string
};
