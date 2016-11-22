import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { Dialog, FlatButton, RaisedButton, TextField, IconButton } from 'material-ui';
import { confirmMessages } from 'locale-data/messages';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';

class PublishConfirmDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gasError: null
        };
    }

    componentWillReceiveProps (nextProps) {
        const { isOpen, resource } = nextProps;
        if (isOpen && !this.props.isOpen) {
            this.setState({
                gasAmount: resource.get('gas')
            });
        }
    }

    _handleGasChange = (ev) => {
        // const { gas } = this.props.resource;
        const amount = ev.target.value;
        // if (minGas < amount) {
        //     return this.setState({
        //         gasError: `You cannot set gas amount lower than ${minGas}`
        //     });
        // }
        return this.setState({
            gasAmount: amount
        });
    }
    _handleConfirm = () => {
        const { resource, appActions } = this.props;
        const updatedResource = resource.toJS();
        updatedResource.gas = this.state.gasAmount || resource.get('gas');
        updatedResource.status = 'checkAuth';
        appActions.hidePublishConfirmDialog();
        appActions.updatePendingAction(updatedResource);
    }
    _handleAbort = () => {
        const { resource, appActions } = this.props;
        appActions.deletePendingAction(resource.get('id'));
        appActions.hidePublishConfirmDialog();
    }
    onSubmit = (ev) => {
        ev.preventDefault();
        this._handleConfirm();
    }
    render () {
        const { resource, intl, isOpen } = this.props;
        if (!resource) {
            return null;
        }
        const dialogActions = [
          /*eslint-disable*/
          <FlatButton
            label="Abort"
            style={{ marginRight: 8 }}
            onClick={this._handleAbort}
          />,
          <RaisedButton
            label="Confirm"
            primary
            onClick={this._handleConfirm}
          />
          /*eslint-enable*/
        ];
        return (
          <Dialog
            contentStyle={{ width: 420, maxWidth: 'none' }}
            modal
            title={
              <div style={{ fontSize: 24 }}>
                {intl.formatMessage(confirmMessages[resource.get('titleId')])}
              </div>
            }
            open={isOpen}
            actions={dialogActions}
          >
            <p>
              {intl.formatMessage(
                  confirmMessages[resource.get('messageId')], resource.get('payload')
              )}
            </p>
            <form onSubmit={this.onSubmit}>
              <div className="row middle-xs">
                <TextField
                  floatingLabelFixed
                  floatingLabelText={'Maximum amount of gas to use'}
                  fullWidth
                  className="col-xs-10"
                  value={this.state.gasAmount}
                  onChange={this._handleGasChange}
                />
                <IconButton
                  className="col-xs-2 custom-title"
                  style={{ marginTop: 24 }}
                  title={
                      `Gas to be used by this transaction.
  Unused gas will be returned.`
                  }
                >
                  <InfoIcon />
                </IconButton>
              </div>
            </form>
          </Dialog>
        );
    }
}

PublishConfirmDialog.propTypes = {
    isOpen: PropTypes.bool,
    resource: PropTypes.shape(),
    intl: PropTypes.shape()
};

export default injectIntl(PublishConfirmDialog);
