import PropTypes from 'prop-types';
import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import { List, ListItem } from 'material-ui/List';
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
    }

    getContainerRef = (el) => { this.container = el; };

    getTriggerRef = (el) => { this.trigger = el; };

    checkTrigger = () => {
        if (this.trigger && isInViewport(this.trigger)) {
            this.props.fetchMoreTags();
        }
    };

    throttledHandler = throttle(this.checkTrigger, 500);


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
                <List>
                  {tags && tags.map((tag) => {
                      if (!tag) {
                          return null;
                      }
                      return (
                        <ListItem key={tag.tagName} primaryText={tag.tagName} secondaryText={<p> { tag.count } entries</p>} />
                      );
                  })}
                </List>
                {moreTags &&
                  <div style={{ height: '35px' }}>
                    <DataLoader flag={fetchingMoreTags} size="small">
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
