import PropTypes from 'prop-types';
import React from 'react';
import { InputNumber } from 'antd';
import styles from './input.scss';

const WrappedInputNumber = ({ label, labelStyle, wrapperStyle, ...props }) => (
    <div className={ `${ styles.root } ${ label && styles.withLabel }` } style={ wrapperStyle }>
        { label &&
        <div className={ styles.label } style={ labelStyle }>
            { label }
        </div>
        }
        <InputNumber { ...props } />
    </div>
);

WrappedInputNumber.propTypes = {
    label: PropTypes.string,
    labelStyle: PropTypes.shape(),
    wrapperStyle: PropTypes.shape()
};

export default WrappedInputNumber;
