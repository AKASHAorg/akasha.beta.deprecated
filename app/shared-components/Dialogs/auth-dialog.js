import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { TextField, Dialog, RaisedButton, Checkbox, SelectField, MenuItem } from 'material-ui';
import { formMessages } from 'locale-data/messages';
import PanelHeader from '../../routes/components/panel-header';

function AuthDialog (props) {
    const { intl, loginErrors } = props;
    const dialogTitle =
      (<div style={{ padding: '10px 10px 20px' }}>
        <PanelHeader title={intl.formatMessage(formMessages.confirmPassphrase)} noStatusBar />
      </div>);
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
          disabled={props.loginRequested}
        />
    ];
    const minute = 'min';
    return (
      <Dialog
        contentStyle={{ width: '40%', maxWidth: 'none' }}
        actions={dialogActions}
        title={dialogTitle}
        open={props.isVisible}
      >
        <form onSubmit={props.onSubmit}>
          <div>{intl.formatMessage(formMessages.confirmPassphraseToContinue)}</div>
          <TextField
            fullWidth
            floatingLabelText={intl.formatMessage(formMessages.passphrase)}
            autoFocus
            onChange={props.onPasswordChange}
            type="password"
            value={props.password}
            errorText={loginErrors.size ? loginErrors.first().message : null}
          />
          <div className="row middle-xs">
            <div className="col-xs-8" style={{ paddingRight: 0 }}>
              <Checkbox
                label="Remember my passphrase for"
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
    loginErrors: PropTypes.shape(),
    loginRequested: PropTypes.bool,
    intl: PropTypes.shape()
};

export default injectIntl(AuthDialog);
