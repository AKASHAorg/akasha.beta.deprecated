import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import classNames from 'classnames';
import { DataLoader } from '../';
import { entryMessages, searchMessages } from '../../locale-data/messages';

class TagList extends Component {
    renderTagListItem = (tag, index) => {
        const { entriesCount, intl, tags } = this.props;
        const itemClass = classNames('tag-list__item', {
            'tag-list__item_last': index === tags.size - 1
        });
        return (
          <div key={tag} className={itemClass}>
            <div className="tag-list__item-text-wrapper">
              <span className="tag-list__tag-name">#{tag}</span>
              <span className="tag-list__entry-count">
                {intl.formatMessage(entryMessages.entriesCount, { count: entriesCount.get(tag) })}
              </span>
            </div>
            <div className="tag-list__buttons">
              <Button className="tag-list__button" size="small">Add to board</Button>
              <Button className="tag-list__button tag-list__preview-button" size="small">
                Preview
              </Button>
            </div>
          </div>
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
    entriesCount: PropTypes.shape(),
    fetchingTags: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    placeholderMessage: PropTypes.string,
    tags: PropTypes.shape().isRequired,
};

export default injectIntl(TagList);
