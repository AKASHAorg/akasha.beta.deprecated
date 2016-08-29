/// <reference path="../typings/main.d.ts" />
import TestsHelper from './setup';
import { resolve } from 'path';
import { expect } from 'chai';

describe('Auth IPC module', function(){
    TestsHelper.setupTimeout(this);
    const main = resolve(__dirname, '..', '..');
    let app: any;
    before(function () {
        return TestsHelper.startApplication({
            args: [main],
            env: {
                HOT: 1
            }
        }).then((dataObj: any) => {
            app = dataObj;
            return dataObj;
        });
    });

    it('should be started', function() {
       expect(app).to.be.an('object');
        return TestsHelper.deployContracts();
    });

    after(function() {
       return TestsHelper.stopApplication(app);
    });
});
