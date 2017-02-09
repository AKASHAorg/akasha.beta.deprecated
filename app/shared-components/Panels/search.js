import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { IconButton, Paper, Tab, Tabs, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import { DataLoader, EntryListContainer } from 'shared-components';
import { searchMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import throttle from 'lodash.throttle';
import { isInViewport } from 'utils/domUtils'; // eslint-disable-line import/no-unresolved, import/extensions

const PAGE_SIZE = 5;
const QUERY_LENGTH_LIMIT = 32;
const QUERY_LENGTH_ERROR = 'queryLengthError';
const HANDSHAKE_ERROR_CODE = 'HE01';

class SearchPanel extends Component {
    constructor (props) {
        super(props);

        this.scrollHandlerAdded = false;
        this.container = null;
        this.trigger = null;
        this.state = {
            activeTab: 'entries',
            query: this.props.query || '',
            queryError: null
        };
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.handshakePending && this.props.handshakePending) {
            ReactTooltip.hide();
        }
        if (!this.scrollHandlerAdded && this.container) {
            this.container.addEventListener('scroll', throttle(this.handleScroll, 500));
            this.scrollHandlerAdded = true;
        }
    }

    onQueryChange = (ev) => {
        if (ev.target.value.length > QUERY_LENGTH_LIMIT) {
            return this.setState({
                queryError: QUERY_LENGTH_ERROR
            });
        }
        return this.setState({
            query: ev.target.value,
            queryError: null
        });
    };

    onQueryBlur = (ev) => {
        this.setState({
            queryError: null
        });
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        this.scrollHandlerAdded = false;
        this.sendQuery();
    }

    getTriggerRef = (element) => {
        this.trigger = element;
    }

    handleScroll = () => {
        const { currentSearchPage, searchActions } = this.props;
        const offset = currentSearchPage * PAGE_SIZE;
        if (!this.trigger) {
            return null;
        }
        if (isInViewport(this.trigger)) {
            searchActions.moreQuery(this.state.query, offset);
        }
    };

    sendQuery = () => {
        if (this.state.query.trim()) {
            this.props.searchActions.query(this.state.query.trim());
        }
    }

    resetResults = () => {
        const { searchActions } = this.props;
        searchActions.resetResults();
        this.setState({
            query: '',
            queryError: null
        });
    }

    retryHandshake = () => {
        const { searchActions } = this.props;
        searchActions.handshake();
    };

    renderServiceMessage = () => {
        const { consecQueryErrors, handshakePending, intl, searchService } = this.props;
        let message;
        if (handshakePending) {
            message = searchMessages.connectingToService;
        } else if (!searchService) {
            message = searchMessages.serviceError;
        } else if (consecQueryErrors >= 3) {
            message = searchMessages.tryToReconnect;
        }
        return (
          <div
            style={{
                padding: '0 30px',
                display: 'flex',
                alignItems: 'center',
                height: '30px',
                margin: '20px 0'
            }}
          >
            {intl.formatMessage(message)}
            {!handshakePending && message &&
              <RefreshIcon
                data-tip="Retry"
                style={{
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    padding: '3px'
                }}
                onClick={this.retryHandshake}
              />
            }
          </div>
        );
    }

    render () {
        const { consecQueryErrors, currentSearchPage, handshakePending, intl, moreQueryPending,
            queryPending, searchErrors, searchResults, searchResultsCount, searchService,
            showResults, totalSearchPages } = this.props;
        const { activeTab, query, queryError } = this.state;
        const { palette } = this.context.muiTheme;
        const showServiceMessage = !searchService || handshakePending || consecQueryErrors >= 3;
        let errorMessage;
        if (queryError) {
            errorMessage = intl.formatMessage(searchMessages[queryError]);
        } else if (searchErrors.size > 0) {
            const error = searchErrors.find(err => err.code !== HANDSHAKE_ERROR_CODE);
            errorMessage = error && error.message;
        }
        return (
          <Paper
            style={{
                width: '707px',
                zIndex: 10,
                position: 'relative',
                height: '100%',
                borderRadius: 0
            }}
          >
            <div style={{ padding: '30px 30px 10px', height: '88px', position: 'relative' }}>
              <form onSubmit={this.onSubmit}>
                <TextField
                  autoFocus
                  disabled={queryPending || !searchService || handshakePending}
                  errorText={errorMessage}
                  errorStyle={{ position: 'absolute', bottom: '-8px' }}
                  fullWidth
                  hintText="Search"
                  hintStyle={{ fontWeight: 300 }}
                  id="searchInput"
                  onBlur={this.onQueryBlur}
                  onChange={this.onQueryChange}
                  style={{ fontSize: '20px' }}
                  value={query}
                />
                {query.trim() &&
                  <IconButton
                    disabled={queryPending || !searchService || handshakePending}
                    iconStyle={{ height: '18px', width: '18px' }}
                    style={{ position: 'absolute', right: 30, bottom: 10 }}
                    onClick={this.resetResults}
                  >
                    <CloseIcon />
                  </IconButton>
                }
              </form>
            </div>
            {showServiceMessage && this.renderServiceMessage()}
            {!showServiceMessage && (showResults || queryPending) &&
              <DataLoader flag={queryPending} timeout={200}>
                <div style={{ height: 'calc(100% - 88px)' }}>
                  <div style={{ borderBottom: '1px solid #DDD', paddingLeft: '30px' }}>
                    <Tabs
                      value={activeTab}
                      tabItemContainerStyle={{ backgroundColor: 'transparent', width: '340px' }}
                      inkBarStyle={{ backgroundColor: palette.primary1Color }}
                    >
                      <Tab
                        label={`Entries (${searchResultsCount})`}
                        value="entries"
                        style={{ color: palette.textColor }}
                      />
                      <Tab
                        label={<div data-tip="Coming soon">People</div>}
                        value="people"
                        style={{ color: palette.disabledColor, cursor: 'not-allowed' }}
                        disabled
                      />
                    </Tabs>
                  </div>
                  <div
                    style={{ height: 'calc(100% - 49px)', paddingTop: '20px', overflowY: 'auto' }}
                    ref={(el) => { this.container = el; }}
                  >
                    <EntryListContainer
                      defaultTimeout={0}
                      entries={searchResults}
                      fetchingEntries={queryPending}
                      fetchingMoreEntries={moreQueryPending}
                      getTriggerRef={this.getTriggerRef}
                      moreEntries={currentSearchPage < totalSearchPages}
                      placeholderMessage={'No results found'}
                    />
                  </div>
                </div>
              </DataLoader>
            }
          </Paper>
        );
    }
}

SearchPanel.contextTypes = {
    muiTheme: PropTypes.shape()
};

SearchPanel.propTypes = {
    consecQueryErrors: PropTypes.number,
    currentSearchPage: PropTypes.number,
    handshakePending: PropTypes.bool,
    intl: PropTypes.shape(),
    moreQueryPending: PropTypes.bool,
    query: PropTypes.string,
    queryPending: PropTypes.bool,
    searchActions: PropTypes.shape(),
    searchErrors: PropTypes.shape(),
    searchResults: PropTypes.shape(),
    searchResultsCount: PropTypes.number,
    searchService: PropTypes.bool,
    showResults: PropTypes.bool,
    totalSearchPages: PropTypes.number,
};

export default injectIntl(SearchPanel);
