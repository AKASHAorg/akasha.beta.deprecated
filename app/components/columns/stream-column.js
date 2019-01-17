import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import { ColumnHeader, EntryList } from '../index';
import { dashboardMessages, entryMessages } from '../../locale-data/messages';
import { dashboardResetColumnEntries } from '../../local-flux/actions/dashboard-actions';
import { entryMoreStreamIterator,
    entryStreamIterator } from '../../local-flux/actions/entry-actions';
import { dashboardSelectors } from '../../local-flux/selectors';

const DELAY = 60000;

class StreamColumn extends Component {
    firstCallDone = false;
    interval = null;
    timeout = null;

    componentWillReceiveProps (nextProps) {
        if (nextProps.column.get('hasNewEntries') && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    componentWillUnmount () {
        const { column } = this.props;
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.props.dashboardResetColumnEntries(column.get('id'));
    }

    firstLoad = () => {
        if (!this.firstCallDone) {
            this.entryIterator();
            this.firstCallDone = true;
        }
    };

    setPollingInterval = () => {
        this.interval = setInterval(() => {
            this.props.entryStreamIterator(this.props.column.get('id'), true);
        }, DELAY);
    };

    entryIterator = () => {
        this.props.entryStreamIterator(this.props.column.get('id'));
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.timeout = setTimeout(this.setPollingInterval, DELAY);
    };

    entryMoreStreamIterator = () => {
        const { column } = this.props;
        this.props.entryMoreStreamIterator(column.get('id'));
    }

    render () {
        const { column, entriesList, intl } = this.props;
        const className = classNames('column', { column_large: column.get('large') });

        return (
          <div className={className}>
            <ColumnHeader
              column={column}
              iconType="entries"
              onRefresh={this.entryIterator}
              readOnly
              title={intl.formatMessage(dashboardMessages.columnStream)}
            />
            <Waypoint onEnter={this.firstLoad} horizontal />
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
    dashboardResetColumnEntries: PropTypes.func.isRequired,
    entriesList: PropTypes.shape().isRequired,
    entryMoreStreamIterator: PropTypes.func.isRequired,
    entryStreamIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        entriesList: dashboardSelectors.getColumnEntries(state, ownProps.column.get('id')),
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardResetColumnEntries,
        entryMoreStreamIterator,
        entryStreamIterator,
    }
)(injectIntl(StreamColumn));
