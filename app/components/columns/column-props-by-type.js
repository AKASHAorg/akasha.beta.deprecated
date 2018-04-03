import React from 'react';
import { Record, List } from 'immutable';
import * as columnTypes from '../../constants/columns';
import { dashboardMessages, profileMessages } from '../../locale-data/messages';
import { ProfileCard } from '../';

const TempRec = Record({
    id: '',
    entriesList: List(),
    ethAddress: '',
    context: '',
    value: ''
});

const getLatestColumnProps = props => ({
    ...props,
    title: props.intl.formatMessage(dashboardMessages.latest),
    onItemRequest: props.entryNewestIterator,
    onItemMoreRequest: props.entryMoreNewestIterator,
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryNewestIterator(column);
    },
    onItemPooling: col => props.entryNewestIterator({ ...col.toJS(), reversed: true }),
    fetching: props.column.getIn(['flags', 'fetchingEntries']),
    readOnly: true,
    noMenu: false,
    onNewEntriesResolveRequest: data => props.entryGetShort(data),
});

const getListColumnProps = props => ({
    ...props,
    onItemRequest: props.entryListIterator,
    onItemMoreRequest: props.entryMoreListIterator,
    title: props.lists.find(lst => lst.get('id') === props.column.get('value')).get('name') || ' ',
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryMoreListIterator(column)
    },
    dataSource: props.lists,
    entries: props.entries
});

const getTagColumnProps = props => ({
    ...props,
    iconType: 'tag',
    onItemRequest: props.entryTagIterator,
    onItemMoreRequest: props.entryMoreTagIterator,
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryTagIterator(column)
    },
    onItemPooling: col => props.entryTagIterator({ ...col.toJS(), reversed: true }),
    fetching: props.column.getIn(['flags', 'fetchingEntries']),
    dataSource: props.tagSearchResults,
    onSearch: props.searchTags
});

const getStreamColumnProps = props => ({
    ...props,
    onItemRequest: props.entryStreamIterator,
    onItemMoreRequest: props.entryMoreStreamIterator,
    title: props.intl.formatMessage(dashboardMessages.columnStream),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryStreamIterator(column);
    },
    onItemPooling: col => props.entryStreamIterator({ ...col.toJS(), reversed: true }),
    fetching: props.column.getIn(['flags', 'fetchingEntries']),
    readOnly: true
});

const getProfileColumnProps = props => ({
    ...props,
    title: props.column ? `@${props.column.value}` : props.intl.formatMessage(profileMessages.entries),
    iconType: 'user',
    onItemRequest: props.entryProfileIterator,
    onItemMoreRequest: props.entryMoreProfileIterator,
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryProfileIterator(column);
    },
    onItemPooling: col => props.entryProfileIterator({ ...col.toJS(), reversed: true }),
    fetching: props.column.getIn(['flags', 'fetchingEntries']),
    dataSource: props.profileSearchResults,
    onSearch: props.searchProfiles
});

const getProfileEntriesColumnProps = props => ({
    ...props,
    column: new TempRec({
        id: 'profileEntries',
        entriesList: props.profileEntriesList,
        ethAddress: props.ethAddress,
        value: props.ethAddress,
        context: 'profileEntries'
    }),
    fetching: props.fetchingEntries,
    fetchingMore: props.fetchingMoreEntries,
    title: props.intl.formatMessage(profileMessages.entries),
    onItemRequest: props.entryProfileIterator,
    onItemMoreRequest: props.entryMoreProfileIterator,
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryProfileIterator(column)
    },
    noMenu: true,
});

const getProfileFollowersColumnProps = props => ({
    ...props,
    column: new TempRec({
        id: 'profileFollowers',
        entriesList: props.followers,
        ethAddress: props.ethAddress,
        context: 'profilePageFollowers'
    }),
    entries: props.profiles,
    fetching: props.fetchingFollowers,
    fetchingMore: props.fetchingMoreFollowers,
    title: props.intl.formatMessage(profileMessages.followers),
    onItemRequest: props.profileFollowersIterator,
    onItemMoreRequest: props.profileMoreFollowersIterator,
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.profileFollowersIterator(column);
    },
    itemCard: <ProfileCard />,
});

const getProfileFollowingsColumnProps = props => ({
    ...props,
    column: new TempRec({
        id: 'profileFollowings',
        entriesList: props.followings,
        ethAddress: props.ethAddress,
        context: 'profilePageFollowings',
    }),
    entries: props.profiles,
    fetching: props.fetchingFollowings,
    fetchingMore: props.fetchingMoreFollowings,
    title: props.intl.formatMessage(profileMessages.followings),
    onItemRequest: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.profileFollowingsIterator(column)
    },
    onItemMoreRequest: props.profileMoreFollowingsIterator,
    onColumnRefresh: props.profileFollowingsIterator,
    itemCard: <ProfileCard />
});


export default {
    [columnTypes.latest]: getLatestColumnProps,
    [columnTypes.list]: getListColumnProps,
    [columnTypes.tag]: getTagColumnProps,
    [columnTypes.stream]: getStreamColumnProps,
    [columnTypes.profile]: getProfileColumnProps,
    [columnTypes.profileEntries]: getProfileEntriesColumnProps,
    [columnTypes.profileFollowers]: getProfileFollowersColumnProps,
    [columnTypes.profileFollowings]: getProfileFollowingsColumnProps,
};

