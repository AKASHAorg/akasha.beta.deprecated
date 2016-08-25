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
        this.setState({
            filter: val
        });
    };
    render () {
        return (
          <div>
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
              />
            </div>
            <div className="row" style={{ marginTop: 45 }}>
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-8">
                    <TheStream filter={this.state.filter} />
                  </div>
                  <div className="col-xs-4">
                    <StreamSidebar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

StreamPage.propTypes = {
    entryActions: React.PropTypes.object
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
