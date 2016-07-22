const Application = require('spectron').Application;
const path = require('path');
require('babel-register');
const expect = require('chai').expect;

function getElectronPath () {
    let electronPath = path.join(__dirname, '../../', 'node_modules', '.bin', 'electron');
    if (process.platform === 'win32') electronPath += '.cmd';
    return electronPath;
}

describe('application launch', function () {
    let client;
    let app;
    this.timeout(10000);

    before(() => {
        this.app = new Application({
            path: getElectronPath(),
            args: ['./test/spectron/main.js']
        });
        return this.app.start().then(() => {
            client = this.app.client;
            app = this.app;
            client.timeoutsImplicitWait(5000);
            client.timeoutsAsyncScript(5000);
        });
    });
});
