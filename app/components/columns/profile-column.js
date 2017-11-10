import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader, EntryList } from '../';
import { ColumnProfile } from '../svg';
import { entryMessages } from '../../locale-data/messages';
import { dashboardGetProfileSuggestions } from '../../local-flux/actions/dashboard-actions';
import { entryMoreProfileIterator, entryProfileIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

class ProfileColumn extends Component {
    componentDidMount () {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entries').size && value) {
            this.props.entryProfileIterator({ columnId: column.get('id'), value });
        }
    }

    componentWillReceiveProps ({ column }) {
        const value = column.get('value');
        if (value !== this.props.column.get('value')) {
            this.props.entryProfileIterator({ columnId: column.get('id'), value });
        }
    }

    entryMoreProfileIterator = () => {
        const { column } = this.props;
        const value = column.get('value');
        this.props.entryMoreProfileIterator({ columnId: column.get('id'), value });
    };

    onRefresh = () => {
        const { column } = this.props;
        this.props.entryProfileIterator({
            columnId: column.get('id'),
            value: column.get('value')
        });
    };

    render () {
        const { column, entries, intl } = this.props;
        const placeholderMessage = column.get('value') ?
            intl.formatMessage(entryMessages.noEntries) :
            intl.formatMessage(entryMessages.searchProfile);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader
              column={column}
              onInputChange={val => this.props.dashboardGetProfileSuggestions(val, column.get('id'))}
              icon={<ColumnProfile />}
              onRefresh={this.onRefresh}
            />
            <EntryList
              cardStyle={{ width: column.get('large') ? '700px' : '340px' }}
              contextId={column.get('id')}
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreProfileIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={placeholderMessage}
            />
          </div>
        );
    }
}

ProfileColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardGetProfileSuggestions: PropTypes.func.isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreProfileIterator: PropTypes.func.isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
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
        dashboardGetProfileSuggestions,
        entryMoreProfileIterator,
        entryProfileIterator,
    }
)(injectIntl(ProfileColumn));
