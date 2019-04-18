import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Switch } from 'antd';
import classNames from 'classnames';
import { DataLoader } from '../';
import * as columnTypes from '../../constants/columns';
import { entryMessages, searchMessages } from '../../locale-data/messages';

class TagListInterests extends Component {

    handleSwitch = tag => this.props.toggleInterest(tag, columnTypes.tag);

    renderTagListItem = (tag, index) => {
        const { entriesCount, intl, profileInterests, tags } = this.props;
        const hasTag = profileInterests.get(columnTypes.tag).includes(tag);
        const itemClass = classNames('tag-list-interests__tag-list-item', {
            'tag-list-interests__tag-list-item_last': index === tags.size - 1
        });
        return (
            <div key={ tag } className={ itemClass }>
                <div
                    className="tag-list-interests__tag-list-item-text-wrapper content-link"
                    onClick={ () => this.handleSwitch(tag) }
                >
                    <span className="tag-list-interests__tag-list-tag-name">#{ tag }</span>
                    <span className="tag-list-interests__tag-list-entry-count">
                { intl.formatMessage(entryMessages.entriesCount, { count: entriesCount.get(tag) }) }
              </span>
                </div>
                <div className="tag-list-interests__tag-list-switch">
                    <Switch
                        checked={ hasTag }
                        onChange={ () => this.handleSwitch(tag) }
                        size="small"
                    />
                </div>
            </div>
        );
    }

    render () {
        const { defaultTimeout, fetchingTags, intl, query, tags } = this.props;
        if (!query) {
            return null;
        }
        return (
            <div className="tag-list-interests">
                <DataLoader
                    flag={ fetchingTags }
                    timeout={ defaultTimeout }
                    style={ { paddingTop: '80px' } }
                >
                    <div>
                        { tags.size === 0 &&
                        <div className="tag-list-interests__no-tags">
                            { intl.formatMessage(searchMessages.noResults) }
                        </div>
                        }
                        { tags && tags.map(this.renderTagListItem) }
                    </div>
                </DataLoader>
            </div>
        );
    }
}

TagListInterests.propTypes = {
    defaultTimeout: PropTypes.number,
    entriesCount: PropTypes.shape(),
    fetchingTags: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    profileInterests: PropTypes.shape().isRequired,
    query: PropTypes.string,
    tags: PropTypes.shape().isRequired,
    toggleInterest: PropTypes.func.isRequired
};

export default injectIntl(TagListInterests);
