import React, { Component } from 'react';
import { Dialog, FlatButton, RaisedButton, TextField, IconButton } from 'material-ui';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';

class PublishConfirmDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gasError: null
        };
    }
    _handleGasChange = (ev) => {
        const { minGas } = this.props.resource;
        const amount = ev.target.value;
        if (minGas < amount) {
            return this.setState({
                gasError: `You cannot set gas amount lower than ${minGas}`
            });
        }
        return this.setState({
            gasAmount: amount
        });
    }
    _handleConfirm = () => {
        const { resource, tagActions, appActions } = this.props;
        if (this.state.gas) {
            resource.minGas = this.state.gasAmount;
        }
        if (resource.type === 'tag') {
            resource.publishConfirmed = true;
            console.log(resource, 'the resource');
            tagActions.updatePendingTag(resource);
        }
    }
    _handleAbort = () => {
        const { resource, tagActions, appActions } = this.props;
        if (resource.type === 'tag') {
            tagActions.deletePendingTag(resource);
            appActions.hidePublishConfirmDialog();
        }
    }
    render () {
        const { resource, intl, isOpen } = this.props;
        let type;
        let minGas;
        let tag;
        if (resource) {
            type = resource.type;
            minGas = resource.minGas;
            tag = resource.tag;
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
              <div style={{ fontSize: 24 }}>{`Confirm ${type} publishing`}</div>
            }
            open={isOpen}
            actions={dialogActions}
          >
            {type === 'tag' &&
              <p>Are you sure you want to publish tag &quot;{tag}&quot;?</p>
            }
            <div className="row middle-xs">
              <TextField
                defaultValue={minGas}
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
          </Dialog>
        );
    }
}

export default PublishConfirmDialog;
