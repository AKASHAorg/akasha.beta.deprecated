import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from 'material-ui';

export default function PathInputField (props, { muiTheme }) {
    const { disabled, errorText, floatingLabelText, onChange, path } = props;
    let fileInput;
    const handleDialogOpen = () => {
        if (fileInput) {
            fileInput.click();
        }
    };

    const handlePathChange = () => {
        if (fileInput.files[0]) {
            const newPath = fileInput.files[0].path;
            onChange(newPath);
        }
    };

    const setFileInputRef = (node) => {
        if (node) {
            node.webkitdirectory = true;
            fileInput = node;
        }
    };

    const errorStyle = {
        color: muiTheme.palette.disabledColor,
        overflowX: 'visible',
        whiteSpace: 'nowrap'
    };
    const inputStyle = { color: muiTheme.palette.textColor };
    const floatingLabelStyle = { color: muiTheme.palette.disabledColor, zIndex: 0 };

    return (
      <div>
        <TextField
          errorStyle={errorStyle}
          errorText={errorText}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={floatingLabelText}
          value={path || ''}
          inputStyle={inputStyle}
          onClick={disabled ? () => {} : handleDialogOpen}
          onFocus={disabled ? () => {} : handleDialogOpen}
          fullWidth
          disabled={disabled}
        />
        <input
          type="file"
          ref={setFileInputRef}
          onChange={handlePathChange}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
      </div>
    );
}

PathInputField.contextTypes = {
    muiTheme: PropTypes.shape()
};

PathInputField.propTypes = {
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    onChange: PropTypes.func,
    path: PropTypes.string,
};
