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
    componentWillMount () {
        this._handleFilterChange(this.props.params.filter);
        this._fetchEntries(this.props, this.state);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.params.filter !== this.state.filter) {
            this._handleFilterChange(nextProps.params.filter);
        }
    }

    componentWillUpdate (nextProps, nextState) {
        if (nextState.filter === this.state.filter) {
            return;
        }
        this._fetchEntries(nextProps, nextState);
    }
    _fetchEntries = (props, state) => {
        const { entryActions, profileState, params } = props;
        const loggedProfile = profileState.get('loggedProfile');
        const { filter } = state;
        switch (filter) {
            case 'top':
                return entryActions.getSortedEntries({ sortBy: 'rating' });
            case 'saved':
                return entryActions.getSavedEntries(loggedProfile.get('userName'));
            case 'tag':
                return entryActions.getEntriesForTag({ tagName: params.tagName });
            default: // 'stream'
                return entryActions.getSortedEntries({ sortBy: 'date' });
        }
    }
    _handleTabActivation = (tab) => {
        const { params } = this.props;
        this.context.router.push(`/${params.username}/explore/${tab.props.value}`);
    }
    _handleFilterChange = (val) => {
        if (val === this.state.filter) return;
        this.setState({
            filter: val
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
                onActive={this._handleTabActivation}
              />
            </div>
            <div className="row" style={{ marginTop: 45, height: '100%' }}>
              <div className="col-xs-12" style={{ height: '100%' }}>
                <div className="row" style={{ height: '100%' }}>
                  <div className="col-xs-8" style={{ height: '100%', position: 'relative' }}>
                    <TheStream
                      filter={this.state.filter}
                      {...this.props}
                    />
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
        entryState: state.entryState,
        profileState: state.profileState
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
