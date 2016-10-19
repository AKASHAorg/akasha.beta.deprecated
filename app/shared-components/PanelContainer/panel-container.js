import React, { PropTypes } from 'react';
import { Paper } from 'material-ui';

class PanelContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            scrollTop: 0
        };
    }
    _handleScroll = () => {
        const scrollTop = this.panelContent.scrollTop;
        this.setState({
            scrollTop,
            titleHeight: `${80 - (scrollTop / 1.5)}px`
        });
    };
    render () {
        const rootStyle = {
            position: 'relative',
            width: '100%',
            zIndex: 10,
            height: '100%',
            maxWidth: this.props.width
        };
        const { muiTheme } = this.context;
        return (
          <Paper
            style={Object.assign(rootStyle, this.props.style)}
            zDepth={2}
          >
            <div
              className="row middle-xs"
              style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  minHeight: 56,
                  height: this.state.titleHeight,
                  padding: '12px 24px',
                  background: muiTheme.palette.canvasColor,
                  margin: 0,
                  zIndex: 10,
                  transition: 'height 0.118s ease-in-out',
                  boxShadow: (this.state.scrollTop > 0) ?
                      `0px 3px 3px -1px ${muiTheme.palette.paperShadowColor}` : 'none',
                  borderBottom: (this.props.showBorder && this.state.scrollTop === 0) ?
                      `1px solid ${muiTheme.palette.borderColor}` : 'none'
              }}
            >
              {this.props.header &&
                 this.props.header
              }
              {!this.props.header &&
                <div className="col-xs-12">
                  <div className="row middle-xs">
                    <h3 className="col-xs-7" style={{ fontWeight: 300 }}>{this.props.title}</h3>
                      {this.props.subTitle &&
                        <div className="col-xs-4 end-xs">{this.props.subTitle}</div>
                      }
                  </div>
                </div>
              }
            </div>
            <div
              className="row"
              style={{
                  position: 'absolute',
                  top: 56,
                  bottom: 56,
                  left: 0,
                  right: 0,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  padding: '32px 24px',
                  margin: 0
              }}
              ref={(panelContent) => this.panelContent = panelContent}
              onScroll={this._handleScroll}
            >
              {this.props.children}
            </div>
              {(this.props.leftActions || this.props.actions) &&
                <div
                  className="row"
                  style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '12px 24px',
                      background: muiTheme.palette.canvasColor,
                      margin: 0,
                      boxShadow: `0px -1px 3px -1px ${muiTheme.palette.paperShadowColor}`
                  }}
                >
                  <div className="col-xs-6 start-xs">
                      {this.props.leftActions}
                  </div>
                  <div className="col-xs-6 end-xs">
                      {this.props.actions}
                  </div>
                </div>
              }
          </Paper>
        );
    }
}
PanelContainer.defaultProps = {
    width: 640
};
PanelContainer.propTypes = {
    actions: PropTypes.node,
    children: PropTypes.node,
    width: PropTypes.number,
    title: PropTypes.string,
    showBorder: PropTypes.bool,
    header: PropTypes.node,
    leftActions: PropTypes.node,
    style: PropTypes.object,
    subTitle: PropTypes.string
};

PanelContainer.contextTypes = {
    muiTheme: PropTypes.object.isRequired
};

export default PanelContainer;
