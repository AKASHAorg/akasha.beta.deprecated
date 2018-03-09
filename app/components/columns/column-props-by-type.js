import React from 'react';
import { Record, List } from 'immutable';
import * as columnTypes from '../../constants/columns';
import { dashboardMessages, profileMessages } from '../../locale-data/messages';
import { ProfileCard } from '../';
/* eslint-disable complexity */
const getColumnPropsByType = ({
    type, intl, column, ...other
}) => {
    let passedProps = {
        column,
        type,
        intl,
        noMenu: false,
        fetching: false,
        fetchingMore: false,
        ...other
    };
    const TempRec = Record({
        id: '',
        entriesList: List(),
        ethAddress: '',
        context: '',
        value: ''
    });
    switch (type) {
        case columnTypes.latest:
            passedProps = {
                ...passedProps,
                title: intl.formatMessage(dashboardMessages.latest),
                onItemRequest: other.entryNewestIterator,
                onItemMoreRequest: other.entryMoreNewestIterator,
                onColumnRefresh: other.entryNewestIterator,
                onItemPooling: col => other.entryNewestIterator({ ...col.toJS(), reversed: true }),
                fetching: column.getIn(['flags', 'fetchingEntries']),
                readOnly: true
            };
            break;
        case columnTypes.list:
            passedProps = {
                ...passedProps,
                onItemRequest: other.entryListIterator,
                onItemMoreRequest: other.entryMoreListIterator,
                title: other.lists.find(lst => lst.get('id') === column.get('value')).get('name') || ' ',
                onColumnRefresh: other.entryMoreListIterator,
                dataSource: other.lists,
                entries: other.entries
            };
            break;
        case columnTypes.tag:
            passedProps = {
                ...passedProps,
                iconType: 'tag',
                onItemRequest: other.entryTagIterator,
                onItemMoreRequest: other.entryMoreTagIterator,
                onColumnRefresh: other.entryTagIterator,
                onItemPooling: col => other.entryTagIterator({ ...col.toJS(), reversed: true }),
                fetching: column.getIn(['flags', 'fetchingEntries']),
                dataSource: other.tagSearchResults,
                onSearch: other.searchTags
            };
            break;
        case columnTypes.stream:
            passedProps = {
                ...passedProps,
                onItemRequest: other.entryStreamIterator,
                onItemMoreRequest: other.entryMoreStreamIterator,
                title: intl.formatMessage(dashboardMessages.columnStream),
                onColumnRefresh: other.entryStreamIterator,
                onItemPooling: col => other.entryStreamIterator({ ...col.toJS(), reversed: true }),
                fetching: column.getIn(['flags', 'fetchingEntries']),
                readOnly: true
            };
            break;
        case columnTypes.profile:
            passedProps = {
                ...passedProps,
                title: column ? `@${column.value}` : intl.formatMessage(profileMessages.entries),
                iconType: 'user',
                onItemRequest: other.entryProfileIterator,
                onItemMoreRequest: other.entryMoreProfileIterator,
                onColumnRefresh: other.entryProfileIterator,
                onItemPooling: col => other.entryProfileIterator({ ...col.toJS(), reversed: true }),
                fetching: column.getIn(['flags', 'fetchingEntries']),
                dataSource: other.profileSearchResults,
                onSearch: other.searchProfiles
            };
            break;
        case columnTypes.profileEntries:
            passedProps = {
                ...passedProps,
                column: new TempRec({
                    id: 'profileEntries',
                    entriesList: other.profileEntriesList,
                    ethAddress: other.ethAddress,
                    value: other.ethAddress,
                    context: 'profileEntries'
                }),
                fetching: other.fetchingEntries,
                fetchingMore: other.fetchingMoreEntries,
                title: intl.formatMessage(profileMessages.entries),
                onItemRequest: other.entryProfileIterator,
                onItemMoreRequest: other.entryMoreProfileIterator,
                onColumnRefresh: other.entryProfileIterator,
                noMenu: true,
                // onItemPooling: col => other.entryProfileIterator({ ...col.toJS(), reversed: true })
            };
            break;
        case columnTypes.profileFollowers:
            passedProps = {
                ...passedProps,
                column: new TempRec({
                    id: 'profileFollowers',
                    entriesList: other.followers,
                    ethAddress: other.ethAddress,
                    context: 'profilePageFollowers'
                }),
                entries: other.profiles,
                fetching: other.fetchingFollowers,
                fetchingMore: other.fetchingMoreFollowers,
                title: intl.formatMessage(profileMessages.followers),
                onItemRequest: other.profileFollowersIterator,
                onItemMoreRequest: other.profileMoreFollowersIterator,
                onColumnRefresh: other.profileFollowersIterator,
                itemCard: <ProfileCard />,
            };
            break;
        case columnTypes.profileFollowings:
            passedProps = {
                ...passedProps,
                column: new TempRec({
                    id: 'profileFollowings',
                    entriesList: other.followings,
                    ethAddress: other.ethAddress,
                    context: 'profilePageFollowings',
                }),
                entries: other.profiles,
                fetching: other.fetchingFollowings,
                fetchingMore: other.fetchingMoreFollowings,
                title: intl.formatMessage(profileMessages.followings),
                onItemRequest: other.profileFollowingsIterator,
                onItemMoreRequest: other.profileMoreFollowingsIterator,
                onColumnRefresh: other.profileFollowingsIterator,
                itemCard: <ProfileCard />
            };
            break;
        default:
            break;
    }
    return passedProps;
};

export default getColumnPropsByType;
