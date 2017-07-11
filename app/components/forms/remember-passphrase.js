import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Checkbox, MenuItem, SelectField } from 'material-ui';
import { formMessages, generalMessages } from '../../locale-data/messages';

const RememberPassphrase = (props) => {
    const { handleCheck, handleTimeChange, intl, isChecked, unlockTime } = props;

    const renderMenuItem = (value) => {
        const message = value < 60 ?
            intl.formatMessage(generalMessages.minCount, { minutes: value }) :
            intl.formatMessage(generalMessages.hoursCount, { hours: value / 60 });
        return (
          <MenuItem
            primaryText={message}
            value={value}
          />
        );
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
        <div style={{ flex: '3 3 auto' }}>
          <Checkbox
            checked={isChecked}
            label={intl.formatMessage(formMessages.rememberPassFor)}
            onCheck={handleCheck}
          />
        </div>
        <SelectField
          onChange={handleTimeChange}
          style={{ flex: '2 2 120px' }}
          value={unlockTime}
        >
          {renderMenuItem(5)}
          {renderMenuItem(10)}
          {renderMenuItem(15)}
          {renderMenuItem(30)}
          {renderMenuItem(60)}
        </SelectField>
      </div>
    );
};

RememberPassphrase.propTypes = {
    handleCheck: PropTypes.func.isRequired,
    handleTimeChange: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    isChecked: PropTypes.bool,
    unlockTime: PropTypes.number
};

export default injectIntl(RememberPassphrase);
