import * as Promise from 'bluebird';
import * as SearchIndex from 'search-index';
import { CORE_MODULE } from '@akashaproject/common/constants';

export const dbs = {
  entry: {
    path: 'akasha#beta/entry-index',
    additional: {
      fieldOptions: {
        excerpt: {
          searchable: true,
          preserveCase: false,
        },
        title: {
          searchable: true,
          preserveCase: false,
        },
      },
    },
    searchIndex: null,
  },
  tags: {
    path: 'akasha#beta/tags-index',
    searchIndex: null,
    additional: {},
  },
  profiles: {
    path: 'akasha#beta/profileID-index',
    searchIndex: null,
    additional: {},
  },
};

class StorageIndex {
  readonly options: any;

  constructor(dbPath: string, additional?: any) {
    this.options = Object.assign(
      {},
      {
        indexPath: dbPath,
        appendOnly: false,
        preserveCase: false,
        nGramLength: { gte: 1, lte: 4 },
      },
      additional,
    );
  }

  init() {
    return Promise
    .fromCallback((cb) => SearchIndex(this.options, cb));
  }
}

export default function (sp) {
  const dbService = function () {
    return dbs;
  };
  sp().service(CORE_MODULE.DB_INDEX, dbService);
  return { init };
}

// this should be initialized after initiating the module
export const init = function init() {
  const waitFor = Object.keys(dbs).map((index) => {
    return new StorageIndex(dbs[index].path, dbs[index].additional).init()
    .then(si => dbs[index].searchIndex = si);
  });
  return Promise.all(waitFor);
};
