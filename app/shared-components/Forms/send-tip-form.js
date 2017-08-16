import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { TextField } from 'material-ui';
import { confirmMessages, formMessages } from '../../locale-data/messages';

const ENTER = 'Enter';

class SendTipForm extends Component {
    handleKeyDown = (ev) => {
        const { onSubmit } = this.props;
        if (ev.key === ENTER) {
            onSubmit(ev);
        }
    };

    render () {
        const { balance, disableReceiverField, ethAmount, ethAmountError, handleEthChange,
            intl, onSubmit, profileData } = this.props;
        const { firstName, lastName, receiver } = profileData;
        const receiverFull = `@${receiver} (${firstName} ${lastName})`;
        return (
          <form onSubmit={onSubmit}>
            <div className="row middle-xs">
              <TextField
                disabled={disableReceiverField}
                floatingLabelFixed
                floatingLabelText={intl.formatMessage(confirmMessages.receiverLabel)}
                fullWidth
                className="col-xs-10"
                value={receiverFull}
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
                onKeyDown={this.handleKeyDown}
                errorText={ethAmountError &&
                    intl.formatMessage(formMessages[ethAmountError.message], ethAmountError)
                }
                errorStyle={{ position: 'absolute', bottom: '-8px' }}
                min={0.0001}
                max={balance - 0.1}
                autoFocus
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
            </div>
          </form>
        );
    }
}

SendTipForm.propTypes = {
    balance: PropTypes.string,
    disableReceiverField: PropTypes.bool,
    ethAmount: PropTypes.string,
    ethAmountError: PropTypes.shape(),
    handleEthChange: PropTypes.func,
    intl: PropTypes.shape(),
    onSubmit: PropTypes.func,
    profileData: PropTypes.shape()
};

export default injectIntl(SendTipForm);
