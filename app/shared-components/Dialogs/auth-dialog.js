import React, { PropTypes } from 'react';
import { TextField, Dialog, RaisedButton, Checkbox, SelectField, MenuItem } from 'material-ui';
import { formMessages, generalMessages } from '../../locale-data/messages';

function AuthDialog (props) {
    const { intl, errors } = props;
    const handleSubmit = (ev) => {
        ev.preventDefault();
        return props.onSubmit();
    };
    const dialogActions = [
      <RaisedButton // eslint-disable-line indent
        label={intl.formatMessage(generalMessages.cancel)}
        style={{ marginRight: 8 }}
        onTouchTap={props.onCancel}
      />,
      <RaisedButton // eslint-disable-line indent
        label={intl.formatMessage(generalMessages.confirm)}
        primary
        onTouchTap={handleSubmit}
        disabled={props.loginRequested}
      />
    ];
    const minute = 'min';
    return (
      <Dialog
        contentStyle={{ width: '40%', maxWidth: 'none' }}
        actions={dialogActions}
        title={intl.formatMessage(formMessages.confirmPassword)}
        open={props.isVisible}
      >
        <form onSubmit={handleSubmit}>
          <div>{intl.formatMessage(formMessages.confirmPasswordToContinue)}</div>
          <TextField
            fullWidth
            floatingLabelText={intl.formatMessage(formMessages.password)}
            autoFocus
            onChange={props.onPasswordChange}
            type="password"
            value={props.password}
            errorText={!!errors.length && errors[0].message}
          />
          <div className="row middle-xs">
            <div className="col-xs-7" style={{ paddingRight: 0 }}>
              <Checkbox
                label={intl.formatMessage(formMessages.rememberPassFor)}
                checked={props.rememberChecked}
                onCheck={props.onRememberPasswordCheck}
              />
            </div>
            <div className="col-xs-3 start-xs" style={{ paddingLeft: 0, display: 'flex' }}>
              <SelectField
                value={props.rememberTime}
                style={{ width: 100 }}
                onChange={props.onRememberTimeChange}
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
    errors: PropTypes.arrayOf(React.PropTypes.shape()),
    loginRequested: PropTypes.bool,
    intl: PropTypes.shape()
};

export default AuthDialog;
