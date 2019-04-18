import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import { ColumnHeader, EntryList } from '../';
import { entryMessages, profileMessages } from '../../locale-data/messages';
import { dashboardResetColumnEntries } from '../../local-flux/actions/dashboard-actions';
import { entryProfileIterator } from '../../local-flux/actions/entry-actions';
import { searchProfiles, searchResetResults } from '../../local-flux/actions/search-actions';
import { dashboardSelectors, profileSelectors, searchSelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';

const DELAY = 60000;

class ProfileColumn extends Component {
    firstCallDone = false;
    interval = null;
    timeout = null;

    componentWillReceiveProps ({ column }) {
        const value = column.get('value');
        if (value !== this.props.column.get('value')) {
            this.props.dispatchAction(entryProfileIterator({ columnId: column.get('id'), value }));
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.timeout = setTimeout(this.setPollingInterval, DELAY);
        }
        if (column.get('hasNewEntries') && this.interval) {
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
        this.props.searchResetResults();
        this.props.dashboardResetColumnEntries(column.get('id'));
    }

    firstLoad = () => {
        const { column } = this.props;
        const value = column.get('value');
        if (value && !this.firstCallDone) {
            this.entryIterator();
            this.firstCallDone = true;
        }
    };

    setPollingInterval = () => {
        this.interval = setInterval(() => {
            this.props.dispatchAction(entryProfileIterator({
                columnId: this.props.column.get('id'),
                reversed: true,
                value: this.props.column.get('value')
            }));
        }, DELAY);
    };

    entryIterator = () => {
        const { column } = this.props;
        this.props.dispatchAction(entryProfileIterator({
            columnId: column.get('id'),
            value: column.get('value')
        }));
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.timeout = setTimeout(this.setPollingInterval, DELAY);
    }

    entryMoreProfileIterator = () => {
        const { column } = this.props;
        const value = column.get('value');
        this.props.dispatchAction(entryProfileIterator({
            columnId: column.get('id'),
            value: column.get('value')
        }));
    };

    render () {
        const { column, entriesList, intl, profileExists, profileResults } = this.props;
        let placeholderMessage;
        const columnValue = column.get('value');
        if (columnValue && profileExists.has(columnValue)) {
            placeholderMessage = profileExists.getIn([columnValue, 'exists']) ?
                intl.formatMessage(entryMessages.noEntries) :
                intl.formatMessage(profileMessages.profileDoesntExist);
        } else {
            intl.formatMessage(entryMessages.searchProfile);
        }
        const className = classNames('column', { column_large: column.get('large') });

        return (
            <div className={ className }>
                <ColumnHeader
                    column={ column }
                    dataSource={ profileResults }
                    iconType="user"
                    onRefresh={ this.entryIterator }
                    onSearch={ this.props.searchProfiles }
                />
                <Waypoint onEnter={ this.firstLoad } horizontal/>
                <EntryList
                    contextId={ column.get('id') }
                    entries={ entriesList }
                    fetchingEntries={ column.getIn(['flags', 'fetchingEntries']) }
                    fetchingMoreEntries={ column.getIn(['flags', 'fetchingMoreEntries']) }
                    fetchMoreEntries={ this.entryMoreProfileIterator }
                    large={ column.get('large') }
                    moreEntries={ column.getIn(['flags', 'moreEntries']) }
                    placeholderMessage={ placeholderMessage }
                />
            </div>
        );
    }
}

ProfileColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardResetColumnEntries: PropTypes.func.isRequired,
    entriesList: PropTypes.shape().isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    profileExists: PropTypes.shape().isRequired,
    profileResults: PropTypes.shape().isRequired,
    searchProfiles: PropTypes.func.isRequired,
    searchResetResults: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        entriesList: dashboardSelectors.getColumnEntries(state, ownProps.column.get('id')),
        profileExists: profileSelectors.selectProfileExists(state),
        profileResults: searchSelectors.selectProfileSearchResults(state),
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardResetColumnEntries,
        // entryProfileIterator,
        searchProfiles,
        searchResetResults
    }
)(injectIntl(withRequest(ProfileColumn)));
