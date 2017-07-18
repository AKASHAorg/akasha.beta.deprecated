import PropTypes from 'prop-types';
import React from 'react';
import { Select } from 'antd';
import styles from './select.scss';

const WrappedSelect = ({ children, label, labelStyle, wrapperStyle, ...props }) => (
  <div className={`${styles.root} ${label && styles.withLabel}`} style={wrapperStyle}>
    {label &&
      <div className={styles.label} style={labelStyle}>
        {label}
      </div>
    }
    <Select {...props}>
      {children}
    </Select>
  </div>
);

WrappedSelect.propTypes = {
    children: PropTypes.node,
    label: PropTypes.string,
    labelStyle: PropTypes.shape(),
    wrapperStyle: PropTypes.shape()
};

export default WrappedSelect;
