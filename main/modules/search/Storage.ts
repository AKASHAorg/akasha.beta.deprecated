import * as SearchIndex from 'search-index';
import * as Promise from 'bluebird';

export default class StorageIndex {
    private _options: any;

    constructor(dbPath: string) {
        this._options = { indexPath: dbPath, appendOnly: false };
    }

    /**
     *
     * @returns {Bluebird<any>}
     */
    init() {
        return Promise.fromCallback((cb) => SearchIndex(this._options, cb));
    }
}
