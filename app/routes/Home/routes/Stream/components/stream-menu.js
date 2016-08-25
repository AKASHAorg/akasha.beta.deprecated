import React from 'react';
import { Paper, Tabs, Tab } from 'material-ui';

const StreamMenu = (props) =>
  <div className="row">
    <Paper className="col-xs-12">
      <div className="row center-xs">
        <div className="col-xs-10">
          <div className="row">
            <Tabs
              value={props.activeTab}
              className="col-xs-4"
              tabItemContainerStyle={{ backgroundColor: 'transparent' }}
              onChange={props.onChange}
            >
              <Tab label="STREAM" value="stream" style={{ color: '#444' }} />
              <Tab label="TOP ENTRIES" value="top" style={{ color: '#444' }} />
              <Tab label="SAVED" value="saved" style={{ color: '#444' }} />
            </Tabs>
          </div>
        </div>
      </div>
    </Paper>
  </div>;

StreamMenu.propTypes = {
    activeTab: React.PropTypes.string,
    onChange: React.PropTypes.func
};
export default StreamMenu;
