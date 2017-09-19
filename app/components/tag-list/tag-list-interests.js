import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { Switch } from 'antd';
import throttle from 'lodash.throttle';
import { DataLoader } from '../';
import { isInViewport } from '../../utils/domUtils';
import * as columnTypes from '../../constants/columns';

class TagListInterests extends Component {

    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', this.throttledHandler);
        }
        window.addEventListener('resize', this.throttledHandler);
    }

    componentWillReceiveProps (nextProps) {
        if (!this.props.tags.equals(nextProps.tags)) {
            this.checkTrigger();
        }
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

    handleSwitch = tag => this.props.toggleInterest(tag.tagName, columnTypes.tag);

    renderTagListItem = (tag) => {
        const hasTag = this.props.profileInterests.get(columnTypes.tag).includes(tag.tagName);
        return (
          <div key={tag.tagName} className="tag-list-interests__tag-list-item">
            <div className="tag-list-interests__tag-list-item-text-wrapper">
              <span className="tag-list-interests__tag-list-tag-name">#{tag.tagName}</span>
              <span className="tag-list-interests__tag-list-entry-count">{tag.count} entries</span>
            </div>
            <div className="tag-list-interests__tag-list-switch">
              <Switch
                checked={hasTag}
                onChange={() => this.handleSwitch(tag)}
                size="small"
              />
            </div>
          </div>
        );
    }


    render () {
        const { tags, defaultTimeout, fetchingTags, fetchingMoreTags, moreTags } = this.props;
        return (
          <div
            className="tag-list-interests"
            ref={this.getContainerRef}
          >
            <DataLoader
              flag={fetchingTags}
              timeout={defaultTimeout}
              style={{ paddingTop: '80px' }}
            >
              <div>
                {tags.size === 0 &&
                  <div className="tag-list-interests__no-tags">
                    No Tags
                  </div>
                }

                {tags && tags.map(tag => this.renderTagListItem(tag))}

                {moreTags &&
                  <div className="tag-list-interests__more-tags">
                    <DataLoader flag={fetchingMoreTags} size="small">
                      <div ref={this.getTriggerRef} />
                    </DataLoader>
                  </div>
                }
              </div>
            </DataLoader>
          </div>
        );
    }
}

TagListInterests.propTypes = {
    defaultTimeout: PropTypes.number,
    fetchMoreTags: PropTypes.func,
    fetchingMoreTags: PropTypes.bool,
    fetchingTags: PropTypes.bool,
    moreTags: PropTypes.bool,
    profileInterests: PropTypes.shape(),
    tags: PropTypes.shape(),
    toggleInterest: PropTypes.func
};


export default TagListInterests;
