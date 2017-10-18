import PropTypes from 'prop-types';
import React from 'react';
import { Paper, Tabs, Tab, SvgIcon } from 'material-ui';
import LabelIcon from 'material-ui/svg-icons/action/label';

const StreamMenu = (props, { muiTheme }) =>
    (<div className="row">
      <Paper className="col-xs-12">
        <Tabs
          value={props.activeTab}
          tabItemContainerStyle={{ backgroundColor: 'transparent', width: '400px' }}
          onChange={props.onChange}
          style={{ paddingLeft: '72px' }}
          inkBarStyle={{ backgroundColor: muiTheme.palette.primary1Color }}
        >
          <Tab
            onActive={props.onActive}
            label="Latest entries"
            value="allEntries"
            style={{ color: '#444' }}
          />
          <Tab
            onActive={props.onActive}
            label="BOOKMARKS"
            value="bookmarks"
            style={{ color: '#444' }}
          />
          <Tab
            label={
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    flex: '1 1 auto',
                    paddingRight: '10px',
                    maxWidth: '122px',
                    overflowX: 'hidden',
                    textOverflow: 'ellipsis'
                }}
                >
                  {props.selectedTag}
                </div>
                <SvgIcon
                  style={{
                    transform: 'rotate(-45deg)',
                    flex: '0 0 auto',
                    position: 'relative',
                    top: '-2px',
                    height: '20px',
                    width: '20px'
                }}
                >
                  <LabelIcon />
                </SvgIcon>
              </div>
          }
            onActive={props.onActive}
            value="tag"
            style={{ color: '#444', fill: '#444' }}
          />
        </Tabs>
      </Paper>
    </div>);

StreamMenu.propTypes = {
    activeTab: PropTypes.string,
    selectedTag: PropTypes.string,
    onChange: PropTypes.func,
    onActive: PropTypes.func
};

StreamMenu.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default StreamMenu;
