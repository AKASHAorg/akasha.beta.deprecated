import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { AutoComplete, Icon, Input } from 'antd';
import { dashboardMessages, entryMessages } from '../../locale-data/messages';
import { dashboardResetNewColumn,
    dashboardUpdateNewColumn } from '../../local-flux/actions/dashboard-actions';
import { entryMoreTagIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { searchTags } from '../../local-flux/actions/search-actions';
import { selectColumn, selectColumnEntries, selectNewColumn,
    selectTagSearchResults } from '../../local-flux/selectors';
import { EntryList } from '../';

class NewTagColumn extends Component {
    componentDidMount () {
        if (this.input) {
            this.input.focus();
        }
    }

    componentWillUnmount () {
        this.props.dashboardResetNewColumn();
    }

    getInputRef = (el) => { this.input = el; };

    onSearch = value => this.props.searchTags(value);

    onChange = (value) => {
        const { column } = this.props;
        this.props.dashboardUpdateNewColumn({ value });
        if (column.get('value') && value !== column.get('value')) {
            this.props.dashboardResetNewColumn();
        }
    };

    onKeyDown = (ev) => {
        const { dataSource } = this.props;
        if (ev.key === 'Enter') {
            if (!dataSource.size || !this.selecting) {
                this.onSearchEntries();
            }
            this.selecting = false;
        }
    }

    onSelect = (value) => {
        this.selecting = true;
        this.props.entryTagIterator('newColumn', value);
    };

    onLoadMore = () => this.props.entryMoreTagIterator('newColumn', this.props.column.get('value'));

    onSearchEntries = () => {
        const { newColumn } = this.props;
        this.props.entryTagIterator('newColumn', newColumn.get('value'));
    };

    render () {
        const { column, dataSource, intl, newColumn, previewEntries } = this.props;
        const placeholderMessage = intl.formatMessage(entryMessages.noEntries);

        return (
          <div className="new-tag-column">
            <div className="new-tag-column__search-wrapper">
              <AutoComplete
                className="new-tag-column__auto-complete"
                dataSource={dataSource}
                onChange={this.onChange}
                onSearch={this.onSearch}
                onSelect={this.onSelect}
                size="large"
                value={newColumn.get('value')}
              >
                <Input
                  onKeyDown={this.onKeyDown}
                  ref={this.getInputRef}
                  suffix={(
                    <div
                      className="flex-center content-link new-tag-column__search-icon-wrapper"
                      onClick={this.onSearchEntries}
                    >
                      <Icon type="search" />
                    </div>
                  )}
                />
              </AutoComplete>
            </div>
            {column.get('value') &&
              <div className="flex-center-y new-tag-column__preview-title">
                {intl.formatMessage(dashboardMessages.preview, { tagName: column.get('value') })}
              </div>
            }
            {column.get('value') &&
              <div className="new-tag-column__list-wrapper">
                <EntryList
                  cardStyle={{ width: '340px' }}
                  contextId="newColumn"
                  entries={previewEntries}
                  fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
                  fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
                  fetchMoreEntries={this.onLoadMore}
                  moreEntries={column.getIn(['flags', 'moreEntries'])}
                  placeholderMessage={placeholderMessage}
                />
              </div>
            }
          </div>
        );
    }
}

NewTagColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardResetNewColumn: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    dataSource: PropTypes.shape().isRequired,
    entryMoreTagIterator: PropTypes.func.isRequired,
    entryTagIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    newColumn: PropTypes.shape().isRequired,
    previewEntries: PropTypes.shape().isRequired,
    searchTags: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        column: selectColumn(state, 'newColumn'),
        dataSource: selectTagSearchResults(state),
        newColumn: selectNewColumn(state),
        previewEntries: selectColumnEntries(state, 'newColumn')
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardResetNewColumn,
        dashboardUpdateNewColumn,
        entryMoreTagIterator,
        entryTagIterator,
        searchTags
    }
)(injectIntl(NewTagColumn));
