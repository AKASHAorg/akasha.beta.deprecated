import React, { Component, PropTypes } from 'react';
import {
    Paper,
    RaisedButton,
    Tabs,
    Tab,
    SelectField,
    MenuItem,
    Card,
    CardText,
    IconMenu,
    IconButton,
    CircularProgress } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { entryMessages, generalMessages } from 'locale-data/messages';
import { injectIntl, FormattedRelative } from 'react-intl';
import SearchBar from '../SearchBar/search-bar';
import EntryCard from '../EntryCard/entry-card';

class NewEntryFormPanel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tabsValue: 'drafts',
            searchValue: '',
            sortByValue: 'latest'
        };
    }
    componentDidMount () {
        const { draftActions, drafts, draftsCount, loggedProfile } = this.props;
        if (drafts.size !== draftsCount) {
            draftActions.getDrafts(loggedProfile.get('profile'));
        }
    }
    componentWillUpdate (nextProps, nextState) {
        const { draftActions, entryActions, drafts, draftsCount, entriesCount, entries,
            loggedProfile } = this.props;
        const { tabsValue } = nextState;
        const profileEntries = entries.filter(entry => entry.get('address') === loggedProfile.get('profile'));
        console.log('try to get', tabsValue, entriesCount, profileEntries);
        if (this.state.tabsValue !== tabsValue) {
            if (tabsValue === 'drafts' && drafts.size !== draftsCount) {
                draftActions.getDrafts(loggedProfile.get('profile'));
            }
            if (tabsValue === 'listed' && profileEntries.size < entriesCount) {
                console.log('start entries request!!');
                entryActions.getProfileEntries(loggedProfile.get('akashaId'));
            }
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
    _handleEntryEdit = (ev, entryId) => {
        const entryType = this.state.tabsValue;
        const { router } = this.context;
        const { appActions, loggedProfile } = this.props;
        appActions.hidePanel();
        switch (entryType) {
            case 'drafts':
                router.push(`/${loggedProfile.get('akashaId')}/draft/${entryId}`);
                break;
            default:
                break;
        }
    }
    _handleNewEntry = () => {
        const { router } = this.context;
        const { appActions, loggedProfile } = this.props;
        appActions.hidePanel();
        return router.push(`/${loggedProfile.get('akashaId')}/draft/new`);
    }
    _getTabContent = () => {
        const { entries, drafts, loggedProfile, intl } = this.props;
        let entities;
        switch (this.state.tabsValue) {
            case 'drafts':
                entities = drafts.filter(drft => drft.get('profile') === loggedProfile.get('profile'));
                break;
            case 'listed':
                entities = entries.filter(entry =>
                  (entry.get('akashaId') === loggedProfile.get('akashaId')) && entry.get('active'))
                  .map((entry, key) =>
                    <EntryCard
                      key={key}
                      headerTitle={`Listed`}
                      publishedDate={`published ${entry.get('entryEth').blockNr} blocks ago`}
                      headerActions={
                        <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                          <MenuItem
                            primaryText={intl.formatMessage(generalMessages.edit)}
                            onClick={ev => this._handleEntryEdit(ev, entry.get('entryId'))}
                          />
                          <MenuItem primaryText={intl.formatMessage(generalMessages.delete)} />
                        </IconMenu>}
                      title={entry.get('content').title}
                      excerpt={entry.get('content').excerpt}
                      wordCount={610}
                    />);
                break;
            case 'unlisted':
                entities = entries.filter(entry =>
                  (entry.get('akashaId') === loggedProfile.get('akashaId')) && !entry.get('active'));
                break;
            default:
                break;
        }

        // const entryCards = entities.map((card, key) =>
        //   <Card key={key} style={{ marginBottom: 8 }}>
        //     <div className="row" style={{ padding: '4px 16px' }}>
        //       <div className="col-xs-12">
        //         <div className="row middle-xs">
        //           <div className="col-xs start-xs">
        //             <h4 style={{ margin: '8px 0' }}>{intl.formatMessage(entryMessages.draft)}</h4>
        //             <h5 style={{ margin: '8px 0' }}>
        //               {intl.formatMessage(entryMessages.draftCardSubtitle, {
        //                   lastUpdate: <FormattedRelative value={card.get('status').updated_at} />,
        //                   wordCount: card.get('wordCount')
        //               })}
        //             </h5>
        //           </div>
        //           <div className="col-xs end-xs">
        //             <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
        //               <MenuItem
        //                 primaryText={intl.formatMessage(generalMessages.edit)}
        //                 onClick={ev => this._handleEntryEdit(ev, card.id)}
        //               />
        //               <MenuItem primaryText={intl.formatMessage(generalMessages.delete)} />
        //             </IconMenu>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //     <CardText>
        //       <h2
        //         onClick={ev => this._handleEntryEdit(ev, card.id)}
        //         style={{ cursor: 'pointer' }}
        //       >
        //         {card.title && card.title}
        //         {!card.title && 'No Title'}
        //       </h2>
        //     </CardText>
        //     <CardText>
        //       <p>{card.excerpt}</p>
        //       <div>
        //         {card.get('status').publishing &&
        //           <div className="row middle-xs">
        //             <div className="col-xs-1 end-xs">
        //               <CircularProgress size={20} thickness={2} />
        //             </div>
        //             <div className="col-xs">
        //               Publishing...
        //             </div>
        //           </div>
        //         }
        //       </div>
        //     </CardText>
        //   </Card>
        // );
        return (
          <div>{entities}</div>
        );
    }
    render () {
        const tabStyle = {
            backgroundColor: '#FFF',
            color: '#444'
        };
        console.log(this.props.entries, 'entries in render');
        return (
          <Paper style={this.props.rootStyle}>
            <div
              className="row"
              style={{
                  borderBottom: '1px solid #DDD',
                  padding: '12px 24px 0',
                  margin: 0
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
                  <Tab label="Unlisted" value="unlisted" style={tabStyle} />
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
                  overflowY: 'auto'
              }}
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
                      onChange={this._handleSearchChange}
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
                    <div className="row middle-xs">
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                {/** this.state.isTabLoading &&
                  <div className="center-xs" style={{ paddingTop: '12.5%' }}>
                    <CircularProgress />
                  </div>
                **/}
                <div>
                  {this._getTabContent()}
                </div>
              </div>
            </div>
          </Paper>
        );
    }
}
NewEntryFormPanel.propTypes = {
    maxWidth: PropTypes.string,
    rootStyle: PropTypes.shape(),
    entries: PropTypes.shape(),
    drafts: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    appActions: PropTypes.shape(),
    draftActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    draftsCount: PropTypes.number,
    entriesCount: PropTypes.number,
    intl: PropTypes.shape()
};
NewEntryFormPanel.contextTypes = {
    router: PropTypes.shape()
};
NewEntryFormPanel.defaultProps = {
    rootStyle: {
        height: '100%',
        width: 640,
        zIndex: 10,
        position: 'relative'
    }
};
export default injectIntl(NewEntryFormPanel);
