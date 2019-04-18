import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './panel-container-header.scss';

class PanelContainerHeader extends Component {
    render () {
        const {
            header,
            showBorder,
            subTitle,
            title,
            icon,
            shrinked,
            muiTheme,
            headerHeight,
            headerMinHeight,
            headerStyle,
            children,
            headerActions
        } = this.props;
        return (
            <div
                className={ `row middle-xs ${ styles.root }` }
                style={ {
                    minHeight: headerMinHeight,
                    height: `${ shrinked ? headerHeight - 24 : headerHeight }px`,
                    background: muiTheme.palette.canvasColor,
                    boxShadow: shrinked ? `0px 3px 3px -1px ${ muiTheme.palette.paperShadowColor }` : 'none',
                    borderBottom:
                        showBorder && !shrinked ? `1px solid ${ muiTheme.palette.borderColor }` : 'none',
                    ...headerStyle
                } }
            >
                { icon && <div className={ `${ styles.headerIcon } col-xs-2` }>{ icon }</div> }
                <div className={ `${ styles.headerTitle } col-xs-12` }>
                    { children && children }
                    { !children && (
                        <div className="row middle-xs">
                            <div className="col-xs-8">
                                <div className="row">
                                    <h3
                                        className={ `col-xs-12 start-xs ${ styles.title }` }
                                        style={ { fontWeight: 300 } }
                                    >
                                        { title }
                                    </h3>
                                    { subTitle && (
                                        <div
                                            className={ `col-xs-12 start-xs ${ styles.subtitle }` }>
                                            { subTitle }
                                        </div>
                                    ) }
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <div className="row">{ headerActions && headerActions }</div>
                            </div>
                        </div>
                    ) }
                </div>
                { header && header }
            </div>
        );
    }
}

PanelContainerHeader.propTypes = {
    children: PropTypes.node,
    header: PropTypes.node,
    headerActions: PropTypes.node,
    headerHeight: PropTypes.number,
    headerMinHeight: PropTypes.number,
    headerStyle: PropTypes.shape(),
    icon: PropTypes.node,
    muiTheme: PropTypes.shape(),
    showBorder: PropTypes.bool,
    shrinked: PropTypes.bool,
    subTitle: PropTypes.node,
    title: PropTypes.node
};
PanelContainerHeader.defaultProps = {
    headerHeight: 64,
    headerMinHeight: 56,
    shrinked: false,
    subTitle: '',
    showBorder: false
};

export default PanelContainerHeader;
