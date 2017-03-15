import { fromJS } from 'immutable';
import chai, { expect } from 'chai';
import chaiIM from 'chai-immutable';
import EProcReducer from '../../../app/local-flux/reducers/externalProcState';
import { GethModel, IpfsModel } from '../../../app/local-flux/reducers/models';
import { LogRecord } from '../../../app/local-flux/reducers/records';
import * as actions from '../../../app/local-flux/actions/external-process-actions';
import * as types from '../../../app/local-flux/constants';

chai.use(chaiIM);

/* eslint-disable no-unused-expressions */

describe('ExternalProcState Reducer', () => {  // eslint-disable-line max-statements
    const initialState = fromJS({
        geth: new GethModel(),
        ipfs: new IpfsModel()
    });
    let modifiedState = null;

    describe('INITIAL STATE', () => {
        modifiedState = EProcReducer(undefined, {});
        it('should return initialState when action is undefined', () => {
            expect(modifiedState.equals(initialState)).to.be.true;
        });
    });
    describe(types.GETH_START, () => {
        it('should set corresponding flags', () => {
            modifiedState = EProcReducer(modifiedState, actions.gethStart());
            expect(modifiedState.getIn(['geth', 'flags', 'gethStarting'])).to.be.true;
            expect(modifiedState.getIn(['geth', 'flags', 'busyState'])).to.be.true;
        });
        it('should reset the \'stopped\' status', () => {
            const state = initialState.setIn(['geth', 'status', 'stopped'], true);
            expect(state.getIn(['geth', 'status', 'stopped'])).to.be.true;
            modifiedState = EProcReducer(state, actions.gethStart());
            expect(modifiedState.getIn(['geth', 'status', 'stopped'])).to.be.false;
        });
    });
    describe(types.GETH_START_SUCCESS, () => {
        it('should set status to starting', () => {
            const response = { api: false, spawned: false, starting: true };
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(0,
                'initial syncActionId is not 0');
            modifiedState = EProcReducer(initialState, actions.gethStartSuccess(response));
            expect(modifiedState.getIn(['geth', 'status', 'starting'])).to.be.true;
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(1,
                'syncActionId did not update to 1 (synchronizing)');
        });
        it('should not update syncActionId if geth is synced', () => {
            const response = { api: false, spawned: false, starting: true };
            const state = initialState.setIn(['geth', 'syncActionId'], 4);
            // State before
            expect(state.getIn(['geth', 'syncActionId'])).to.equal(4,
                'initial syncActionId is not 4');
            modifiedState = EProcReducer(state, actions.gethStartSuccess(response));
            // State after
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(4,
                'syncActionId was changed even if geth is synced');
        });
        it('should reset downloading status', () => {
            const response = { api: false, spawned: false, starting: true };
            const state = initialState.mergeIn(['geth', 'status'], {
                downloading: true, upgrading: true
            });
            // State before
            expect(state.getIn(['geth', 'status', 'downloading'])).to.be.true;
            expect(state.getIn(['geth', 'status', 'upgrading'])).to.be.true;
            modifiedState = EProcReducer(initialState, actions.gethStartSuccess(response));
            // State after
            expect(modifiedState.getIn(['geth', 'status', 'downloading'])).to.be.null;
            expect(modifiedState.getIn(['geth', 'status', 'upgrading'])).to.be.null;
        });
        it('should set status to spawned', () => {
            const response = { api: false, spawned: true };
            const state = initialState.mergeIn(['geth', 'status'], { starting: true });
            // State before
            expect(state.getIn(['geth', 'status', 'starting'])).to.be.true;
            modifiedState = EProcReducer(initialState, actions.gethStartSuccess(response));
            // State after
            expect(modifiedState.getIn(['geth', 'status', 'starting'])).to.be.null;
            expect(modifiedState.getIn(['geth', 'status', 'spawned'])).to.be.true;
        });
        it('should set api and started', () => {
            const response = { api: true, spawned: true, started: true };
            modifiedState = EProcReducer(initialState, actions.gethStartSuccess(response));
            expect(modifiedState.getIn(['geth', 'status', 'api'])).to.be.true;
            expect(modifiedState.getIn(['geth', 'status', 'spawned'])).to.be.true;
            expect(modifiedState.getIn(['geth', 'status', 'starting'])).to.be.null;
            expect(modifiedState.getIn(['geth', 'status', 'started'])).to.be.true;
        });
        it('should ignore the action if geth is stopped', () => {
            const response = { api: true, spawned: true, started: true };
            const state = initialState.mergeIn(['geth', 'status'], { stopped: true });
            // State before
            expect(state.getIn(['geth', 'status', 'stopped'])).to.be.true;
            expect(state.getIn(['geth', 'status', 'spawned'])).to.not.be.ok;
            modifiedState = EProcReducer(state, actions.gethStartSuccess(response));
            // State after
            expect(modifiedState.getIn(['geth', 'status', 'api'])).to.not.be.ok;
            expect(modifiedState.getIn(['geth', 'status', 'spawned'])).to.not.be.ok;
            expect(modifiedState.getIn(['geth', 'status', 'started'])).to.not.be.ok;
            expect(modifiedState.getIn(['geth', 'status', 'stopped'])).to.be.true;
        });
    });
    describe(types.GETH_START_ERROR, () => {
        it('should set corresponding flags', () => {
            const data = { api: false, spawned: false };
            const state = initialState.setIn(['geth', 'flags', 'gethStarting'], true);
            modifiedState = EProcReducer(state, actions.gethStartError(data, {}));
            expect(modifiedState.getIn(['geth', 'flags', 'gethStarting'])).to.be.false;
        });
    });
    describe(types.GETH_STOP, () => {
        it('should set corresponding flags', () => {
            modifiedState = EProcReducer(initialState, actions.gethStop());
            expect(modifiedState.getIn(['geth', 'flags', 'busyState'])).to.be.true;
        });
    });
    describe(types.GETH_STOP_SUCCESS, () => {
        it('should set the correct status', () => {
            const resp = { api: false, spawned: false, stopped: true };
            const state = initialState.mergeIn(['geth', 'status'], {
                api: true, spawned: true, starting: true, started: true
            });
            modifiedState = EProcReducer(state, actions.gethStopSuccess(resp));
            expect(modifiedState.getIn(['geth', 'status', 'api'])).to.be.false;
            expect(modifiedState.getIn(['geth', 'status', 'spawned'])).to.be.false;
            expect(modifiedState.getIn(['geth', 'status', 'starting'])).to.be.false;
            expect(modifiedState.getIn(['geth', 'status', 'started'])).to.be.false;
            expect(modifiedState.getIn(['geth', 'status', 'stopped'])).to.be.true;
        });
        it('should set the correct syncActionId', () => {
            const resp = { api: false, spawned: false, stopped: true };
            let state = initialState.mergeIn(['geth', 'status'], { api: true, spawned: true });
            modifiedState = EProcReducer(state, actions.gethStopSuccess(resp));
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(3,
                'did not set the syncActionId to 3 (stopped)');
            state = initialState.setIn(['geth', 'syncActionId'], 2);
            modifiedState = EProcReducer(state, actions.gethStopSuccess(resp));
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(2,
                'changed the syncActionId from 2 (paused)');
        });
    });
    describe(types.GETH_GET_STATUS_SUCCESS, () => {
        it('should update the state correctly', () => {
            const resp = { api: true, blockNr: 1234, spawned: true };
            modifiedState = EProcReducer(initialState, actions.gethGetStatusSuccess(resp));
            expect(modifiedState.getIn(['geth', 'status', 'api'])).to.be.true;
            expect(modifiedState.getIn(['geth', 'status', 'blockNr'])).to.equal(1234,
                'block number was not updated');
            expect(modifiedState.getIn(['geth', 'status', 'spawned'])).to.be.true;
        });
    });
    describe(types.IPFS_START, () => {
        it('should set corresponding flags', () => {
            modifiedState = EProcReducer(modifiedState, actions.ipfsStart());
            expect(modifiedState.getIn(['ipfs', 'flags', 'ipfsStarting'])).to.be.true;
            expect(modifiedState.getIn(['ipfs', 'flags', 'busyState'])).to.be.true;
        });
    });
    describe(types.IPFS_START_SUCCESS, () => {
        it('should set the correct status', () => {
            const response = { api: false, spawned: true, started: true };
            modifiedState = EProcReducer(initialState, actions.ipfsStartSuccess(response));
            expect(modifiedState.getIn(['ipfs', 'status', 'api'])).to.be.false;
            expect(modifiedState.getIn(['ipfs', 'status', 'spawned'])).to.be.true;
            expect(modifiedState.getIn(['ipfs', 'status', 'started'])).to.be.true;
        });
        it('should reset downloading status', () => {
            const response = { api: false, spawned: true, started: true };
            const state = initialState.mergeIn(['ipfs', 'status'], { downloading: true });
            // State before
            expect(state.getIn(['ipfs', 'status', 'downloading'])).to.be.true;
            modifiedState = EProcReducer(initialState, actions.ipfsStartSuccess(response));
            // State after
            expect(modifiedState.getIn(['ipfs', 'status', 'downloading'])).to.be.null;
        });
    });
    describe(types.IPFS_START_ERROR, () => {
        it('should reset the flags', () => {
            const data = { api: true, spawned: false };
            modifiedState = EProcReducer(initialState, actions.ipfsStartError(data, {}));
            expect(modifiedState.getIn(['ipfs', 'flags', 'ipfsStarting'])).to.be.false;
        });
    });
    describe(types.IPFS_STOP, () => {
        it('should set corresponding flags', () => {
            modifiedState = EProcReducer(modifiedState, actions.ipfsStop());
            expect(modifiedState.getIn(['ipfs', 'flags', 'busyState'])).to.be.true;
        });
    });
    describe(types.IPFS_STOP_SUCCESS, () => {
        const response = { api: false, spawned: false, stopped: true };
        it('should reset the ipfs status', () => {
            modifiedState = EProcReducer(initialState, actions.ipfsStopSuccess(response));
            expect(modifiedState.getIn(['ipfs', 'status', 'api'])).to.not.be.ok;
            expect(modifiedState.getIn(['ipfs', 'status', 'spawned'])).to.not.be.ok;
            expect(modifiedState.getIn(['ipfs', 'status', 'started'])).to.not.be.ok;
            expect(modifiedState.getIn(['ipfs', 'status', 'stopped'])).to.be.true;
            expect(modifiedState.getIn(['ipfs', 'flags', 'portsRequested'])).to.be.false;
        });
        it('should reset the corresponding flags', () => {
            const state = initialState.setIn(['ipfs', 'flags', 'portsRequested'], true);
            modifiedState = EProcReducer(state, actions.ipfsStopSuccess(response));
            expect(modifiedState.getIn(['ipfs', 'flags', 'portsRequested'])).to.be.false;
        });
    });
    describe(types.IPFS_GET_STATUS_SUCCESS, () => {
        it('should update the state correctly', () => {
            const resp = { api: true, spawned: true };
            modifiedState = EProcReducer(initialState, actions.ipfsGetStatusSuccess(resp));
            expect(modifiedState.getIn(['ipfs', 'status', 'api'])).to.be.true;
            expect(modifiedState.getIn(['ipfs', 'status', 'spawned'])).to.be.true;
        });
    });
    describe(types.IPFS_GET_PORTS, () => {
        it('should set corresponding flags', () => {
            modifiedState = EProcReducer(initialState, actions.ipfsGetPorts());
            expect(modifiedState.getIn(['ipfs', 'flags', 'portsRequested'])).to.be.true;
        });
    });
    describe(types.IPFS_GET_PORTS_ERROR, () => {
        it('should reset corresponding flags', () => {
            const state = initialState.setIn(['ipfs', 'flags', 'portsRequested'], true);
            modifiedState = EProcReducer(state, actions.ipfsGetPortsError({}));
            expect(modifiedState.getIn(['ipfs', 'flags', 'portsRequested'])).to.be.false;
        });
    });
    describe(types.IPFS_GET_PORTS_SUCCESS, () => {
        const resp = {
            api: true, apiPort: '5000', gatewayPort: '8000', spawned: true, swarmPort: '4000'
        };
        it('should reset corresponding flags', () => {
            const state = initialState.setIn(['ipfs', 'flags', 'portsRequested'], true);
            modifiedState = EProcReducer(state, actions.ipfsGetPortsSuccess(resp));
            expect(modifiedState.getIn(['ipfs', 'flags', 'portsRequested'])).to.be.false;
        });
        it('should update the ipfs status', () => {
            modifiedState = EProcReducer(initialState, actions.ipfsGetPortsSuccess(resp));
            expect(modifiedState.getIn(['ipfs', 'status', 'api'])).to.be.true;
            expect(modifiedState.getIn(['ipfs', 'status', 'spawned'])).to.be.true;
        });
    });
    describe(types.GETH_GET_SYNC_STATUS_SUCCESS, () => {
        it('should update syncActionId and syncStatus when geth is synced', () => {
            const resp = { api: true, spawned: true, synced: true };
            modifiedState = EProcReducer(initialState, actions.gethGetSyncStatusSuccess(resp));
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.be.equal(4,
                'did not update syncActionId to 4 (synced)');
            expect(modifiedState.getIn(['geth', 'syncStatus', 'synced'])).to.be.true;
        });
        it('should update state correctly when geth is not synced', () => {
            const resp = {
                api: true,
                currentBlock: 123,
                highestBlock: 12345,
                knownStates: 321,
                peerCount: 12,
                pulledStates: 222,
                spawned: true,
                startingBlock: 10,
                synced: false
            };
            const state = initialState.setIn(['geth', 'syncActionId'], 1);
            modifiedState = EProcReducer(state, actions.gethGetSyncStatusSuccess(resp));
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.be.equal(1,
                'changed syncActionId');
            expect(modifiedState.getIn(['geth', 'syncStatus', 'currentBlock'])).to.equal(123,
                'did not update current block');
            expect(modifiedState.getIn(['geth', 'syncStatus', 'highestBlock'])).to.equal(12345,
                'did not update highest block');
            expect(modifiedState.getIn(['geth', 'syncStatus', 'knownStates'])).to.equal(321,
                'did not update known states');
            expect(modifiedState.getIn(['geth', 'syncStatus', 'peerCount'])).to.equal(12,
                'did not update peer count');
            expect(modifiedState.getIn(['geth', 'syncStatus', 'pulledStates'])).to.equal(222,
                'did not update pulled states');
            expect(modifiedState.getIn(['geth', 'syncStatus', 'startingBlock'])).to.equal(10,
                'did not update starting block');
        });
    });
    describe(types.GETH_STOP_SYNC, () => {
        it('should set syncActionId to 3', () => {
            modifiedState = EProcReducer(initialState, actions.gethStopSync());
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(3,
                'did not change syncActionId to 3 (stopped)');
        });
    });
    describe(types.GETH_PAUSE_SYNC, () => {
        it('should set syncActionId to 2', () => {
            modifiedState = EProcReducer(initialState, actions.gethPauseSync());
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(2,
                'did not change syncActionId to 2 (paused)');
        });
    });
    describe(types.GETH_RESUME_SYNC, () => {
        it('should set syncActionId to 1', () => {
            modifiedState = EProcReducer(initialState, actions.gethResumeSync());
            expect(modifiedState.getIn(['geth', 'syncActionId'])).to.equal(1,
                'did not change syncActionId to 1 (synchronizing)');
        });
    });
    describe(types.GETH_RESET_BUSY, () => {
        it('should reset busy flag', () => {
            const state = initialState.setIn(['geth', 'flags', 'busyState'], true);
            modifiedState = EProcReducer(state, actions.gethResetBusy());
            expect(modifiedState.getIn(['geth', 'flags', 'busyState'])).to.be.false;
        });
    });
    describe(types.IPFS_RESET_BUSY, () => {
        it('should reset busy flag', () => {
            const state = initialState.setIn(['ipfs', 'flags', 'busyState'], true);
            modifiedState = EProcReducer(state, actions.ipfsResetBusy());
            expect(modifiedState.getIn(['ipfs', 'flags', 'busyState'])).to.be.false;
        });
    });
    describe(types.IPFS_SET_PORTS, () => {
        it('should set corresponding flags', () => {
            modifiedState = EProcReducer(initialState, actions.ipfsSetPorts());
            expect(modifiedState.getIn(['ipfs', 'flags', 'settingPorts'])).to.be.true;
        });
    });
    describe(types.IPFS_SET_PORTS_ERROR, () => {
        it('should reset corresponding flags', () => {
            const state = initialState.setIn(['ipfs', 'flags', 'settingPorts'], true);
            modifiedState = EProcReducer(state, actions.ipfsSetPortsError({}));
            expect(modifiedState.getIn(['ipfs', 'flags', 'settingPorts'])).to.be.false;
        });
    });
    describe(types.IPFS_SET_PORTS_SUCCESS, () => {
        it('should reset corresponding flags', () => {
            const state = initialState.setIn(['ipfs', 'flags', 'settingPorts'], true);
            modifiedState = EProcReducer(state, actions.ipfsSetPortsSuccess());
            expect(modifiedState.getIn(['ipfs', 'flags', 'settingPorts'])).to.be.false;
        });
    });
    describe(types.GETH_GET_LOGS_SUCCESS, () => {
        const now = Date.now();
        it('should create new records in geth logs', () => {
            const logs = [{
                timestamp: now,
                message: 'should be first'
            }, {
                timestamp: now + 10,
                message: ''
            }];
            modifiedState = EProcReducer(initialState, actions.gethGetLogsSuccess(logs));
            expect(initialState.getIn(['geth', 'logs'])).to.have.size(0);
            expect(modifiedState.getIn(['geth', 'logs'])).to.have.size(2);
            expect(modifiedState.getIn(['geth', 'logs']).first().get('message'))
                .to.equal('should be first', 'the first log is not correct');
        });
        it('shouldn\'t add the same logs twice', () => {
            const existingLogs = [{
                timestamp: now,
                message: 'should be first'
            }, {
                timestamp: now + 10,
                message: 'second'
            }];
            const newLogs = [{
                timestamp: now,
                message: 'should be first'
            }, {
                timestamp: now + 10,
                message: 'second'
            }, {
                timestamp: now + 15,
                message: 'third'
            }];
            const state = initialState.mergeIn(['geth'], {
                logs: initialState.getIn(['geth', 'logs'])
                    .union(existingLogs.map(log => new LogRecord(log)))
            });
            modifiedState = EProcReducer(state, actions.gethGetLogsSuccess(newLogs));
            expect(state.getIn(['geth', 'logs'])).to.have.size(2);
            expect(state.getIn(['geth', 'logs']).first().get('message'))
                .to.equal('should be first', 'the first log is not correct');
            expect(modifiedState.getIn(['geth', 'logs'])).to.have.size(3);
            expect(modifiedState.getIn(['geth', 'logs']).first().get('message'))
                .to.equal('should be first', 'the first log is not correct');
            expect(modifiedState.getIn(['geth', 'logs']).last().get('message'))
                .to.equal('third', 'the last log is not correct');
        });
        it('shouldn\'t add more than 20 logs', () => {
            const logs = [];
            // generate 22 logs
            for (let i = 0; i <= 21; i += 1) {
                logs.push({
                    timestamp: now + i,
                    message: i.toString()
                });
            }

            modifiedState = EProcReducer(initialState, actions.gethGetLogsSuccess(logs));
            expect(modifiedState.getIn(['geth', 'logs'])).to.have.size(20, 'maximum 20 logs');
            expect(modifiedState.getIn(['geth', 'logs']).first().get('message'))
                .to.equal('2', 'the first log is not correct');
            expect(modifiedState.getIn(['geth', 'logs']).last().get('message'))
                .to.equal('21', 'the last log is not correct');
        });
    });
    describe(types.IPFS_GET_LOGS_SUCCESS, () => {
        const now = Date.now();
        it('should create new records in ipfs logs', () => {
            const logs = [{
                timestamp: now,
                message: 'should be first'
            }, {
                timestamp: now + 10,
                message: ''
            }];
            modifiedState = EProcReducer(initialState, actions.ipfsGetLogsSuccess(logs));
            expect(initialState.getIn(['ipfs', 'logs'])).to.have.size(0);
            expect(modifiedState.getIn(['ipfs', 'logs'])).to.have.size(2);
            expect(modifiedState.getIn(['ipfs', 'logs']).first().get('message'))
                .to.equal('should be first', 'the first log is not correct');
        });
        it('shouldn\'t add the same logs twice', () => {
            const existingLogs = [{
                timestamp: now,
                message: 'should be first'
            }, {
                timestamp: now + 10,
                message: 'second'
            }];
            const newLogs = [{
                timestamp: now,
                message: 'should be first'
            }, {
                timestamp: now + 10,
                message: 'second'
            }, {
                timestamp: now + 15,
                message: 'third'
            }];
            const state = initialState.mergeIn(['ipfs'], {
                logs: initialState.getIn(['ipfs', 'logs'])
                    .union(existingLogs.map(log => new LogRecord(log)))
            });
            modifiedState = EProcReducer(state, actions.ipfsGetLogsSuccess(newLogs));
            expect(state.getIn(['ipfs', 'logs'])).to.have.size(2);
            expect(state.getIn(['ipfs', 'logs']).first().get('message'))
                .to.equal('should be first', 'the first log is not correct');
            expect(modifiedState.getIn(['ipfs', 'logs'])).to.have.size(3);
            expect(modifiedState.getIn(['ipfs', 'logs']).first().get('message'))
                .to.equal('should be first', 'the first log is not correct');
            expect(modifiedState.getIn(['ipfs', 'logs']).last().get('message'))
                .to.equal('third', 'the last log is not correct');
        });
        it('shouldn\'t add more than 20 logs', () => {
            const logs = [];
            // generate 22 logs
            for (let i = 0; i <= 21; i += 1) {
                logs.push({
                    timestamp: now + i,
                    message: i.toString()
                });
            }

            modifiedState = EProcReducer(initialState, actions.ipfsGetLogsSuccess(logs));
            expect(modifiedState.getIn(['ipfs', 'logs'])).to.have.size(20, 'maximum 20 logs');
            expect(modifiedState.getIn(['ipfs', 'logs']).first().get('message'))
                .to.equal('2', 'the first log is not correct');
            expect(modifiedState.getIn(['ipfs', 'logs']).last().get('message'))
                .to.equal('21', 'the last log is not correct');
        });
    });
});

/* eslint-enable no-unused-expressions */
