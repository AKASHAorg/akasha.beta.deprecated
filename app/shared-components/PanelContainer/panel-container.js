import React, { PropTypes } from 'react';
import { Paper } from 'material-ui';
import PanelContainerHeader from './panel-container-header';

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
            scrollTop
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
        const { scrollTop } = this.state;
        const { header, title, subTitle, showBorder } = this.props;
        const { muiTheme } = this.context;
        return (
          <Paper
            style={Object.assign(rootStyle, this.props.style)}
          >
            <PanelContainerHeader
              header={header}
              title={title}
              subTitle={subTitle}
              scrollTop={scrollTop}
              showBorder={showBorder}
              muiTheme={muiTheme}
            />
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
    style: PropTypes.shape(),
    subTitle: PropTypes.string
};

PanelContainer.contextTypes = {
    muiTheme: PropTypes.object.isRequired
};

export default PanelContainer;
