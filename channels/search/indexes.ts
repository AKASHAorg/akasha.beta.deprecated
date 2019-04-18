import * as Promise from 'bluebird';
import { CORE_MODULE } from '@akashaproject/common/constants';

const searchIndex = require('search-index');

export const dbs = {
  entry: {
    path: 'beta-entry-index',
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
    path: 'beta-tags-index',
    searchIndex: null,
    additional: {},
  },
  profiles: {
    path: 'beta-profileID-index',
    searchIndex: null,
    additional: {},
  },
};

class StorageIndex {
  readonly options: any;

  constructor (dbPath: string, opts: { additional?: any, prefix?: string }) {
    this.options = Object.assign(
      {},
      {
        indexPath: opts.prefix ? `${opts.prefix}${dbPath}` : dbPath,
        appendOnly: false,
        preserveCase: false,
        nGramLength: { gte: 1, lte: 4 },
      },
      opts.additional,
    );
  }

  init () {
    return Promise
      .fromCallback(cb => searchIndex(this.options, cb));
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
export const init = function init (prefix?: string) {
  const waitFor = Object.keys(dbs).map((index) => {
    return new StorageIndex(dbs[index].path, { prefix, additional: dbs[index].additional }).init()
      .then(si => dbs[index].searchIndex = si);
  });
  return Promise.all(waitFor);
};
