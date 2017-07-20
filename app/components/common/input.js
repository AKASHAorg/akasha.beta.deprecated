import PropTypes from 'prop-types';
import React from 'react';
import { Input } from 'antd';
import styles from './input.scss';

const WrappedInput = ({ label, labelStyle, wrapperStyle, ...props }) => (
  <div className={`${styles.root} ${label && styles.withLabel}`} style={wrapperStyle}>
    {label &&
      <div className={styles.label} style={labelStyle}>
        {label}
        </div>
    }
    <Input {...props} />
  </div>
);

WrappedInput.propTypes = {
    label: PropTypes.string,
    labelStyle: PropTypes.shape(),
    wrapperStyle: PropTypes.shape()
};

export default WrappedInput;
