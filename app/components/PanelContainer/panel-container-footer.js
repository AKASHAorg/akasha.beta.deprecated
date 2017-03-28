import React, { Component, PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import styles from './panel-container-footer.scss';

class PanelContainerFooter extends Component {
    render() {
        const { muiTheme } = this.props;
        return (
            <div
                className={`row ${styles.root}`}
                style={{
                    background: muiTheme.palette.canvasColor,
                    boxShadow: `0px -1px 3px -1px ${muiTheme.palette.paperShadowColor}`
                }}
            >
                <div className={`${styles.leftActions}`}>
                    {this.props.children.leftActions}
                </div>
                <div className={`${styles.rightActions}`}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default PanelContainerFooter;
