import Loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';
import * as Promise from 'bluebird';
import actionCollection from './action';
import claimableCollection from './claimable';
import dashboardCollection from './dashboard';
import entriesCollection from './entry';
import highlightCollection from './highlight';
import listCollection from './list';
import profileCollection from './profile';
import searchCollection from './search';
import settingsCollection from './settings';

const idbAdapter = new LokiIndexedAdapter('aka-shard');
// const pa = new LokiPartitioningAdapter(idbAdapter, {paging: true});
const collections = [
    actionCollection,
    claimableCollection,
    dashboardCollection,
    entriesCollection,
    highlightCollection,
    listCollection,
    profileCollection,
    searchCollection,
    settingsCollection
];

export const akashaDB = new Loki('akashaDB-beta', {
    adapter: idbAdapter,
    autoload: false,
    autosave: false,
    env: 'BROWSER'
});

// Moved: from 'rootSaga' to 'app/index.js'
//
// calling this in root saga will block the middleware from listening actions!!
// because we need the database from the start of the app
// if we encounter an error it is better to inform the user and
// stop loading the app
export const loadAkashaDB = () =>
    Promise.fromCallback(cb =>
        akashaDB.loadDatabase({}, () => {
            collections.forEach(record => {
                if (!akashaDB.getCollection(record.collectionName)) {
                    akashaDB.addCollection(record.collectionName, record.options);
                }
                akashaDB
                    .getCollection(record.collectionName)
                    .checkAllIndexes({ repair: true, randomSampling: false });
            });
            cb('', akashaDB);
        })
    );

export const getActionCollection = () => akashaDB.getCollection(actionCollection.collectionName);
export const getClaimableCollection = () => akashaDB.getCollection(claimableCollection.collectionName);
export const getDashboardCollection = () => akashaDB.getCollection(dashboardCollection.collectionName);
export const getEntriesCollection = () => akashaDB.getCollection(entriesCollection.collectionName);
export const getHighlightCollection = () => akashaDB.getCollection(highlightCollection.collectionName);
export const getListCollection = () => akashaDB.getCollection(listCollection.collectionName);
export const getProfileCollection = () => akashaDB.getCollection(profileCollection.collectionName);
export const getSearchCollection = () => akashaDB.getCollection(searchCollection.collectionName);
export const getSettingsCollection = () => akashaDB.getCollection(settingsCollection.collectionName);
