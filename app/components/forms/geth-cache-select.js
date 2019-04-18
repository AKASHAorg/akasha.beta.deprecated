import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Select as AntdSelect } from 'antd';
import { setupMessages } from '../../locale-data/messages';
import { Select } from '../';

const { Option } = AntdSelect;

function GethCacheSelect ({ intl, onChange, style, value, wrapperStyle }) {
    return (
        <Select
            label={ intl.formatMessage(setupMessages.gethCacheSize) }
            onChange={ onChange }
            size="large"
            style={ style }
            value={ value }
            wrapperStyle={ wrapperStyle }
        >
            <Option value="512">512 MB</Option>
            <Option value="1024">1024 MB</Option>
            <Option value="1536">1536 MB</Option>
            <Option value="2048">2048 MB</Option>
        </Select>
    );
}

GethCacheSelect.propTypes = {
    intl: PropTypes.shape(),
    onChange: PropTypes.func,
    style: PropTypes.shape(),
    value: PropTypes.string,
    wrapperStyle: PropTypes.shape()
};

export default injectIntl(GethCacheSelect);
