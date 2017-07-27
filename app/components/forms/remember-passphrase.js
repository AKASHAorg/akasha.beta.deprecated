import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Checkbox, Select as AntdSelect } from 'antd';
import { Select } from '../';
import { formMessages, generalMessages } from '../../locale-data/messages';

const { Option } = AntdSelect;

const RememberPassphrase = (props) => {
    const { handleCheck, handleTimeChange, intl, isChecked, unlockTime } = props;

    const renderOption = (value) => {
        const message = value < 60 ?
            intl.formatMessage(generalMessages.minCount, { minutes: value }) :
            intl.formatMessage(generalMessages.hoursCount, { hours: value / 60 });
        return (
          <Option key={value} value={value}>
            {message}
          </Option>
        );
    };

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
        <Select
          getPopupContainer={() => document.getElementById('select-popup-container')}
          onChange={handleTimeChange}
          value={unlockTime}
          wrapperStyle={{ margin: '0px 0px 0px 5px', width: '80px', position: 'relative' }}
        >
          {['5', '10', '15', '30', '60'].map(mins => renderOption(mins))}
        </Select>
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
