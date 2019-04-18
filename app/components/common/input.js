import PropTypes from 'prop-types';
import React from 'react';
import { Input } from 'antd';
import styles from './input.scss';

const WrappedInput = ({ getInputRef, label, labelStyle, wrapperStyle, ...props }) => (
    <div className={ `${ styles.root } ${ label && styles.withLabel }` } style={ wrapperStyle }>
        { label &&
        <div className={ styles.label } style={ labelStyle }>
            { label }
        </div>
        }
        <Input ref={ getInputRef || null } { ...props } />
    </div>
);

WrappedInput.propTypes = {
    getInputRef: PropTypes.func,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
    labelStyle: PropTypes.shape(),
    wrapperStyle: PropTypes.shape()
};

export default WrappedInput;
