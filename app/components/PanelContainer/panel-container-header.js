import React, { Component, PropTypes } from 'react';
import styles from './panel-container-header.scss';

class PanelContainerHeader extends Component {
    render() {
        const { header, showBorder, subTitle, title, shrinked, muiTheme,
        headerHeight, headerMinHeight, headerStyle, children } = this.props;
        return (
            <div
                className={`row middle-xs ${styles.root}`}
                style={{
                    minHeight: headerMinHeight,
                    height: `${shrinked ? headerHeight - 24 : headerHeight}px`,
                    background: muiTheme.palette.canvasColor,
                    boxShadow: shrinked ?
                        `0px 3px 3px -1px ${muiTheme.palette.paperShadowColor}` : 'none',
                    borderBottom: showBorder && !shrinked ?
                        `1px solid ${muiTheme.palette.borderColor}` : 'none',
                    ...headerStyle
                }}
            >
                <div className={`${styles.headerIcon} col-xs-2`}>ICON</div>
                <div className={`${styles.headerTitle} col-xs-10`}>
                    {children}
                    {!children &&
                        <div className="row middle-xs">
                            <h3 className="col-xs-8" style={{ fontWeight: 300 }}>{title}</h3>
                                {subTitle &&
                                    <div className="col-xs-4 end-xs">{subTitle}</div>
                                }
                        </div>  
                    }
                </div>
                {header && header}
            </div>
        );
    }
}

export default PanelContainerHeader;
