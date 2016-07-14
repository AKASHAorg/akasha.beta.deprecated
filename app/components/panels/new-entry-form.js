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
    CardActions,
    IconMenu,
    IconButton,
    CircularProgress } from 'material-ui';
import SearchBar from '../ui/search-bar/search-bar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class NewEntryFormPanel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tabsValue: 'drafts',
            searchValue: '',
            sortByValue: 'latest'
        };
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
        console.log(payload);
        this.setState({
            sortByValue: payload
        });
    }
    _getTabContent = () => {
        const { entryState } = this.props;
        let entries;
        console.log(this.state.tabsValue);
        switch (this.state.tabsValue) {
            case 'drafts':
                entries = entryState.get('drafts');
                break;
            case 'listed':
                entries = entryState.get('published');
                break;
            case 'unlisted':
                entries = entryState.get('published');
                break;
            default:
                break;
        }
        const entryCards = entries.map((card, key) => {
            return (
              <Card key={key}>
                <CardHeader
                  title="Draft"
                  subtitle="1 day ago - 18 words so far"
                >
                  <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                    <MenuItem primaryText="Edit" />
                    <MenuItem primaryText="Publish" />
                    <MenuItem primaryText="Delete" />
                  </IconMenu>
                </CardHeader>
                <CardText>
                  <h2>
                    {card.title && card.title}
                    {!card.title && 'No Title'}
                  </h2>
                </CardText>
                <CardText>
                  <p>{card.excerpt}</p>
                </CardText>
                <CardActions expandable >
                  <RaisedButton label="Delete" />
                  <RaisedButton label="Edit" primary />
                </CardActions>
              </Card>
            );
        });
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
                <RaisedButton label="new entry" primary />
              </div>
            </div>
            <div className="row" style={{ margin: 0, padding: '0 18px' }}>
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
    rootStyle: PropTypes.object
};
NewEntryFormPanel.defaultProps = {
    rootStyle: {
        height: '100%',
        width: 640,
        zIndex: 10,
        position: 'relative'
    }
};
export default NewEntryFormPanel;
