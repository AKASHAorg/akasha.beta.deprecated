import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { ColumnHeader, EntryList } from '../index';
import { dashboardMessages, entryMessages } from '../../locale-data/messages';
import { entryMoreStreamIterator,
    entryStreamIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

class StreamColumn extends Component {
    componentDidMount () {
        const { column } = this.props;
        if (!column.get('entriesList').size) {
            this.props.entryStreamIterator(column.get('id'));
        }
    }

    entryMoreStreamIterator = () => {
        const { column } = this.props;
        this.props.entryMoreStreamIterator(column.get('id'));
    }

    onRefresh = () => this.props.entryStreamIterator(this.props.column.get('id'));

    render () {
        const { column, entriesList, intl } = this.props;
        const className = classNames('column', { column_large: column.get('large') });

        return (
          <div className={className}>
            <ColumnHeader
              column={column}
              iconType="entries"
              onRefresh={this.onRefresh}
              readOnly
              title={intl.formatMessage(dashboardMessages.columnStream)}
            />
            <EntryList
              contextId={column.get('id')}
              entries={entriesList}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreStreamIterator}
              large={column.get('large')}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={intl.formatMessage(entryMessages.noEntries)}
            />
          </div>
        );
    }
}

StreamColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    entriesList: PropTypes.shape().isRequired,
    entryMoreStreamIterator: PropTypes.func.isRequired,
    entryStreamIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        entriesList: selectColumnEntries(state, ownProps.column.get('id')),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreStreamIterator,
        entryStreamIterator,
    }
)(injectIntl(StreamColumn));
