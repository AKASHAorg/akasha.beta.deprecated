import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { AutoComplete, Icon, Input } from 'antd';
import { entryMessages } from '../../locale-data/messages';
import { EntryList } from '../';

class NewSearchColumn extends Component {
    componentDidMount () {
        if (this.input) {
            this.input.focus();
        }
    }

    componentWillUnmount () {
        this.props.dashboardResetNewColumn();
    }

    getInputRef = (el) => { this.input = el; };

    onSearch = value => this.props.onSearch(value);

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
    };

    onSelect = (value) => {
        this.selecting = true;
        this.props.entryIterator({ columnId: 'newColumn', value });
    };

    onLoadMore = () => this.props.entryMoreIterator({
        columnId: 'newColumn',
        value: this.props.column.get('value')
    });

    onSearchEntries = () => {
        const { entryIterator, newColumn } = this.props;
        entryIterator({ columnId: 'newColumn', value: newColumn.get('value') });
    };

    render () {
        const { column, dataSource, intl, newColumn, previewEntries, previewMessage } = this.props;
        const placeholderMessage = intl.formatMessage(entryMessages.noEntries);

        return (
          <div className="new-search-column">
            <div className="new-search-column__search-wrapper">
              <AutoComplete
                className="new-search-column__auto-complete"
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
                      className="flex-center content-link new-search-column__search-icon-wrapper"
                      onClick={this.onSearchEntries}
                    >
                      <Icon type="search" />
                    </div>
                  )}
                />
              </AutoComplete>
            </div>
            {column.get('value') &&
              <div className="flex-center-y new-search-column__preview-title">
                {previewMessage}
              </div>
            }
            {column.get('value') &&
              <div className="new-search-column__list-wrapper">
                <EntryList
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

NewSearchColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardResetNewColumn: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    dataSource: PropTypes.shape().isRequired,
    entryIterator: PropTypes.func.isRequired,
    entryMoreIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    newColumn: PropTypes.shape().isRequired,
    onSearch: PropTypes.func.isRequired,
    previewEntries: PropTypes.shape().isRequired,
    previewMessage: PropTypes.string.isRequired
};

export default injectIntl(NewSearchColumn);
