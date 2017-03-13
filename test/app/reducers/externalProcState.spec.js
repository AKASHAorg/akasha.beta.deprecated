import chai, { expect } from 'chai';
import chaiIM from 'chai-immutable';
import EProcReducer from '../../../app/local-flux/reducers/externalProcState';
import { GethModel, IpfsModel } from '../../../app/local-flux/reducers/models';
import { ErrorRecord, GethStatus } from '../../../app/local-flux/reducers/records';
import * as types from '../../../app/local-flux/constants';
import { gethStatus, gethSyncStatus, gethStart, gethStop, gethStartError } from '../response-data/geth';
import { ipfsStatus } from '../response-data/ipfs';
import { fromJS, Map, Record } from 'immutable';

chai.use(chaiIM);
// EProcReducer(<initialState>, <action>)


describe('ExternalProcState Reducer', function() {
    const initialState = fromJS({
        geth: new GethModel(),
        ipfs: new IpfsModel()
    });
    let modifiedState = null;
    beforeEach(() => {
      modifiedState = initialState;
    });
    describe('should handle INITIAL STATE', () => {
        modifiedState = EProcReducer(undefined, {});
        it('should return initialState when action is undefined', () => {
            expect(modifiedState.equals(initialState)).to.be.true;
        });
    });
    describe(`should handle ${types.GETH_START}`, () => {
        it('should set gethStarting flag to true', () => {
            modifiedState = EProcReducer(modifiedState, { type: types.GETH_START });
            expect(modifiedState.getIn(['geth', 'flags', 'gethStarting'])).to.be.true;
        });
        it('flags should be an Immutable.Record instance', () => {
            modifiedState = EProcReducer(modifiedState, { type: types.GETH_START });
            expect(modifiedState.getIn(['geth', 'flags'])).to.be.instanceof(Record);
        });
    });
    describe(`should handle ${types.GETH_START_SUCCESS}`, () => {
        it('should set status to starting', () => {
            gethStatus.starting = true;
            modifiedState = EProcReducer(modifiedState, {
                type: types.GETH_START_SUCCESS,
                data: gethStatus
            });
            expect(modifiedState.getIn(['geth', 'status', 'starting'])).to.be.true;
        });
    });
    describe(`should handle ${types.GETH_STOP}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {type: types.GETH_STOP});
        });
        it.skip('should set startRequested flag to false', () => {
            expect(modifiedState.getIn(['geth', 'flags', 'startRequested'])).to.be.false;
        });
        it('should set busyState flag to true', () => {
            expect(modifiedState.getIn(['geth', 'flags', 'busyState'])).to.be.true;
        });
    });
    describe(`should handle ${types.GETH_STOP_SUCCESS}`, () => {
        modifiedState = EProcReducer(modifiedState, {
            type: types.GETH_STOP_SUCCESS,
            data: gethStop
        });
        it('flags should be always am Immutable.Record instance', () => {
            expect(modifiedState.getIn(['geth', 'flags'])).to.be.instanceof(Record);
        });
        it('should not modify status type from Immutable.Record', () => {
            expect(modifiedState.getIn(['geth', 'status'])).to.be.instanceof(Record);
        });
    });
    describe(`should handle ${types.GETH_GET_STATUS_SUCCESS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.GETH_GET_STATUS_SUCCESS,
                data: {
                  stopped: true
                }
            });
        });
        it('status should remain a Record instance', () => {
            expect(modifiedState.getIn(['geth', 'status'])).to.be.instanceof(Record);
        });
        it('should switch stopped status key to true', () => {
            expect(modifiedState.getIn(['geth', 'status', 'stopped'])).to.be.true;
        });
        it(`should have keys: ${Object.keys(gethStatus)}`, () => {
            expect(modifiedState.getIn(['geth', 'status'])).to.have.keys(Object.keys(gethStatus));
        });
    });
    describe(`should handle ${types.IPFS_START}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, { type: types.IPFS_START });
        });
        it('flags should be always an Immutable.Record instance', () => {
            expect(modifiedState.getIn(['ipfs', 'flags'])).to.be.instanceof(Record);
        });
        it('should set startRequested flag to true', () => {
            expect(modifiedState.getIn(['ipfs', 'flags', 'ipfsStarting'])).to.be.true;
        });
        it('should set busyState flag to true', () => {
            expect(modifiedState.getIn(['ipfs', 'flags', 'busyState'])).to.be.true;
        });
    });
    describe(`should handle ${types.IPFS_START_SUCCESS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.IPFS_START_SUCCESS,
                data: ipfsStatus
            });
        });
        it('ipfs.get("status") should always return a Record instance', () => {
            expect(modifiedState.getIn(['ipfs', 'status'])).to.be.instanceof(Record);
        });
        it(`ipfs.get("status") should have keys: ${Object.keys(ipfsStatus)}`, () => {
            expect(modifiedState.getIn(['ipfs', 'status'])).to.have.keys(Object.keys(ipfsStatus));
        });
        it('should switch started flag to true', () => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.IPFS_START_SUCCESS,
                data: {
                  started: true
                }
            });
            expect(modifiedState.getIn(['ipfs', 'status', 'started'])).to.be.true;
        });
    });
    describe(`should handle ${types.IPFS_GET_STATUS_SUCCESS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, { type: types.IPFS_GET_STATUS_SUCCESS, data: ipfsStatus })
        });
        it('ipfs.get("status") should always return a record', () => {
            expect(modifiedState.getIn(['ipfs', 'status'])).to.be.instanceof(Record);
        });
        it(`ipfs.get("status") should have keys: ${Object.keys(ipfsStatus)}`, () => {
            expect(modifiedState.getIn(['ipfs', 'status'])).to.have.keys(Object.keys(ipfsStatus));
        });
    });
    describe(`should handle ${types.IPFS_GET_PORTS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
              type: types.IPFS_GET_PORTS
            });
        });
        it('should set portsRequested flag to true', () => {
            expect(modifiedState.getIn(['ipfs', 'flags', 'portsRequested'])).to.be.true;
        });
        it('ipfs.get("flags") should always return a Record instance', () => {
            expect(modifiedState.getIn(['ipfs', 'flags'])).to.be.instanceof(Record);
        });
    });
    describe(`should handle ${types.IPFS_GET_PORTS_SUCCESS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.IPFS_GET_PORTS_SUCCESS,
                data: ipfsStatus
            });
        });
        it('should set portsRequested flag to false', () => {
            expect(modifiedState.getIn(['ipfs', 'flags', 'portsRequested'])).to.be.false;
        });
        it('ipfs.get("flags") should always return a Record instance', () => {
            expect(modifiedState.getIn(['ipfs', 'flags'])).to.be.instanceof(Record);
        });
    });
    describe.skip(`should handle ${types.GETH_GET_SYNC_STATUS_SUCCESS}`, () => {
        it('should be tested later!');
    });
    describe.skip(`should handle ${types.GETH_SYNC_ACTIVE}`, () => {
        it('should also be tested later!');
    });
    describe(`should handle ${types.GETH_STOP_SYNC}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.GETH_STOP_SYNC
            });
        });
        it('should set syncActionId to 3', () => {
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(3);
        });
        it('should set peerCount in syncStatus to null', () => {
            expect(modifiedState.getIn(['geth', 'syncStatus', 'peerCount'])).to.be.null;
        });
        it('should set synced flag in syncstatus to false', () => {
            expect(modifiedState.getIn(['geth', 'syncStatus', 'synced'])).to.be.false;
        });
        it('geth.get("flags") should always return a Record', () => {
            expect(modifiedState.getIn(['geth', 'flags'])).to.be.instanceof(Record);
        });
        it('geth.get("syncStatus") should always return a Record', () => {
            expect(modifiedState.getIn(['geth', 'syncStatus'])).to.be.instanceof(Record);
        });
    });
    describe(`should handle ${types.GETH_PAUSE_SYNC}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.GETH_PAUSE_SYNC
            });
        });
        it('should set syncActionId in flags to value => 2', () => {
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(2);
        });
        it('should set peerCount in syncStatus to null', () => {
            expect(modifiedState.getIn(['geth', 'syncStatus', 'peerCount'])).to.be.null;
        });
        it('should set synced in syncStatus to false', () => {
            expect(modifiedState.getIn(['geth', 'syncStatus', 'synced'])).to.be.false;
        });
        it('geth.get("flags") should always return a Record', () => {
            expect(modifiedState.getIn(['geth', 'flags'])).to.be.instanceof(Record);
        });
        it('geth.get("syncStatus") should return a Record', () => {
            expect(modifiedState.getIn(['geth', 'syncStatus'])).to.be.instanceof(Record)
        });
    });
    describe(`should handle ${types.GETH_RESUME_SYNC}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.GETH_RESUME_SYNC
            });
        });
        it('should set flags.syncActionId flag to 1', () => {
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(1);
        });
        it('should set syncStatus.peercount to null', () => {
            expect(modifiedState.getIn(['geth', 'syncStatus', 'peerCount'])).to.be.null;
        });
        it('should set syncStatus.synced to false', () => {
            expect(modifiedState.getIn(['geth', 'syncStatus', 'synced'])).to.be.false;
        });
        it('geth.flags should always return a Record', () => {
            expect(modifiedState.getIn(['geth', 'flags'])).to.be.instanceof(Record);
        });
        it('geth.status should always return a Record', () => {
            expect(modifiedState.getIn(['geth', 'status'])).to.be.instanceof(Record);
        });
    });
    describe.skip(`should handle ${types.GETH_SYNC_FINISHED}`, () => {});
    describe.skip(`should handle ${types.GETH_RESET_BUSY}`, () => {});
    describe.skip(`should handle ${types.IPFS_RESET_BUSY}`, () => {});
    describe(`should handle ${types.GETH_GET_LOGS_SUCCESS}`, () => {
        beforeEach(() => {
          this.now = Date.now();
          modifiedState = EProcReducer(modifiedState, {
              type: types.GETH_GET_LOGS_SUCCESS,
              data: [{
                  timestamp: this.now,
                  message: 'should be always first'
                }, {
                  timestamp: this.now + 10,
                  message: ''
                }, {
                  timestamp: this.now + 20,
                  message: ''
                }, {
                  timestamp: this.now + 30,
                  message: ''
                }]
          });
        });
        it('should create new records in geth.logs', () => {
            expect(modifiedState.getIn(['geth', 'logs'])).to.have.size(4)
        });
        it('should contain only unique records', () => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.GETH_GET_LOGS_SUCCESS,
                data: [{
                    timestamp: this.now + 10, // intentionally duplicate
                    message: ''
                }, {
                    timestamp: this.now + 5,
                    message: ''
                }, {
                    timestamp: this.now + 30,
                    message: 'same timestamp but different log!'
                }, {
                    timestamp: this.now + 30,
                    message: ''
                }]
            });
            expect(modifiedState.getIn(['geth', 'logs'])).to.have.size(6);
        });
    });
    describe.skip(`should handle ${types.IPFS_GET_LOGS_SUCCESS}`, () => {
        it.skip(`should be same as ${types.GETH_GET_LOGS_SUCCESS}`);
    });
});
