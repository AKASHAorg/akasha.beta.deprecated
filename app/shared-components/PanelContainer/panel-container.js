import React, { PropTypes } from 'react';
import { Paper } from 'material-ui';
import PanelContainerHeader from './panel-container-header';

class PanelContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isHeaderShrinked: false
        };
    }
    shouldComponentUpdate (nextProps, nextState) {
        return (nextState.isHeaderShrinked !== this.state.isHeaderShrinked) ||
        (this.props.children !== nextProps.children)
    }
    _handleScroll = () => {
        const scrollTop = this.panelContent.scrollTop;
        if(scrollTop >= 24) {
            this.setState({
                isHeaderShrinked: true
            });
        } else {
            this.setState({
                isHeaderShrinked: false
            });
        }
    };

    render () {
        const rootStyle = {
            position: 'relative',
            width: '100%',
            zIndex: 10,
            height: '100%',
            maxWidth: this.props.width
        };
        const { isHeaderShrinked } = this.state;
        const { header, title, subTitle, showBorder, headerHeight, headerMinHeight, headerStyle,
            contentStyle } = this.props;
        const { muiTheme } = this.context;
        return (
          <Paper
            style={Object.assign(rootStyle, this.props.style)}
          >
            <PanelContainerHeader
              header={header}
              title={title}
              subTitle={subTitle}
              shrinked={isHeaderShrinked}
              showBorder={showBorder}
              muiTheme={muiTheme}
              headerHeight={headerHeight}
              headerMinHeight={headerMinHeight}
              headerStyle={headerStyle}
            />
            <div
              className="row"
              style={Object.assign({
                  position: 'absolute',
                  top: 56,
                  bottom: 56,
                  left: 0,
                  right: 0,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  padding: '32px 24px',
                  margin: 0
              }, contentStyle)}
              ref={(panelContent) => { this.panelContent = panelContent; }}
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
              <div className="col-xs-5 start-xs">
                {this.props.leftActions}
              </div>
              <div className="col-xs-7 end-xs">
                {this.props.actions}
              </div>
            </div>
            }
          </Paper>
        );
    }
}
PanelContainer.defaultProps = {
    width: 640,
    headerHeight: 80,
    headerMinHeight: 56,
    headerStyle: {},
    contentStyle: {}
};
PanelContainer.propTypes = {
    actions: PropTypes.node,
    children: PropTypes.node,
    width: PropTypes.number,
    title: PropTypes.string,
    showBorder: PropTypes.bool,
    header: PropTypes.node,
    leftActions: PropTypes.node,
    style: PropTypes.shape(),
    subTitle: PropTypes.string,
    headerHeight: PropTypes.number,
    headerMinHeight: PropTypes.number,
    headerStyle: PropTypes.shape(),
    contentStyle: PropTypes.shape()
};

PanelContainer.contextTypes = {
    muiTheme: PropTypes.object.isRequired
};

export default PanelContainer;
