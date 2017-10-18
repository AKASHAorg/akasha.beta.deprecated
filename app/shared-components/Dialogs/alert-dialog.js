import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dialog, RaisedButton } from 'material-ui';

class AlertDialog extends Component {
    state = {
        open: false
    };
    show = (callback) => {
        this.callback = callback;
        this.setState({ open: true });
    }
    hide = () => {
        this.setState({ open: false });
        this.callback = null;
    }
    dialogAction = (input) => {
        if (this.callback) {
            this.callback(input);
        }
        this.hide();
    }
    render () {
        const { message, confirmLabel, cancelLabel } = this.props;
        const actions = [
            <RaisedButton // eslint-disable-line react/jsx-indent
              label={cancelLabel}
              onClick={() => this.dialogAction(false)}
              style={{ marginRight: 8 }}
            />,
            <RaisedButton // eslint-disable-line react/jsx-indent
              label={confirmLabel}
              onClick={() => this.dialogAction(true)}
            />
        ];
        return (
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            contentStyle={{ maxWidth: 320 }}
          >
            {message}
          </Dialog>
        );
    }
}
AlertDialog.propTypes = {
    message: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string.isRequired,
    cancelLabel: PropTypes.string.isRequired
};
export default AlertDialog;
