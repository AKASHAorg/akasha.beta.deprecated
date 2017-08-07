import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader, EntryList } from '../';
import { ColumnStream } from '../svg';
import { dashboardMessages, entryMessages } from '../../locale-data/messages';
import { entryMoreStreamIterator,
    entryStreamIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

class StreamColumn extends Component {

    componentDidMount () {
        const { column } = this.props;
        if (!column.get('entries').size) {
            this.props.entryStreamIterator(column.get('id'));
        }
    }

    entryMoreStreamIterator = () => {
        const { column } = this.props;
        this.props.entryMoreStreamIterator(column.get('id'));
    }

    render () {
        const { column, entries, intl } = this.props;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader
              column={column}
              icon={<ColumnStream />}
              readOnly
              title={intl.formatMessage(dashboardMessages.columnStream)}
            />
            <EntryList
              cardStyle={{ width: column.get('large') ? '700px' : '340px' }}
              contextId={column.get('id')}
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreStreamIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={intl.formatMessage(entryMessages.noNewEntries)}
            />
          </div>
        );
    }
}

StreamColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreStreamIterator: PropTypes.func.isRequired,
    entryStreamIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        entries: selectColumnEntries(state, ownProps.column.get('id')),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreStreamIterator,
        entryStreamIterator,
    }
)(injectIntl(StreamColumn));
