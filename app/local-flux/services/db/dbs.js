import Loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';
import {collectionName, options} from './action';

const idbAdapter = new LokiIndexedAdapter();
const pa = new Loki.LokiPartitioningAdapter(idbAdapter, { paging: true });

export const akashaDB = new Loki('akashaDB-beta', {
    adapter: pa,
    autoload: true,
    autoloadCallback : function () {
        let actions = akashaDB.getCollection(collectionName);
        if (actions === null) {
            actions = akashaDB.addCollection(collectionName, options);
        }

    },
    autosave: true,
    autosaveInterval: 4000
});
