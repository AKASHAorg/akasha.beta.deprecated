import React, { Component, PropTypes } from 'react';
import {
    Paper,
    RaisedButton,
    Tabs,
    Tab,
    MenuItem,
    IconMenu,
    IconButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import throttle from 'lodash.throttle';
import { generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { DataLoader } from 'shared-components';
import { injectIntl } from 'react-intl';
import { isInViewport } from 'utils/domUtils'; // eslint-disable-line import/no-unresolved, import/extensions
import DraftCard from '../DraftCard/draft-card';
import EntryListContainer from '../EntryList/new-entry-list-container';

const LIMIT = 6;

class NewEntryFormPanel extends Component {
    constructor (props) {
        super(props);

        this.lastListedEntryIndex = 0;
        this.trigger = null;
        this.container = null;
        this.state = {
            tabsValue: 'drafts',
            searchValue: '',
            sortByValue: 'latest'
        };
    }

    componentDidMount () {
        const { draftActions, drafts, draftsCount, loggedProfileData } = this.props;
        if (drafts.size !== draftsCount) {
            draftActions.getDrafts(loggedProfileData.get('akashaId'));
        }
        if (this.container) {
            this.container.addEventListener('scroll', throttle(this.handleScroll, 500));
        }
    }

    componentWillReceiveProps (nextProps) {
        const { publishedEntries } = nextProps;

        if (publishedEntries.size !== this.props.publishedEntries.size) {
            this.lastListedEntryIndex = publishedEntries.size > 0 ?
                publishedEntries.last().get('entryId') :
                0;
        }
    }

    componentWillUpdate (nextProps, nextState) {
        const { draftActions, entryActions, drafts, draftsCount, loggedProfileData } = this.props;
        const { tabsValue } = nextState;
        if (this.state.tabsValue !== tabsValue) {
            if (tabsValue === 'drafts' && drafts.size !== draftsCount) {
                draftActions.getDrafts(loggedProfileData.get('akashaId'));
            }
            if (tabsValue === 'listed') {
                entryActions.entryProfileIterator(loggedProfileData.get('akashaId'), 0, LIMIT);
            }
        }
    }

    getTriggerRef = (element) => {
        this.trigger = element;
    }

    handleScroll = () => { // eslint-disable-line consistent-return
        const { entryActions, loggedProfileData } = this.props;
        if (!this.trigger) {
            return null;
        }
        if (isInViewport(this.trigger)) {
            entryActions.moreEntryProfileIterator(loggedProfileData.get('akashaId'), this.lastListedEntryIndex, LIMIT);
        }
    }

    _handleTabsChange = (value) => {
        this.setState({
            tabsValue: value,
            isTabLoading: true
        });
    }
    _handleSearchChange = (ev) => {
        this.setState({
            searchValue: ev.target.value
        });
    }
    _handleSortByValueChange = (ev, value, payload) => {
        this.setState({
            sortByValue: payload
        });
    }
    _handleDraftEdit = (ev, entryId) => {
        const entryType = this.state.tabsValue;
        const { router } = this.context;
        const { appActions, loggedProfileData } = this.props;
        appActions.hidePanel();
        switch (entryType) {
            case 'drafts':
                router.replace(`/${loggedProfileData.get('akashaId')}/draft/${entryId}`);
                break;
            default:
                break;
        }
    }
    _handleDraftDelete = (id) => {
        const { draftActions, params } = this.props;
        const { draftId } = params;
        draftActions.deleteDraft(id);
        if (draftId === id.toString()) {
            this.context.router.push(`/${params.akashaId}/explore/tag`);
        }
    }
    _handleNewEntry = () => {
        const { router } = this.context;
        const { appActions, loggedProfileData } = this.props;
        appActions.hidePanel();
        return router.replace(`/${loggedProfileData.get('akashaId')}/draft/new`);
    }
    _getDraftCards = () => {
        const { drafts, intl, loggedProfileData } = this.props;
        return drafts.filter(drft => drft.get('akashaId') === loggedProfileData.get('akashaId'))
            .map((draft, key) =>
              <DraftCard
                key={key}
                headerTitle={'Draft'}
                lastUpdated={`Last update ${intl.formatRelative(new Date(draft.get('updated_at')))}`}
                title={draft.getIn(['content', 'title'])}
                excerpt={draft.getIn(['content', 'excerpt'])}
                wordCount={draft.getIn(['content', 'wordCount'])}
                onDelete={() => this._handleDraftDelete(draft.get('id'))}
                onTitleClick={ev => this._handleDraftEdit(ev, draft.get('id'))}
              />
            );
    }
    _getTabContent = () => {
        const { drafts, fetchingDrafts, fetchingPublishedEntries,
            fetchingMorePublishedEntries, moreProfileEntries,
            publishedEntries } = this.props;
        const { palette } = this.context.muiTheme;
        switch (this.state.tabsValue) {
            case 'drafts':
                return (<DataLoader
                  flag={fetchingDrafts}
                  timeout={300}
                  size={80}
                  style={{ paddingTop: '120px' }}
                >
                  <div>
                    {drafts && drafts.size > 0 ?
                        this._getDraftCards() :
                        <div
                          style={{
                              display: 'flex',
                              justifyContent: 'center',
                              color: palette.disabledColor,
                              paddingTop: '10px'
                          }}
                        >
                          No drafts found
                        </div>
                    }
                  </div>
                </DataLoader>);
            case 'listed':
                return (
                  <EntryListContainer
                    entries={publishedEntries}
                    cardStyle={{ width: 'auto' }}
                    fetchingEntries={fetchingPublishedEntries}
                    fetchingMoreEntries={fetchingMorePublishedEntries}
                    getTriggerRef={this.getTriggerRef}
                    moreEntries={moreProfileEntries}
                    style={{ display: 'block' }}
                  />
                );
            default:
                return null;
        }
    }
    render () {
        const { drafts, publishedEntries } = this.props;
        const { palette } = this.context.muiTheme;
        const tabStyle = {
            backgroundColor: '#FFF',
            color: '#444'
        };
        const hasEntries = this.state.tabsValue === 'drafts' ?
            drafts.size > 0 :
            publishedEntries.size > 0;
        return (
          <Paper style={this.props.rootStyle}>
            <div
              className="row"
              style={{
                  borderBottom: '1px solid #DDD',
                  padding: '12px 24px 0',
                  margin: 0,
              }}
            >
              <div className="col-xs-8">
                <Tabs
                  value={this.state.tabsValue}
                  onChange={this._handleTabsChange}
                  inkBarStyle={{ backgroundColor: palette.primary1Color }}
                >
                  <Tab label="Drafts" value="drafts" style={tabStyle} />
                  <Tab label="Listed" value="listed" style={tabStyle} />
                  <Tab
                    label={<span style={{ color: palette.disabledColor }}>Unlisted</span>}
                    value="unlisted"
                    style={{ cursor: 'not-allowed', ...tabStyle }}
                    disabled
                  />
                </Tabs>
              </div>
              <div className="col-xs-4 end-xs">
                <RaisedButton label="new entry" primary onTouchTap={this._handleNewEntry} />
              </div>
            </div>
            <div
              className="row"
              style={{
                  margin: 0,
                  padding: '0 18px',
                  position: 'absolute',
                  top: 61,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  overflowY: 'auto'
              }}
              ref={(el) => { this.container = el; }}
            >
              {hasEntries &&
                <div className="col-xs-12" style={{ padding: '15px' }}>
                  {/* <div className="col-xs-8">
                    <SearchBar
                        hintText={
                        `Search
                            ${this.state.tabsValue}
                            ${this.state.tabsValue === 'drafts' ? '' : 'entries'}`
                        }
                        onChange={() => null}
                        showCancelButton={(this.state.searchValue.length > 0)}
                        value={this.state.searchValue}
                        searchIconStyle={{
                            marginRight: '-24px',
                            marginBottom: '-19px',
                            height: '48px'
                        }}
                    />
                    </div>
                  */}
                  Sorted by latest
                </div>
              }
              <div className="col-xs-12" style={{ height: 'calc(100% - 56px)' }}>
                {/** this.state.isTabLoading &&
                  <div className="center-xs" style={{ paddingTop: '12.5%' }}>
                    <CircularProgress />
                  </div>
                **/}
                <div style={{ overflow: 'hidden', minHeight: '400px' }}>
                  {this._getTabContent()}
                </div>
              </div>
            </div>
          </Paper>
        );
    }
}
NewEntryFormPanel.propTypes = {
    appActions: PropTypes.shape(),
    draftActions: PropTypes.shape(),
    drafts: PropTypes.shape(),
    draftsCount: PropTypes.number,
    entryActions: PropTypes.shape(),
    fetchingDrafts: PropTypes.bool,
    fetchingMorePublishedEntries: PropTypes.bool,
    fetchingPublishedEntries: PropTypes.bool,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    moreProfileEntries: PropTypes.bool,
    publishedEntries: PropTypes.shape(),
    rootStyle: PropTypes.shape(),
};
NewEntryFormPanel.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};
NewEntryFormPanel.defaultProps = {
    rootStyle: {
        height: '100%',
        width: 480,
        zIndex: 10,
        position: 'relative',
        borderRadius: 0
    }
};
export default injectIntl(NewEntryFormPanel);
