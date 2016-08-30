import React from 'react';
import { Paper, Tabs, Tab, SvgIcon } from 'material-ui';
import LabelIcon from 'material-ui/svg-icons/action/label';

const StreamMenu = (props) =>
  <div className="row">
    <Paper className="col-xs-12">
      <div className="row center-xs">
        <div className="col-xs-11" style={{ marginLeft: 24 }}>
          <div className="row">
            <Tabs
              value={props.activeTab}
              className={`col-xs-${props.routeParams.tagName ? '5' : '4'}`}
              tabItemContainerStyle={{ backgroundColor: 'transparent' }}
              onChange={props.onChange}
            >
              <Tab
                onActive={props.onActive}
                label="STREAM"
                value="stream"
                style={{ color: '#444' }}
              />
              <Tab
                onActive={props.onActive}
                label="TOP ENTRIES"
                value="top"
                style={{ color: '#444' }}
              />
              <Tab
                onActive={props.onActive}
                label="SAVED"
                value="saved"
                style={{ color: '#444' }}
              />
              {props.routeParams.filter === 'tag' &&
                <Tab
                  label={props.routeParams.tagName}
                  className="col-xs"
                  // icon={
                  //   <SvgIcon >
                  //     <LabelIcon style={{ transform: 'rotate(-45deg)' }} />
                  //   </SvgIcon>}
                  value="tag"
                  style={{ color: '#444', fill: '#444' }}
                />
              }
            </Tabs>
          </div>
        </div>
      </div>
    </Paper>
  </div>;

StreamMenu.propTypes = {
    activeTab: React.PropTypes.string,
    onChange: React.PropTypes.func,
    routeParams: React.PropTypes.object
};
export default StreamMenu;
