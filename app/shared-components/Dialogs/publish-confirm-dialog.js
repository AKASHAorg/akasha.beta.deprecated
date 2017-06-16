import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Dialog, FlatButton, RaisedButton, TextField, IconButton } from 'material-ui';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import { AppActions } from '../../local-flux';
import { confirmMessages, formMessages, generalMessages } from '../../locale-data/messages';

const DEFAULT_GAS = 2000000;
const gasCosts = {
    tempProfile: DEFAULT_GAS
};

class PublishConfirmDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gasAmount: null,
            gasAmountError: null
        };
    }

    componentWillMount () {
        const gasAmount = this._getMinGas();
        this.setState({
            gasAmount
        });
    }

    componentDidUpdate () {
        ReactTooltip.rebuild();
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        this._handleConfirm();
    };
    _getMinGas = () => {
        const { pendingAction } = this.props;
        const { entityType } = pendingAction;
        return gasCosts[entityType] || DEFAULT_GAS;
    }
    _handleGasChange = (ev) => {
        const gasAmount = ev.target.value;
        const minGas = this._getMinGas();
        if (gasAmount < minGas || gasAmount > 4700000) {
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
        const { pendingAction, appActions } = this.props;
        appActions.hidePublishConfirmDialog();
        appActions.updatePendingAction(pendingAction.withMutations(action => {
            action.set('gas', this.state.gasAmount);
        }));
    };
    _findResource = (entityType, id) => {
        const { state } = this.props;
        switch (entityType) {
            case 'tempProfile':
                return state.tempProfileState.get('tempProfile');
            case 'comment':
                return state.commentsState.getIn(['byId', id]);
            default:
                return null;
        }
    }
    _handleAbort = () => {
        const { pendingAction, appActions } = this.props;
        appActions.deletePendingAction(pendingAction.get('entityId'));
        appActions.hidePublishConfirmDialog();
    };

    render () {
        const { pendingAction, intl } = this.props;
        const { gasAmount, gasAmountError } = this.state;
        const resource = this._findResource(pendingAction.get('entityType'), pendingAction.get('entityId'));

        if (!resource) {
            return null;
        }
        console.log(resource, 'the resource');
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
    pendingAction: PropTypes.shape().isRequired,
    appActions: PropTypes.shape(),
    state: PropTypes.shape(),
    intl: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        pendingAction: state.appState.getIn(['pendingActions', state.appState.get('publishConfirmDialog')]),
        state
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishConfirmDialog);
