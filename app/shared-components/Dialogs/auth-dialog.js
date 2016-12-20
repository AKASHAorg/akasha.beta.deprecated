import React, { PropTypes } from 'react';
import { TextField, Dialog, RaisedButton, Checkbox, SelectField, MenuItem } from 'material-ui';
import { formMessages, generalMessages } from '../../locale-data/messages';

function AuthDialog (props) {
    const { intl, loginErrors, onCancel, loginRequested, onPasswordChange,
      password, onSubmit, isVisible, rememberTime, rememberChecked, onRememberPasswordCheck,
      onRememberTimeChange } = props;
    const handleSubmit = (ev) => {
        ev.preventDefault();
        return props.onSubmit();
    };
    const dialogActions = [
      <RaisedButton // eslint-disable-line indent
        label={intl.formatMessage(generalMessages.cancel)}
        style={{ marginRight: 8 }}
        onTouchTap={onCancel}
      />,
      <RaisedButton // eslint-disable-line indent
        label={intl.formatMessage(generalMessages.confirm)}
        primary
        onTouchTap={handleSubmit}
      />
    ];
    const minute = 'min';
    return (
      <Dialog
        contentStyle={{ width: '40%', maxWidth: 'none' }}
        actions={dialogActions}
        title={intl.formatMessage(formMessages.confirmPassphrase)}
        open={isVisible}
      >
        <form onSubmit={onSubmit}>
          <div>{intl.formatMessage(formMessages.confirmPassphraseToContinue)}</div>
          <TextField
            fullWidth
            floatingLabelText={intl.formatMessage(formMessages.passphrase)}
            autoFocus
            onChange={onPasswordChange}
            type="password"
            value={password}
            errorText={loginErrors.size ? loginErrors.first().message : null}
          />
          <div className="row middle-xs">
            <div className="col-xs-8" style={{ paddingRight: 0 }}>
              <Checkbox
                label={intl.formatMessage(formMessages.rememberPassFor)}
                checked={rememberChecked}
                onCheck={onRememberPasswordCheck}
              />
            </div>
            <div className="col-xs-3 start-xs" style={{ paddingLeft: 0, display: 'flex' }}>
              <SelectField
                value={rememberTime}
                style={{ width: 100 }}
                onChange={onRememberTimeChange}
              >
                <MenuItem value={5} primaryText={`5 ${minute}`} />
                <MenuItem value={10} primaryText={`10 ${minute}`} />
                <MenuItem value={15} primaryText={`15 ${minute}`} />
                <MenuItem value={30} primaryText={`30 ${minute}`} />
              </SelectField>
            </div>
          </div>
        </form>
      </Dialog>
    );
}
AuthDialog.propTypes = {
    isVisible: PropTypes.bool,
    onPasswordChange: PropTypes.func,
    rememberChecked: PropTypes.bool,
    onRememberPasswordCheck: PropTypes.func,
    rememberTime: PropTypes.number,
    onRememberTimeChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    password: PropTypes.string,
    loginErrors: PropTypes.shape(),
    loginRequested: PropTypes.bool,
    intl: PropTypes.shape()
};

export default AuthDialog;
