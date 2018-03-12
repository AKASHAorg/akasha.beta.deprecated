import * as Promise from 'bluebird';
import { BrowserWindow } from 'electron';

const execute = Promise.coroutine(function* () {
    BrowserWindow.getAllWindows()[0].reload();
    return Promise.resolve({ reloadPage: true });
});

export default { execute, name: 'reloadPage' };
