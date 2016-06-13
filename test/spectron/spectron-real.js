/* eslint strict: 0 */
'use strict';
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
            args: ['./main.js'],
            env: {
                HOT: true
            }
        });
        return this.app.start().then(() => {
            client = this.app.client;
            app = this.app;
            client.timeoutsImplicitWait(5000);
            client.timeoutsAsyncScript(5000);
        });
    });

    after(() => {
        // if (this.app && this.app.isRunning()) {
        //     return this.app.stop();
        // }
    });

    it('click next button', () => {
        return client
            .waitUntilWindowLoaded(7000)
            .click('#root > div > div.start-xs > div > div > div.end-xs > div')
            .pause(1000)
            .isVisible('//*[@id="root"]/div/div[1]/div/div/div[1]/div/div[3]/div[1]/div/svg').then((isVisible) => {
                expect(isVisible).to.be.true;
            })
    });
});

