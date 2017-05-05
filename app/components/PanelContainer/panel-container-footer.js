import PropTypes from 'prop-types';
import React from 'react';
import Paper from 'material-ui/Paper';
import styles from './panel-container-footer.scss';

const PanelContainerFooter = (props) => {
    const { footerHeight, children, leftActions } = props;
    return (
      <Paper
        rounded={false}
        className={`row ${styles.root}`}
      >
        <div className={`${styles.leftActions}`}>
          {leftActions}
        </div>
        <div className={`${styles.rightActions}`}>
          {children}
        </div>
      </Paper>
    );
};

PanelContainerFooter.propTypes = {
    footerHeight: PropTypes.number,
    children: PropTypes.node,
    leftActions: PropTypes.node
};
PanelContainerFooter.defaultProps = {
    footerHeight: 60
};
export default PanelContainerFooter;
