import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { ColumnHeader, EntryList } from '../';
import { dashboardMessages, entryMessages } from '../../locale-data/messages';
import { entryMoreNewestIterator,
    entryNewestIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

class LatestColumn extends Component {
    componentDidMount () {
        const { column } = this.props;
        if (!column.get('entries').size) {
            this.entryIterator();
        }
    }

    entryIterator = () => this.props.entryNewestIterator(this.props.column.get('id'));

    entryMoreNewestIterator = () => {
        const { column } = this.props;
        this.props.entryMoreNewestIterator(column.get('id'));
    }

    render () {
        const { column, entries, intl } = this.props;
        const className = classNames('column', { column_large: column.get('large') });

        return (
          <div className={className}>
            <ColumnHeader
              column={column}
              iconType="entries"
              onRefresh={this.entryIterator}
              readOnly
              title={intl.formatMessage(dashboardMessages.latest)}
            />
            <EntryList
              contextId={column.get('id')}
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreNewestIterator}
              large={column.get('large')}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={intl.formatMessage(entryMessages.noNewEntries)}
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
};

function mapStateToProps (state, ownProps) {
    return {
        entries: selectColumnEntries(state, ownProps.column.get('id'))
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreNewestIterator,
        entryNewestIterator,
    }
)(injectIntl(LatestColumn));
