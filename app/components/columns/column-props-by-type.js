import React from 'react';
import * as columnTypes from '../../constants/columns';
import { dashboardMessages, profileMessages } from '../../locale-data/messages';
import { CommentCard, ProfileCard } from '../';

const getLatestColumnProps = props => ({
    column: props.column,
    ethAddress: props.ethAddress,    
    intl: props.intl,
    isVisible: props.isVisible,  
    pendingEntries: props.pendingEntries,  
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
    onNewItemsResolveRequest: data => props.entryGetShort({...data, includeVotes: true}),
});

const getListColumnProps = props => {
    const list = props.lists.find(lst => lst.get('id') === props.column.get('value'));
    return {
        column: props.column,
        ethAddress: props.ethAddress,
        intl: props.intl,   
        isVisible: props.isVisible,       
        pendingEntries: props.pendingEntries,
        onItemRequest: props.entryListIterator,
        onItemMoreRequest: (column) => props.entryMoreListIterator(column, true),
        title: list.get('name') || ' ',
        onColumnRefresh: (column) => {
            props.dashboardResetColumnEntries(column.id);
            props.entryListIterator(column)
        },
        dataSource: props.lists,
        // entries: props.entries
    }
};

const getTagColumnProps = props => ({
    column: props.column,
    ethAddress: props.ethAddress,
    intl: props.intl,
    isVisible: props.isVisible,  
    pendingEntries: props.pendingEntries,
    iconType: 'tag',
    onItemRequest: (column) => props.entryTagIterator(column, true),
    onItemMoreRequest: (column) => props.entryMoreTagIterator(column, true),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryTagIterator(column, true);
    },
    onItemPooling: col => props.entryTagIterator({ ...col, reversed: true }),
    dataSource: props.tagSearchResults,
    onSearch: props.searchTags,
    onNewItemsResolveRequest: data => props.entryGetShort({...data, includeVotes: true}),
});

const getStreamColumnProps = props => ({
    column: props.column,   
    ethAddress: props.ethAddress, 
    intl: props.intl,
    isVisible: props.isVisible,  
    pendingEntries: props.pendingEntries,
    onItemRequest: (column) => props.entryStreamIterator(column, true),
    onItemMoreRequest: (column) => props.entryMoreStreamIterator(column, true),
    title: props.intl.formatMessage(dashboardMessages.columnStream),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryStreamIterator(column, true);
    },
    onItemPooling: col => props.entryStreamIterator({ ...col, reversed: true }),
    readOnly: true,
    onNewItemsResolveRequest: data => props.entryGetShort({...data, includeVotes: true}),
});

const getProfileColumnProps = props => ({
    column: props.column,    
    ethAddress: props.ethAddress,
    intl: props.intl,
    isVisible: props.isVisible,  
    pendingEntries: props.pendingEntries,
    title: props.column ? `@${props.column.value}` : props.intl.formatMessage(profileMessages.entries),
    iconType: 'user',
    onItemRequest: (column) => props.entryProfileIterator(column, true),
    onItemMoreRequest: (column) => props.entryMoreProfileIterator(column, true),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.entryProfileIterator(column, true);
    },
    onItemPooling: col => props.entryProfileIterator({ ...col, reversed: true }),
    dataSource: props.profileSearchResults,
    onSearch: props.searchProfiles,
    onNewItemsResolveRequest: data => props.entryGetShort({...data, includeVotes: true}),
});

const getProfileCommentsColumnProps = (props) => ({
    column: props.column.set('value', props.ethAddress),
    ethAddress: props.ethAddress,
    intl: props.intl,
    isVisible: props.isVisible,  
    pendingEntries: props.pendingEntries,
    title: props.intl.formatMessage(profileMessages.comments),
    iconType: 'comment',
    onItemRequest: (column) => props.profileCommentsIterator(column),
    onItemMoreRequest: (column) => props.profileMoreCommentsIterator(column),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.profileCommentsIterator(column, true);
    },
    itemCard: <CommentCard />,
});

const getProfileEntriesColumnProps = props => ({
    column: props.column.set('value', props.ethAddress),
    ethAddress: props.ethAddress,
    isVisible: props.isVisible,  
    pendingEntries: props.pendingEntries,
    intl: props.intl,
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
    column: props.column.set('value', props.ethAddress), 
    ethAddress: props.ethAddress,   
    intl: props.intl,
    isVisible: props.isVisible,  
    title: props.intl.formatMessage(profileMessages.followers),
    onItemRequest: (column) => props.profileFollowersIterator({ column, batching: true }),
    onItemMoreRequest: (column) => props.profileMoreFollowersIterator({ column, batching: true }),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.profileFollowersIterator({ column, batching: true});
    },
    itemCard: <ProfileCard />,
});

const getProfileFollowingsColumnProps = props => ({
    column: props.column.set('value', props.ethAddress),
    ethAddress: props.ethAddress,
    intl: props.intl,
    isVisible: props.isVisible,  
    title: props.intl.formatMessage(profileMessages.followings),
    onItemRequest: column => props.profileFollowingsIterator({ column, batching: true }),
    onItemMoreRequest: column => props.profileMoreFollowingsIterator({ column, batching: true }),
    onColumnRefresh: (column) => {
        props.dashboardResetColumnEntries(column.id);
        props.profileFollowingsIterator({ column, batching: true });
    },
    itemCard: <ProfileCard />
});

export default {
    [columnTypes.latest]: getLatestColumnProps,
    [columnTypes.list]: getListColumnProps,
    [columnTypes.tag]: getTagColumnProps,
    [columnTypes.stream]: getStreamColumnProps,
    [columnTypes.profile]: getProfileColumnProps,
    [columnTypes.profileComments]: getProfileCommentsColumnProps,
    [columnTypes.profileEntries]: getProfileEntriesColumnProps,
    [columnTypes.profileFollowers]: getProfileFollowersColumnProps,
    [columnTypes.profileFollowings]: getProfileFollowingsColumnProps,
};
