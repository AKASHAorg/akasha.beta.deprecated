import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'antd';
import styles from './panel-container-footer.scss';

const PanelContainerFooter = (props) => {
    const { footerHeight, children, leftActions, className } = props;
    return (
      <div
        className={`row ${styles.root} ${className}`}
      >
        <div className={`${styles.leftActions}`}>
          {leftActions}
        </div>
        <div className={`${styles.rightActions}`}>
          {children}
        </div>
      </div>
    );
};

PanelContainerFooter.propTypes = {
    footerHeight: PropTypes.number,
    children: PropTypes.node,
    leftActions: PropTypes.node,
    className: PropTypes.string,
};
PanelContainerFooter.defaultProps = {
    footerHeight: 60
};
export default PanelContainerFooter;
