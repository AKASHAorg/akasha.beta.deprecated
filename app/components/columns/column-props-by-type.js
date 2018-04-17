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
    onItemRequest: (column) => props.entryNewestIterator(column, true),
    onItemMoreRequest: (column) => props.entryMoreNewestIterator(column, true),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryNewestIterator(column, true);
    },
    onItemPooling: col => props.entryNewestIterator({ ...col, reversed: true }, true),
    fetching: props.column.getIn(['flags', 'fetchingEntries']),
    readOnly: true,
    noMenu: false,
    onNewEntriesResolveRequest: data => props.entryGetShort(data),
});

const getListColumnProps = props => {
    const list = props.lists.find(lst => lst.get('id') === props.column.get('value'));
    return {
        ...props,
        onItemRequest: props.entryListIterator,
        onItemMoreRequest: (column) => props.entryMoreListIterator(column, true),
        title: list.get('name') || ' ',
        onColumnRefresh: (column) => {
            props.dashboardResetColumnEntries(column.id);
            props.entryListIterator(column)
        },
        dataSource: props.lists,
        entries: props.entries
    }
};

const getTagColumnProps = props => ({
    ...props,
    iconType: 'tag',
    onItemRequest: (column) => props.entryTagIterator(column, true),
    onItemMoreRequest: (column) => props.entryMoreTagIterator(column, true),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryTagIterator(column, true);
    },
    onItemPooling: col => props.entryTagIterator({ ...col, reversed: true }),
    fetching: props.column.getIn(['flags', 'fetchingEntries']),
    dataSource: props.tagSearchResults,
    onSearch: props.searchTags
});

const getStreamColumnProps = props => ({
    ...props,
    onItemRequest: (column) => props.entryStreamIterator(column, true),
    onItemMoreRequest: (column) => props.entryMoreStreamIterator(column, true),
    title: props.intl.formatMessage(dashboardMessages.columnStream),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryStreamIterator(column, true);
    },
    onItemPooling: col => props.entryStreamIterator({ ...col, reversed: true }),
    fetching: props.column.getIn(['flags', 'fetchingEntries']),
    readOnly: true
});

const getProfileColumnProps = props => ({
    ...props,
    title: props.column ? `@${props.column.value}` : props.intl.formatMessage(profileMessages.entries),
    iconType: 'user',
    onItemRequest: (column) => props.entryProfileIterator(column, true),
    onItemMoreRequest: (column) => props.entryMoreProfileIterator(column, true),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryProfileIterator(column, true);
    },
    onItemPooling: col => props.entryProfileIterator({ ...col, reversed: true }),
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
    onItemRequest: (column) => props.entryProfileIterator(column, true),
    onItemMoreRequest: (column) => props.entryMoreProfileIterator(column, true),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryProfileIterator(column, true)
    },
    noMenu: true,
});

const getProfileFollowersColumnProps = props => ({
    ...props,
    column: new TempRec({
        id: 'profileFollowers',
        entriesList: props.followers.map(follower => follower.ethAddress),
        ethAddress: props.ethAddress,
        context: 'profilePageFollowers'
    }),
    entries: props.profiles,
    fetching: props.fetchingFollowers,
    fetchingMore: props.fetchingMoreFollowers,
    title: props.intl.formatMessage(profileMessages.followers),
    onItemRequest: (col) => props.profileFollowersIterator({ ...col, batching: true }),
    onItemMoreRequest: (col) => props.profileMoreFollowersIterator({...col, batching: true}),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.profileFollowersIterator({...column, batching: true});
    },
    itemCard: <ProfileCard />,
});

const getProfileFollowingsColumnProps = props => ({
    ...props,
    column: new TempRec({
        id: 'profileFollowings',
        entriesList: props.followings.map(foll => foll.ethAddress),
        ethAddress: props.ethAddress,
        context: 'profilePageFollowings',
    }),
    entries: props.profiles,
    fetching: props.fetchingFollowings,
    fetchingMore: props.fetchingMoreFollowings,
    title: props.intl.formatMessage(profileMessages.followings),
    onItemRequest: column => props.profileFollowingsIterator({ ...column, batching: true }),
    onItemMoreRequest: col => props.profileMoreFollowingsIterator({ ...col, batching: true }),
    onColumnRefresh: (column) => {
        props.profileFollowingsIterator({...column, batching: true});
    },
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
