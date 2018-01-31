import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { DataLoader, TagListItem } from '../';
import { searchMessages, tagMessages, generalMessages } from '../../locale-data/messages';

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
        const { fetchingTags, intl, placeholderMessage, tags, searching, searchQuery } = this.props;
        const placeholder = placeholderMessage || intl.formatMessage(searchMessages.noResults);
        return (
          <div className="tag-list">
            <DataLoader
              flag={fetchingTags}
              style={{ paddingTop: '80px' }}
            >
              <div style={{ height: '100%' }}>
                {tags.size === 0 && searching && (searchQuery.length > 2 || searchQuery.length === 0) &&
                  <div className="tag-list__placeholder">
                    <div
                      className="tag-list__placeholder-inner"
                    >
                      <div className="tag-list__placeholder_image" />
                      <div className="tag-list__placeholder_text">
                        {(searchQuery.length === 0) &&
                            intl.formatMessage(generalMessages.startTypingToSearch)}
                        {(searchQuery.length > 0) &&
                            (placeholderMessage || intl.formatMessage(generalMessages.searchingNoResults, {
                                searchTerm: searchQuery,
                                resource: intl.formatMessage(tagMessages.tags)
                            }))
                        }
                      </div>
                    </div>
                  </div>
                }
                {tags.size === 0 && !searching &&
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
    searchQuery: PropTypes.string,
    searching: PropTypes.bool,
};

export default injectIntl(TagList);
