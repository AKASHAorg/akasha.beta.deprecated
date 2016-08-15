import React from 'react';
import { Paper } from 'material-ui';

export default class PanelContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            scrollTop: 0
        }
    }
    _handleScroll = () => {
        const scrollTop = this.refs.panelContent.scrollTop;
        this.setState({
            scrollTop,
            titleHeight: `${80 - (scrollTop / 1.5)}px`
        });
        
        // if (scrollTop > 0) {
        //     this.refs.panelTitle.style.boxShadow = '0px 3px 3px -1px rgba(0,0,0,0.2)';
        //     this.refs.panelTitle.style.height = `${80 - (scrollTop / 1.5)}px`;
        // } else {
        //     this.refs.panelTitle.style.boxShadow = 'none';
        // }
    };
    render () {
        let rootStyle = {
            position: 'relative',
            width: '100%',
            zIndex: 10,
            height: '100%',
            maxWidth: this.props.width
        };
        if (this.props.centered) {
            rootStyle.left = '50%';
            rootStyle.marginLeft = -1 * (this.props.width / 2);
        }
        return (
          <Paper
            style={Object.assign(rootStyle, this.props.style)}
          >
            <div
              className="row middle-xs"
              ref="panelTitle"
              style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  minHeight: 56,
                  height: this.state.titleHeight,
                  padding: '12px 24px',
                  background: '#FFF',
                  margin: 0,
                  zIndex: 10,
                  transition: 'all 0.118s ease-in-out',
                  boxShadow: (this.state.scrollTop > 0) ? '0px 3px 3px -1px rgba(0,0,0,0.2)': 'none',
                  borderBottom: (this.props.showBorder && this.state.scrollTop === 0) ? '1px solid #DDD': 'none'
              }}
            >
              {this.props.header &&
                 this.props.header
              }
              {!this.props.header &&
                <div className="col-xs-12">
                  <div className="row middle-xs">
                    <h3 className="col-xs-7" style={{ fontWeight: 300 }}>{this.props.title}</h3>
                    <div className="col-xs-4 end-xs">0.002 ETH</div>
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
              ref="panelContent"
              onScroll={this._handleScroll}
            >
              {this.props.children}
            </div>
            <div
              className="row"
              ref="panelActions"
              style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '12px 24px',
                  background: '#FFF',
                  margin: 0,
                  boxShadow: '0px -1px 3px -1px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="col-xs-6 start-xs">
                {this.props.leftActions}
              </div>
              <div className="col-xs-6 end-xs">
                {this.props.actions}
              </div>
            </div>
          </Paper>
        );
    }
}
PanelContainer.defaultProps = {
    width: 640
};
PanelContainer.propTypes = {
    actions: React.PropTypes.node,
    children: React.PropTypes.node,
    width: React.PropTypes.number,
    title: React.PropTypes.string
};
