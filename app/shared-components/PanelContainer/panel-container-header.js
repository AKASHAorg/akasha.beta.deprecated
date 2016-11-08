import React, { PropTypes } from 'react';

const PanelContainerHeader = (props) => {
    const { header, showBorder, subTitle, title, scrollTop, muiTheme,
        headerHeight, headerMinHeight, headerStyle } = props;
    return (
      <div
        className="row middle-xs"
        style={Object.assign({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            minHeight: headerMinHeight,
            height: `${headerHeight - (scrollTop / 1.5)}px`,
            padding: '12px 24px',
            background: muiTheme.palette.canvasColor,
            margin: 0,
            zIndex: 10,
            transition: 'height 0.118s ease-in-out',
            boxShadow: (scrollTop > 0) ?
                `0px 3px 3px -1px ${muiTheme.palette.paperShadowColor}` : 'none',
            borderBottom: (showBorder && scrollTop === 0) ?
                `1px solid ${muiTheme.palette.borderColor}` : 'none'
        }, headerStyle)}
      >
        {header && header}
        {!header &&
          <div className="col-xs-12">
            <div className="row middle-xs">
              <h3 className="col-xs-7" style={{ fontWeight: 300 }}>{title}</h3>
              {subTitle &&
                <div className="col-xs-4 end-xs">{subTitle}</div>
              }
            </div>
          </div>
        }
      </div>
    );
};

PanelContainerHeader.propTypes = {
    header: PropTypes.element,
    showBorder: PropTypes.bool,
    subTitle: PropTypes.string,
    title: PropTypes.string,
    scrollTop: PropTypes.number,
    muiTheme: PropTypes.shape().isRequired,
    headerHeight: PropTypes.number,
    headerMinHeight: PropTypes.number,
    headerStyle: PropTypes.shape()
};

export default PanelContainerHeader;
