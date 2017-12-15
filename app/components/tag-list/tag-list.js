import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { DataLoader, TagListItem } from '../';
import { searchMessages } from '../../locale-data/messages';

class TagList extends Component {
    renderTagListItem = (tag, index) => {
        const { dashboardSearch, entriesCount, showPreview, tags } = this.props;
        return (
          <TagListItem
            dashboardSearch={dashboardSearch}
            entriesCount={entriesCount}
            key={tag}
            isLast={index === tags.size - 1}
            showPreview={showPreview}
            tag={tag}
          />
        );
    }

    render () {
        const { fetchingTags, intl, placeholderMessage, tags } = this.props;
        const placeholder = placeholderMessage || intl.formatMessage(searchMessages.noResults);
        return (
          <div className="tag-list">
            <DataLoader
              flag={fetchingTags}
              style={{ paddingTop: '80px' }}
            >
              <div style={{ height: '100%' }}>
                {tags.size === 0 &&
                  <div className="tag-list__placeholder">
                    {placeholder}
                  </div>
                }
                {tags && tags.map(this.renderTagListItem)}
              </div>
            </DataLoader>
          </div>
        );
    }
}

TagList.propTypes = {
    dashboardSearch: PropTypes.func.isRequired,
    entriesCount: PropTypes.shape(),
    fetchingTags: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    placeholderMessage: PropTypes.string,
    showPreview: PropTypes.func.isRequired,
    tags: PropTypes.shape().isRequired,
};

export default injectIntl(TagList);
