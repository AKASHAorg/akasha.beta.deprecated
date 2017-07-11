import PropTypes from 'prop-types';
import React from 'react';
import styles from './input.scss';

const Input = (props, { muiTheme }) => {
    const { autoFocus, disabled, errorText, label, onChange, onKeyPress, placeholder, type, value } = props;
    const { palette } = muiTheme;
    const borderColor = errorText ? palette.errorColor : palette.borderColor;
    return (
      <div style={{ marginBottom: '12px' }}>
        {label &&
          <div>
            <small>{label}</small>
           </div>
        }
        <div style={{ position: 'relative', padding: '12px', border: `1px solid ${borderColor}` }}>
          {!disabled &&
            <input
              autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
              className={styles.input}
              onChange={onChange}
              onKeyPress={onKeyPress}
              placeholder={placeholder}
              type={type}
              value={value}
            />
          }
          {errorText &&
            <small style={{ position: 'absolute', bottom: '-20px', color: palette.errorColor }}>
              {errorText}
            </small>
          }
          {disabled &&
            <div className="overflow-ellipsis">
              {value}
            </div>
          }
        </div>
      </div>
    );
};

Input.contextTypes = {
    muiTheme: PropTypes.shape()
};

Input.propTypes = {
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string
};

export default Input;
