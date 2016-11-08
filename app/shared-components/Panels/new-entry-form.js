import React, { Component, PropTypes } from 'react';
import {
    Paper,
    RaisedButton,
    Tabs,
    Tab,
    SelectField,
    MenuItem,
    Card,
    CardHeader,
    CardText,
    IconMenu,
    IconButton,
    CircularProgress } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { injectIntl, FormattedRelative, FormattedMessage } from 'react-intl';
import SearchBar from '../SearchBar/search-bar';

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
        const { draftActions, drafts, draftsCount, profile } = this.props;
        if (drafts.size !== draftsCount) {
            draftActions.getDrafts(profile.get('profile'));
        }
    }
    componentWillUpdate (nextProps, nextState) {
        const { draftActions, entryActions, drafts, draftsCount, entriesCount, entries,
            profile } = this.props;
        const { tabsValue } = nextState;
        if (this.state.tabsValue !== tabsValue) {
            if (tabsValue === 'drafts' && drafts.size !== draftsCount) {
                draftActions.getDrafts(profile.get('profile'));
            }
            if (tabsValue === 'entries' && entries.size !== entriesCount) {
                entryActions.getEntries(profile.get('profile'));
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
        const { appActions, profile } = this.props;
        appActions.hidePanel();
        switch (entryType) {
            case 'drafts':
                return router.push(`/${profile.get('username')}/draft/${entryId}`);
            default:
                break;
        }
    }
    _handleNewEntry = () => {
        const { router } = this.context;
        const { appActions, profile } = this.props;
        appActions.hidePanel();
        return router.push(`/${profile.get('username')}/draft/new`);
    }
    _getTabContent = () => {
        const { entries, drafts, profile } = this.props;
        let entities;
        switch (this.state.tabsValue) {
            case 'drafts':
                entities = drafts.filter(drft => drft.get('profile') === profile.get('profile'));
                break;
            case 'listed':
                entities = entries.filter(entry => entry.get('profile') === profile.get('profile'));
                break;
            case 'unlisted':
                entities = entries.get('published');
                break;
            default:
                break;
        }
        const entryCards = entities.map((card, key) =>
          <Card key={key} style={{ marginBottom: 8 }}>
            <CardHeader
              title="Draft"
              subtitle={
                <FormattedMessage
                  id="app.entryForm.draftCardSubtitle"
                  description="subtitle showing last updated time and words number on draft card in new entry panel"
                  defaultMessage="{lastUpdate} - {wordCount} words so far"
                  values={{
                      lastUpdate: <FormattedRelative value={card.get('status').updated_at} />,
                      wordCount: card.get('wordCount')
                  }}
                />
              }
            >
              <div style={{ width: '55%', display: 'inline-block', textAlign: 'right' }}>
                <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                  <MenuItem
                    primaryText="Edit"
                    onClick={ev => this._handleEntryEdit(ev, card.id)}
                  />
                  <MenuItem primaryText="Publish" />
                  <MenuItem primaryText="Delete" />
                </IconMenu>
              </div>
            </CardHeader>
            <CardText>
              <h2
                onClick={ev => this._handleEntryEdit(ev, card.id)}
                style={{ cursor: 'pointer' }}
              >
                {card.title && card.title}
                {!card.title && 'No Title'}
              </h2>
            </CardText>
            <CardText>
              <p>{card.excerpt}</p>
              <div>
                {card.get('status').publishing &&
                  <div className="row middle-xs">
                    <div className="col-xs-1 end-xs">
                      <CircularProgress size={20} thickness={2} />
                    </div>
                    <div className="col-xs">
                      Publishing...
                    </div>
                  </div>
                }
              </div>
            </CardText>
          </Card>
        );
        return (
          <div>{entryCards}</div>
        );
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
    profile: PropTypes.shape(),
    draftsCount: PropTypes.number,
    entriesCount: PropTypes.number
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
