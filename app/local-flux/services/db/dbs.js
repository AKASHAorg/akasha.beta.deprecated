import Loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';
import actionCollection from './action';
import dashboardCollection from './dashboard';
import entriesCollection from './entry';
import highlightCollection from './highlight';
import listCollection from './list';
import profileCollection from './profile';
import searchCollection from './search';
import settingsCollection from './settings';

const idbAdapter = new LokiIndexedAdapter('aka-shard');
const pa = new Loki.LokiPartitioningAdapter(idbAdapter, {paging: true});
const collections = [
    actionCollection,
    dashboardCollection,
    entriesCollection,
    highlightCollection,
    listCollection,
    profileCollection,
    searchCollection,
    settingsCollection
];

export const akashaDB = new Loki('akashaDB-beta', {
    adapter: pa,
    autoload: false,
    autosave: true,
    autosaveInterval: 4000
});

export const loadAkashaDB  = () => new Promise(resolve =>
    akashaDB.loadDatabase({}, () => {
        collections.forEach(record => {
            if (!akashaDB.getCollection(record.collectionName)) {
                akashaDB.addCollection(record.collectionName, record.options);
            }
        });
        resolve();
    })
);

export const getActionCollection = () => akashaDB.getCollection(actionCollection.collectionName);
export const getDashboardCollection = () => akashaDB.getCollection(dashboardCollection.collectionName);
export const getEntriesCollection = () => akashaDB.getCollection(entriesCollection.collectionName);
export const getHighlightCollection = () => akashaDB.getCollection(highlightCollection.collectionName);
export const getListCollection = () => akashaDB.getCollection(listCollection.collectionName);
export const getProfileCollection = () => akashaDB.getCollection(profileCollection.collectionName);
export const getSearchCollection = () => akashaDB.getCollection(searchCollection.collectionName);
export const getSettingsCollection = () => akashaDB.getCollection(settingsCollection.collectionName);
