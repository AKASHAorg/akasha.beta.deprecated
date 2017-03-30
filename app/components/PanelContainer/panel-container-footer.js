import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import styles from './panel-container-footer.scss';

class PanelContainerFooter extends Component {
    render() {
        const { muiTheme, footerHeight } = this.props;
        return (
            <Paper
                rounded={false}
                className={`row ${styles.root}`}
                style={{
                    bottom: -1 * footerHeight
                }}
            >
                <div className={`${styles.leftActions}`}>
                    {this.props.children.leftActions}
                </div>
                <div className={`${styles.rightActions}`}>
                    {this.props.children}
                </div>
            </Paper>
        )
    }
}
PanelContainerFooter.defaultProps = {
    footerHeight: 60
}
export default PanelContainerFooter;
