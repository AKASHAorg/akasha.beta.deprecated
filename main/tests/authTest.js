"use strict";
const setup_1 = require('./setup');
const path_1 = require('path');
const chai_1 = require('chai');
describe('Auth IPC module', function () {
    setup_1.default.setupTimeout(this);
    const main = path_1.resolve(__dirname, '..', '..');
    let app;
    before(function () {
        return setup_1.default.startApplication({
            args: [main],
            env: {
                HOT: 1
            }
        }).then((dataObj) => {
            app = dataObj;
            return dataObj;
        });
    });
    it('should be started', function () {
        chai_1.expect(app).to.be.an('object');
        return setup_1.default.deployContracts();
    });
    after(function () {
        return setup_1.default.stopApplication(app);
    });
});
//# sourceMappingURL=authTest.js.map