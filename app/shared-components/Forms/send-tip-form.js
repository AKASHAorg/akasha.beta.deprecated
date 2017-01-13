import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { TextField, IconButton } from 'material-ui';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import { confirmMessages, formMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions

class SendTipForm extends Component {
    render () {
        const { balance, disableReceiverField, ethAmount, ethAmountError, gasAmount,
            gasAmountError, handleEthChange, handleGasChange, intl, onSubmit,
            profileData } = this.props;
        const { akashaId, firstName, lastName } = profileData.toJS();
        const receiver = `@${akashaId} (${firstName} ${lastName})`;
        return (
          <form onSubmit={onSubmit}>
            <div className="row middle-xs">
              <TextField
                disabled={disableReceiverField}
                floatingLabelFixed
                floatingLabelText={intl.formatMessage(confirmMessages.receiverLabel)}
                fullWidth
                className="col-xs-10"
                value={receiver}
              />
              <TextField
                type="number"
                step="0.0001"
                floatingLabelFixed
                floatingLabelText={intl.formatMessage(confirmMessages.ethAmountLabel)}
                fullWidth
                className="col-xs-10"
                value={ethAmount}
                onChange={handleEthChange}
                errorText={ethAmountError && 'Not enough funds'}
                errorStyle={{ position: 'absolute', bottom: '-8px' }}
                min={0.0001}
                max={balance - 0.1}
              />
              {!ethAmountError &&
                <div style={{ paddingLeft: '7px' }}>
                  <small>
                    {intl.formatMessage(confirmMessages.maxEthAmountLabel, {
                        balance: balance - 0.1
                    })}
                  </small>
                </div>
              }
              {ethAmountError &&
                <div style={{ height: '24px', width: '100%' }} />
              }
              <TextField
                type="number"
                floatingLabelFixed
                floatingLabelText={intl.formatMessage(confirmMessages.gasInputLabel)}
                fullWidth
                className="col-xs-10"
                value={gasAmount}
                onChange={handleGasChange}
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
        );
    }
}

SendTipForm.propTypes = {
    balance: PropTypes.string,
    disableReceiverField: PropTypes.bool,
    ethAmount: PropTypes.string,
    ethAmountError: PropTypes.bool,
    gasAmount: PropTypes.number,
    gasAmountError: PropTypes.bool,
    handleEthChange: PropTypes.func,
    handleGasChange: PropTypes.func,
    intl: PropTypes.shape(),
    onSubmit: PropTypes.func,
    profileData: PropTypes.shape()
};

export default injectIntl(SendTipForm);
