import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Icon } from './';

const PlusSquareIcon = props => (
  <div className={classNames('flex-center plus-square-icon', { 'content-link': !props.disabled })}>
    <Icon type="plus" />
  </div>
);

PlusSquareIcon.propTypes = {
    disabled: PropTypes.bool
};

export default PlusSquareIcon;
