import React, { Component } from 'react';
import { EntryActions } from 'local-flux';
import { connect } from 'react-redux';
import TheStream from './components/stream';
import StreamMenu from './components/stream-menu';
import StreamSidebar from './components/stream-sidebar';

class StreamPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            filter: 'stream'
        };
    }
    _handleFilterChange = (val) => {
        const { params } = this.props;
        if (val === this.state.filter) {
          return;
        }
        this.setState({
            filter: val
        }, () => {
            this.context.router.push(`/${params.username}/explore/${val}`);
        });
    };
    render () {
        return (
          <div style={{ height: '100%' }}>
            <div
              style={{
                  zIndex: 10,
                  position: 'fixed',
                  top: 0,
                  left: 64,
                  right: 0,
                  height: 56
              }}
            >
              <StreamMenu
                activeTab={this.state.filter}
                onChange={this._handleFilterChange}
                routeParams={this.props.params}
              />
            </div>
            <div className="row" style={{ marginTop: 45, height: '100%' }}>
              <div className="col-xs-12" style={{ height: '100%' }}>
                <div className="row" style={{ height: '100%' }}>
                  <div className="col-xs-8" style={{ height: '100%', position: 'relative' }}>
                    <TheStream
                      filter={this.state.filter}
                      {...this.props}
                    >
                      {this.props.children}
                    </TheStream>
                  </div>
                  <div
                    className="col-xs-4"
                    style={{ backgroundColor: '#F5F5F5', minHeight: '100%' }}
                  >
                    <StreamSidebar params={this.props.params} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

StreamPage.propTypes = {
    entryActions: React.PropTypes.object,
    children: React.PropTypes.node,
    params: React.PropTypes.object
};

StreamPage.contextTypes = {
    router: React.PropTypes.object
};

function mapStateToProps (state) {
    return {
        entryState: state.entryState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        entryActions: new EntryActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StreamPage);
