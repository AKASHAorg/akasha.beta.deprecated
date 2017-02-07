"use strict";
const Promise = require('bluebird');
const geth_connector_1 = require('@akashaproject/geth-connector');
const settings_1 = require('../../config/settings');
const path_1 = require('path');
const fs_1 = require('fs');
const electron_1 = require('electron');
const archiver = require('archiver');
const execute = Promise.coroutine(function* (data) {
    const dataDir = yield geth_connector_1.GethConnector.getInstance().web3.admin.getDatadirAsync();
    const keyDir = path_1.join(dataDir, 'keystore/');
    const downloads = (data.target) ? data.target : electron_1.app.getPath('downloads');
    const target = path_1.join(downloads, settings_1.BACKUP_KEYS_NAME);
    const output = fs_1.createWriteStream(target);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'backupKeys' };
//# sourceMappingURL=backup-keystore.js.map