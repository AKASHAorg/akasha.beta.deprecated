import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import { BACKUP_KEYS_NAME } from '../../config/settings';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { app } from 'electron';
import * as archiver from 'archiver';

const execute = Promise.coroutine(function* (data: { target?: string }) {
    const dataDir = yield GethConnector.getInstance().web3.admin.getDatadirAsync();
    const keyDir = join(dataDir, 'keystore/');

    const downloads = (data.target) ? data.target : app.getPath('downloads');
    const target = join(downloads, BACKUP_KEYS_NAME);

    const output = createWriteStream(target);
    const archive = archiver('zip', { store: true });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    archive.directory(keyDir, false);
    archive.finalize();

    yield Promise.delay(2000);
    return { target: target };
});

export default { execute, name: 'backupKeys' };
