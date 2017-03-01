import React, { PropTypes } from 'react';
import { MenuItem, SelectField } from 'material-ui';
import { setupMessages } from 'locale-data/messages';  // eslint-disable-line import/no-unresolved, import/extensions

export default function GethCacheSelect ({ cache, hasErrorText, intl, onChange }, { muiTheme }) {
    const labelStyle = {
        color: muiTheme.palette.disabledColor,
        cursor: 'default',
        overflowX: 'visible',
        whiteSpace: 'nowrap',
        zIndex: 0
    };

    const selectStyle = {
        maxWidth: '120px',
    };

    const errorStyle = {
        color: muiTheme.palette.disabledColor,
        overflowX: 'visible',
        whiteSpace: 'nowrap'
    };

    return (
      <SelectField
        errorStyle={errorStyle}
        errorText={hasErrorText && intl.formatMessage(setupMessages.changeGethCacheSize)}
        floatingLabelStyle={labelStyle}
        floatingLabelText={intl.formatMessage(setupMessages.gethCacheSize)}
        value={cache}
        onChange={onChange}
        style={selectStyle}
      >
        <MenuItem key={1} value={512} primaryText="512 MB" />
        <MenuItem key={2} value={1024} primaryText="1024 MB" />
        <MenuItem key={3} value={1536} primaryText="1536 MB" />
        <MenuItem key={4} value={2048} primaryText="2048 MB" />
      </SelectField>
    );
}

GethCacheSelect.contextTypes = {
    muiTheme: PropTypes.shape()
};

GethCacheSelect.propTypes = {
    cache: PropTypes.number,
    hasErrorText: PropTypes.bool,
    intl: PropTypes.shape(),
    onChange: PropTypes.func,
};
