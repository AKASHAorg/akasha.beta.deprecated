import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader } from '../';
import { EntryListContainer } from '../../shared-components';
import { entryMessages } from '../../locale-data/messages';
import { entryMoreNewestIterator,
    entryNewestIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

class LatestColumn extends Component {

    componentDidMount () {
        const { column } = this.props;
        this.props.entryNewestIterator(column.get('id'));
    }

    entryMoreNewestIterator = () => {
        const { column } = this.props;
        this.props.entryMoreNewestIterator(column.get('id'));
    }

    render () {
        const { column, entries, intl, profiles } = this.props;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader icon={null} readOnly title="New on AKASHA" />
            <EntryListContainer
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreNewestIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={intl.formatMessage(entryMessages.noNewEntries)}
              profiles={profiles}
            />
          </div>
        );
    }
}

LatestColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreNewestIterator: PropTypes.func.isRequired,
    entryNewestIterator: PropTypes.func.isRequired,
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
        entryMoreNewestIterator,
        entryNewestIterator,
    }
)(injectIntl(LatestColumn));
