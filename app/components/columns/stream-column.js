import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader } from '../';
import { ColumnStream } from '../svg';
import { EntryListContainer } from '../../shared-components';
import { dashboardMessages, entryMessages } from '../../locale-data/messages';
import { entryMoreStreamIterator,
    entryStreamIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

class StreamColumn extends Component {

    componentDidMount () {
        const { column } = this.props;
        this.props.entryStreamIterator(column.get('id'));
    }

    entryMoreStreamIterator = () => {
        const { column } = this.props;
        this.props.entryMoreStreamIterator(column.get('id'));
    }

    render () {
        const { column, entries, intl, profiles } = this.props;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader
              icon={<ColumnStream />}
              readOnly
              title={intl.formatMessage(dashboardMessages.columnStream)}
            />
            <EntryListContainer
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreStreamIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={intl.formatMessage(entryMessages.noNewEntries)}
              profiles={profiles}
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
    profiles: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        entries: selectColumnEntries(state, ownProps.column.get('id')),
        profiles: state.profileState.get('byId'),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreStreamIterator,
        entryStreamIterator,
    }
)(injectIntl(StreamColumn));
