import React, { Component, PropTypes } from 'react';
import {
    Paper,
    RaisedButton,
    Tabs,
    Tab,
    SelectField,
    MenuItem,
    IconMenu,
    IconButton,
    CircularProgress } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import throttle from 'lodash.throttle';
import { entryMessages, generalMessages } from 'locale-data/messages';
import { injectIntl } from 'react-intl';
import { isInViewport } from 'utils/domUtils';
import SearchBar from '../SearchBar/search-bar';
import DraftCard from '../DraftCard/draft-card';
import EntryCard from '../EntryCard/entry-card';
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
            draftActions.getDrafts(loggedProfileData.get('profile'));
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
                draftActions.getDrafts(loggedProfileData.get('profile'));
                // entryActions.clearPublishedEntries();
            }
            if (tabsValue === 'listed') {
                entryActions.entryProfileIterator(loggedProfileData.get('akashaId'), 0, LIMIT);
            }
        }
    }

    getTriggerRef = (element) => {
        this.trigger = element;
    }

    handleScroll = () => {
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
                router.push(`/${loggedProfileData.get('akashaId')}/draft/${entryId}`);
                break;
            default:
                break;
        }
    }
    _handleDraftDelete = (ev, draftId) => {
        const { draftActions } = this.props;
        draftActions.deleteDraft(draftId);
    }
    _handleNewEntry = () => {
        const { router } = this.context;
        const { appActions, loggedProfileData } = this.props;
        appActions.hidePanel();
        return router.push(`/${loggedProfileData.get('akashaId')}/draft/new`);
    }
    _getTabContent = () => {
        const { drafts, entryActions, fetchingPublishedEntries, fetchingMorePublishedEntries, intl,
            loggedProfileData, moreProfileEntries, publishedEntries } = this.props;
        let entities;
        switch (this.state.tabsValue) {
            case 'drafts':
                entities = drafts.filter(drft =>
                    drft.get('profile') === loggedProfileData.get('profile'))
                    .map((draft, key) =>
                      <DraftCard
                        key={key}
                        headerTitle={'Draft'}
                        lastUpdated={`Last update ${draft.get('status').updated_at}`}
                        headerActions={
                          <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                            <MenuItem
                              primaryText={intl.formatMessage(generalMessages.edit)}
                              onClick={ev => this._handleDraftEdit(ev, draft.get('id'))}
                              disabled
                            />
                            <MenuItem
                              primaryText={intl.formatMessage(generalMessages.delete)}
                              disabled
                              onClick={ev => this._handleDraftDelete(ev, draft.get('id'))}
                            />
                          </IconMenu>
                        }
                        title={draft.get('title')}
                        excerpt={draft.get('excerpt')}
                        wordCount={draft.get('wordCount')}
                        onTitleClick={ev => this._handleDraftEdit(ev, draft.get('id'))}
                      />
                    );
                break;
            case 'listed':
                entities =
                    <EntryListContainer
                      entries={publishedEntries}
                      cardStyle={{ width: 'auto' }}
                      fetchingEntries={fetchingPublishedEntries}
                      fetchingMoreEntries={fetchingMorePublishedEntries}
                      getTriggerRef={this.getTriggerRef}
                      moreEntries={moreProfileEntries}
                      style={{ display: 'block' }}
                    />
                break;
            // case 'unlisted':
            //     entities = entries.filter(entry =>
            //       (entry.get('akashaId') === loggedProfileData.get('akashaId')) && !entry.get('active'));
            //     break;
            default:
                break;
        }
        return <div>{entities}</div>;
    }
    render () {
        const tabStyle = {
            backgroundColor: '#FFF',
            color: '#444'
        };
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
                  inkBarStyle={{ backgroundColor: '#4285F4' }}
                >
                  <Tab label="Drafts" value="drafts" style={tabStyle} />
                  <Tab label="Listed" value="listed" style={tabStyle} />
                  <Tab label="Unlisted" value="unlisted" style={tabStyle} disabled />
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
              <div className="col-xs-12" style={{ padding: 0 }}>
                <div className="row middle-xs" style={{ margin: 0 }}>
                  <div className="col-xs-8">
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
                  <div className="col-xs-4">
                    <div style={{ textAlign: 'right' }}>
                      {/*
                      <div className="col-xs-5">Sort By</div>
                      <SelectField
                        className="col-xs-7"
                        value={this.state.sortByValue}
                        onChange={this._handleSortByValueChange}
                        style={{ width: '50px' }}
                      >
                        <MenuItem value="latest" primaryText="Latest" />
                        <MenuItem value="oldest" primaryText="Oldest" />
                      </SelectField>
                      */}
                      Sorted by latest
                    </div>
                  </div>
                </div>
              </div>
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
    fetchingMorePublishedEntries: PropTypes.bool,
    fetchingPublishedEntries: PropTypes.bool,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    moreProfileEntries: PropTypes.bool,
    publishedEntries: PropTypes.shape(),
    rootStyle: PropTypes.shape(),
};
NewEntryFormPanel.contextTypes = {
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
