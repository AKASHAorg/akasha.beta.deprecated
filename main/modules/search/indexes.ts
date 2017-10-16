import Storage from './Storage';
import { app } from 'electron';
import { join as pathJoin } from 'path';

export const dbs = {
    entry: {
        path: pathJoin(app.getPath('userData'), 'entry-index'),
        searchIndex: null
    }
};

export default function init() {
    const waitFor = Object.keys(dbs).map((index) => {
        return new Storage(dbs[index].path).init().then(si => dbs[index].searchIndex = si);
    });
    return Promise.all(waitFor);
}