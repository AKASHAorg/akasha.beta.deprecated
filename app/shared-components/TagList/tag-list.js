import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { Switch } from 'antd';
import throttle from 'lodash.throttle';
import { DataLoader } from '../';
import { isInViewport } from '../../utils/domUtils';

class TagList extends Component {

    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', this.throttledHandler);
        }
        window.addEventListener('resize', this.throttledHandler);
    }

    componentWillUnmount () {
        if (this.container) {
            this.container.removeEventListener('scroll', this.throttledHandler);
        }
        window.removeEventListener('resize', this.throttledHandler);
        ReactTooltip.hide();
    }

    getContainerRef = el => (this.container = el);

    getTriggerRef = el => (this.trigger = el);

    checkTrigger = () => {
        if (this.trigger && isInViewport(this.trigger)) {
            this.props.fetchMoreTags();
        }
    };

    throttledHandler = throttle(this.checkTrigger, 500);

    handleSwitch = (checked) => {
        console.log(`switch to ${checked}`);
    }

    renderTagListItem = (tag) => {
        return (
          <div key={tag.tagName}>
            <span>#{tag.tagName}</span>
            <span>{tag.count}</span>
            <Switch defaultChecked={false} onChange={this.handleSwitch} />
          </div>
        );
    }


    render () {
        const { tags, style, defaultTimeout, fetchingTags, fetchingMoreTags, moreTags } = this.props;
        const { palette } = this.context.muiTheme;
        return (
          <div
            style={Object.assign({}, {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                overflowY: 'auto',
                overflowX: 'hidden',
                minHeight: '500px'
            }, style)}
            ref={this.getContainerRef}
          >
            <DataLoader
              flag={fetchingTags}
              timeout={defaultTimeout}
              size={60}
              style={{ paddingTop: '80px' }}
            >
              <div style={{ width: '100%' }}>
                {tags.size === 0 &&
                  <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: palette.disabledColor,
                        paddingTop: '10px'
                    }}
                  >
                    No Tags
                  </div>
                }

                {tags && tags.map((tag) => {
                    if (!tag) {
                        return null;
                    }
                    return this.renderTagListItem(tag);
                })}

                {moreTags &&
                  <div style={{ height: '35px' }}>
                    <DataLoader flag={fetchingMoreTags} size={30}>
                      <div
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <div ref={this.getTriggerRef} style={{ height: 0 }} />
                      </div>
                    </DataLoader>
                  </div>
                }
              </div>
            </DataLoader>
          </div>
        );
    }
}

TagList.propTypes = {
    tags: PropTypes.shape(),
    defaultTimeout: PropTypes.number,
    style: PropTypes.shape(),
    fetchMoreTags: PropTypes.func,
    fetchingMoreTags: PropTypes.bool,
    fetchingTags: PropTypes.bool,
    moreTags: PropTypes.bool
};

TagList.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default TagList;
