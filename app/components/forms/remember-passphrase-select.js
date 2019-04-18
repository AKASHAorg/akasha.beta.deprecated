import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Select } from 'antd';
import { generalMessages } from '../../locale-data/messages';

const { Option } = Select;

const RememberPassphraseSelect = (props) => {
    const { getPopupContainer, handleTimeChange, intl, size, unlockTime } = props;
    const renderOption = (value) => {
        const message = value < 60 ?
            intl.formatMessage(generalMessages.minCount, { minutes: value }) :
            intl.formatMessage(generalMessages.hoursCount, { hours: value / 60 });
        return (
            <Option key={ value } value={ value }>
                { message }
            </Option>
        );
    };

    return (
        <Select
            getPopupContainer={ getPopupContainer || null }
            onChange={ handleTimeChange }
            size={ size }
            value={ unlockTime }
        >
            { ['5', '10', '15', '30', '60'].map(mins => renderOption(mins)) }
        </Select>
    );
};

RememberPassphraseSelect.propTypes = {
    getPopupContainer: PropTypes.func,
    handleTimeChange: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    size: PropTypes.string,
    unlockTime: PropTypes.string
};

export default injectIntl(RememberPassphraseSelect);
