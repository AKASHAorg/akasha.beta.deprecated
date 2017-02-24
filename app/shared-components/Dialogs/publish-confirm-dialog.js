import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { AppActions } from 'local-flux';
import { Dialog, FlatButton, RaisedButton, TextField, IconButton } from 'material-ui';
import { confirmMessages, formMessages, generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import InfoIcon from 'material-ui/svg-icons/action/info-outline';

class PublishConfirmDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gasAmount: null,
            gasAmountError: null
        };
    }

    componentWillMount () {
        const { resource } = this.props;
        this.setState({
            gasAmount: resource.get('gas')
        });
    }

    componentDidUpdate () {
        ReactTooltip.rebuild();
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        this._handleConfirm();
    };

    _handleGasChange = (ev) => {
        const gasAmount = ev.target.value;
        if (gasAmount < 2000000 || gasAmount > 4700000) {
            this.setState({
                gasAmountError: true,
                gasAmount
            });
        } else {
            this.setState({
                gasAmountError: false,
                gasAmount
            });
        }
    };

    _handleConfirm = () => {
        const { resource, appActions } = this.props;
        const updatedResource = resource.toJS();
        updatedResource.gas = this.state.gasAmount || resource.get('gas');
        updatedResource.status = 'checkAuth';
        appActions.hidePublishConfirmDialog();
        appActions.updatePendingAction(updatedResource);
    };

    _handleAbort = () => {
        const { resource, appActions } = this.props;
        appActions.deletePendingAction(resource.get('id'));
        appActions.hidePublishConfirmDialog();
    };

    render () {
        const { resource, intl } = this.props;
        const { gasAmount, gasAmountError } = this.state;
        if (!resource) {
            return null;
        }
        const dialogActions = [
          <FlatButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.abort)}
            style={{ marginRight: 8 }}
            onClick={this._handleAbort}
          />,
          <RaisedButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.confirm)}
            primary
            onClick={this._handleConfirm}
            disabled={gasAmountError}
          />
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
            open
            actions={dialogActions}
          >
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {intl.formatMessage(
                  confirmMessages[resource.get('messageId')], resource.get('payload').toJS()
              )}
            </p>
            <form onSubmit={this.onSubmit}>
              <div className="row middle-xs">
                <TextField
                  type="number"
                  floatingLabelFixed
                  floatingLabelText={intl.formatMessage(confirmMessages.gasInputLabel)}
                  fullWidth
                  className="col-xs-10"
                  value={gasAmount}
                  onChange={this._handleGasChange}
                  errorText={gasAmountError &&
                      intl.formatMessage(formMessages.gasAmountError, { min: 2000000, max: 4700000 })
                  }
                  min={2000000}
                  max={4700000}
                />
                <div
                  className="col-xs-2"
                  style={{ marginTop: 24 }}
                  data-tip={intl.formatMessage(confirmMessages.gasInputDisclaimer)}
                >
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </div>
              </div>
            </form>
          </Dialog>
        );
    }
}

PublishConfirmDialog.propTypes = {
    resource: PropTypes.shape(),
    appActions: PropTypes.shape(),
    intl: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        resource: state.appState.get('publishConfirmDialog')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishConfirmDialog);
