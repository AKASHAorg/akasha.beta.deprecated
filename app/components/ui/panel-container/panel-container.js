import React from 'react';
import { Paper } from 'material-ui';

export default class PanelContainer extends React.Component {
    _handleScroll = () => {
        const scrollTop = this.refs.panelContent.scrollTop;
        if (scrollTop > 0) {
            this.refs.panelTitle.style.boxShadow = '0px 3px 3px -1px rgba(0,0,0,0.2)';
            this.refs.panelTitle.style.height = `${96 - (scrollTop / 1.5)}px`;
        } else {
            this.refs.panelTitle.style.boxShadow = 'none';
        }
    }
    render () {
        return (
          <Paper
            style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                marginLeft: '-320px',
                bottom: 0,
                width: (this.props.width || 640),
                zIndex: 10,
                height: '100%',
            }}
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
                  height: 96,
                  padding: '12px 24px',
                  background: '#FFF',
                  margin: 0,
                  zIndex: 10,
                  transition: 'all 0.118s ease-in-out'
              }}
            >
              <h3 className="col-xs-7" style={{ fontWeight: 300 }}>{this.props.title}</h3>
              <div className="col-xs-4 end-xs">0.002 ETH</div>
            </div>
            <div
              className="row"
              style={{
                  position: 'absolute',
                  top: 64,
                  bottom: 64,
                  left: 0,
                  right: 0,
                  overflowY: 'auto',
                  overFlowX: 'hidden',
                  padding: '24px',
                  margin: 0
              }}
              ref="panelContent"
              onScroll={this._handleScroll}
            >
              {this.props.children}
            </div>
            <div
              className="row end-xs"
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
              {this.props.actions}
            </div>
          </Paper>
        );
    }
}

PanelContainer.propTypes = {
    actions: React.PropTypes.node,
    children: React.PropTypes.node,
    width: React.PropTypes.number,
    title: React.PropTypes.string
};
