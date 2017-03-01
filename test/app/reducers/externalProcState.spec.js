import chai from 'chai';
import chaiIM from 'chai-immutable';
import EProcReducer from '../../../app/local-flux/reducers/externalProcState';
import { GethModel, IpfsModel } from '../../../app/local-flux/reducers/models';
import { ErrorRecord, GethStatus } from '../../../app/local-flux/reducers/records';
import * as types from '../../../app/local-flux/constants/external-process-constants';
import { gethStatus, gethSyncStatus, gethStart, gethStartError } from '../response-data/geth';
import { ipfsStatus } from '../response-data/ipfs';
import { fromJS, Map, Record } from 'immutable';

chai.use(chaiIM);
const { expect } = chai;
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
    describe(`should handle ${types.START_GETH}`, () => {
        it('should set startRequested flag to true', () => {
            modifiedState = EProcReducer(modifiedState, { type: types.START_GETH });
            expect(modifiedState.getIn(['geth', 'flags', 'startRequested'])).to.be.true;
        });
        it('flags should be an Immutable.Record instance', () => {
            modifiedState = EProcReducer(modifiedState, { type: types.START_GETH });
            expect(modifiedState.getIn(['geth', 'flags'])).to.be.instanceof(Record);
        });
    });
    describe(`should handle ${types.START_GETH_SUCCESS}`, () => {
        it('should set status to starting', () => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.START_GETH_SUCCESS,
                data: gethStatus
            });
            expect(modifiedState.getIn(['geth', 'status', 'starting'])).to.be.true;
        });
    });
    describe(`should handle ${types.STOP_GETH}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {type: types.STOP_GETH});
        });
        it('should set startRequested flag to false', () => {
            expect(modifiedState.getIn(['geth', 'flags', 'startRequested'])).to.be.false;
        });
        it('should set busyState flag to true', () => {
            expect(modifiedState.getIn(['geth', 'flags', 'busyState'])).to.be.true;
        });
    });
    describe(`should handle ${types.STOP_GETH_SUCCESS}`, () => {
        modifiedState = EProcReducer(modifiedState, {type: types.STOP_GETH_SUCCESS});
        it('flags should be always am Immutable.Record instance', () => {
            expect(modifiedState.getIn(['geth', 'flags'])).to.be.instanceof(Record);
        });
        it('should not modify status type from Immutable.Record', () => {
            expect(modifiedState.getIn(['geth', 'status'])).to.be.instanceof(Record);
        });
    });
    describe(`should handle ${types.GET_GETH_STATUS_SUCCESS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.GET_GETH_STATUS_SUCCESS,
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
    describe(`should handle ${types.START_IPFS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, { type: types.START_IPFS });
        });
        it('flags should be always an Immutable.Record instance', () => {
            expect(modifiedState.getIn(['ipfs', 'flags'])).to.be.instanceof(Record);
        });
        it('should set startRequested flag to true', () => {
            expect(modifiedState.getIn(['ipfs', 'flags', 'startRequested'])).to.be.true;
        });
        it('should set busyState flag to true', () => {
            expect(modifiedState.getIn(['ipfs', 'flags', 'busyState'])).to.be.true;
        });
    });
    describe(`should handle ${types.START_IPFS_SUCCESS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.START_IPFS_SUCCESS,
                data: ipfsStatus
            });
        });
        it('ipfs.get("status") should always return a Record instance', () => {
            expect(modifiedState.getIn(['ipfs', 'status'])).to.be.instanceof(Record);
        });
        it(`should have keys: ${Object.keys(ipfsStatus)}`, () => {
            expect(modifiedState.getIn(['ipfs', 'status'])).to.have.keys(Object.keys(ipfsStatus));
        });
        it('should switch started flag to true', () => {
            modifiedState = EProcReducer(modifiedState, {
                type: types.START_IPFS_SUCCESS,
                data: {
                  started: true
                }
            });
            expect(modifiedState.getIn(['ipfs', 'status', 'started'])).to.be.true;
        });
    });
    describe(`should handle ${types.GET_IPFS_STATUS_SUCCESS}`, () => {
        beforeEach(() => {
            modifiedState = EProcReducer(modifiedState, { type: types.GET_IPFS_STATUS_SUCCESS, data: ipfsStatus })
        });
        it('ipfs.get("status") should always return a record', () => {
            expect(modifiedState.getIn(['ipfs', 'status'])).to.be.instanceof(Record);
        });
        it(`should have keys: ${Object.keys(ipfsStatus)}`, () => {
            expect(modifiedState.getIn(['ipfs', 'status'])).to.have.keys(Object.keys(ipfsStatus));
        });
    });
});
