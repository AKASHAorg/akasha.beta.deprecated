import Loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';
import actionCollection from './action';
import dashboardCollection from './dashboard';

const idbAdapter = new LokiIndexedAdapter('aka-shard');
const pa = new Loki.LokiPartitioningAdapter(idbAdapter, {paging: true});
const collections = [actionCollection, dashboardCollection];

export const akashaDB = new Loki('akashaDB-beta', {
    adapter: pa,
    autoload: true,
    autoloadCallback: function () {
        collections.forEach(record => {
            console.log('actions', record.collectionName);
            if (!akashaDB.getCollection(record.collectionName)) {
                akashaDB.addCollection(record.collectionName, record.options);
            }
        });
    },
    autosave: true,
    autosaveInterval: 4000
});

export const getActionCollection = () => akashaDB.getCollection(actionCollection.collectionName);
export const getDashboardCollection = () => akashaDB.getCollection(dashboardCollection.collectionName);
