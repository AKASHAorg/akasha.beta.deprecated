import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Checkbox } from 'antd';
import { RememberPassphraseSelect } from '../';
import { formMessages } from '../../locale-data/messages';

const RememberPassphrase = (props) => {
    const { handleCheck, handleTimeChange, intl, isChecked, unlockTime } = props;

    return (
      <div className="remember-passphrase">
        <div>
          <Checkbox
            checked={isChecked}
            onChange={handleCheck}
          >
            {intl.formatMessage(formMessages.rememberPassFor)}
          </Checkbox>
        </div>
        <div className="remember-passphrase__select-wrapper">
          <RememberPassphraseSelect
            getPopupContainer={() => document.getElementById('select-popup-container') || document.body}
            handleTimeChange={handleTimeChange}
            unlockTime={unlockTime}
          />
        </div>
      </div>
    );
};

RememberPassphrase.propTypes = {
    handleCheck: PropTypes.func.isRequired,
    handleTimeChange: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    isChecked: PropTypes.bool,
    unlockTime: PropTypes.string
};

export default injectIntl(RememberPassphrase);
