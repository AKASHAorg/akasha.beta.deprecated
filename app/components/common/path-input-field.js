import PropTypes from 'prop-types';
import React from 'react';
import { Input } from '../';

export default function PathInputField ({ disabled, onChange, ...props }) {
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

    return (
      <div>
        <input
          type="file"
          ref={setFileInputRef}
          onChange={handlePathChange}
          style={{ display: 'none' }}
        />
        <Input
          disabled={disabled}
          onClick={disabled ? () => {} : handleDialogOpen}
          readOnly
          {...props}
        />
      </div>
    );
}

PathInputField.propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};
