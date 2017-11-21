import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Select } from 'antd';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { EntryList } from '../';

const { Option } = Select;

class NewSelectColumn extends Component {
    componentWillUnmount () {
        this.props.dashboardResetNewColumn();
    }

    onChange = (value) => {
        this.props.dashboardUpdateNewColumn({ value });
    };

    onSelect = (value) => {
        this.selecting = true;
        this.props.entryIterator({ columnId: 'newColumn', value });
    };

    onLoadMore = () => this.props.entryMoreIterator({
        columnId: 'newColumn',
        value: this.props.column.get('value')
    });

    render () {
        const { column, intl, newColumn, options, previewEntries, previewMessage } = this.props;
        const placeholderMessage = intl.formatMessage(entryMessages.noEntries);

        return (
          <div className="new-select-column">
            <div className="new-select-column__select-wrapper">
              <Select
                className="new-select-column__select"
                filterOption
                notFoundContent={intl.formatMessage(generalMessages.notFound)}
                onChange={this.onChange}
                onSelect={this.onSelect}
                showSearch
                size="large"
                value={newColumn.get('value')}
              >
                {options.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </div>
            {column.get('value') &&
              <div className="flex-center-y new-select-column__preview-title">
                {previewMessage}
              </div>
            }
            {column.get('value') &&
              <div className="new-select-column__list-wrapper">
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

NewSelectColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardResetNewColumn: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    entryIterator: PropTypes.func.isRequired,
    entryMoreIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    newColumn: PropTypes.shape().isRequired,
    options: PropTypes.shape().isRequired,
    previewEntries: PropTypes.shape().isRequired,
    previewMessage: PropTypes.string.isRequired
};

export default injectIntl(NewSelectColumn);
