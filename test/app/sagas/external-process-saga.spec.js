import chai, { expect } from 'chai';
import chaiIM from 'chai-immutable';
import { delay } from 'redux-saga';
import SagaTester from 'redux-saga-tester';
import proxyquire from 'proxyquire';
import * as data from '../response-data/external-process';
import * as types from '../../../app/local-flux/constants';
import * as actions from '../../../app/local-flux/actions/external-process-actions';
import * as appActions from '../../../app/local-flux/actions/app-actions';
import rootReducer from '../../../app/local-flux/reducers';

/* eslint-disable no-unused-expressions, prefer-arrow-callback */

chai.use(chaiIM);
const sagas = proxyquire('../../../app/local-flux/sagas/external-process-saga', {
    'redux-saga': {
        delay: ms => delay(ms / 100)
    },
    './helpers': {
        enableChannel: () => {}
    }
});
const initialState = rootReducer(undefined, {});
const timeout = ms => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, ms);
});

describe('external process saga', function test () {
    let sagaTester;
    before(() => {
        sagaTester = new SagaTester({
            initialState,
            reducers: rootReducer
        });
        sagaTester.start(sagas.registerWatchers);
    });
    afterEach(() => {
        sagaTester.reset(true);
    });
    it('should start with initialState', () => {
        expect(sagaTester.getState()).to.eql(initialState);
    });
    describe(types.GETH_START, () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch GETH_START_SUCCESS', () => {
            sagaTester.dispatch(actions.gethStart());
            const clientChannel = global.Channel.client.geth.startService;
            const resp = { data: { api: false, spawned: false, starting: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_START_SUCCESS)).to.equal(1,
                'GETH_START_SUCCESS was not called once');
            expect(global.Channel.server.geth.startService.send.calledWith({ })).to.be.ok;
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.gethStartSuccess(resp.data));
        });
        it('should not reset busy state', async () => {
            sagaTester.dispatch(actions.gethStart());
            const clientChannel = global.Channel.client.geth.startService;
            const resp = { data: { api: false, spawned: false, starting: true } };
            clientChannel.triggerResponse(resp);
            await Promise.race([sagaTester.waitFor(types.GETH_RESET_BUSY), timeout(30)]);
            expect(sagaTester.numCalled(types.GETH_RESET_BUSY)).to.equal(0,
                'GETH_RESET_BUSY was called');
        });
        it('should reset busy state', async () => {
            sagaTester.dispatch(actions.gethStart());
            const clientChannel = global.Channel.client.geth.startService;
            const resp = { data: { api: true, spawned: true } };
            clientChannel.triggerResponse(resp);
            await sagaTester.waitFor(types.GETH_RESET_BUSY);
            expect(sagaTester.numCalled(types.GETH_RESET_BUSY)).to.equal(1,
                'GETH_RESET_BUSY was not called once');
        });
        it('should dispatch GETH_START_ERROR and GETH_RESET_BUSY', async () => {
            sagaTester.dispatch(actions.gethStart());
            const clientChannel = global.Channel.client.geth.startService;
            const resp = { data: { spawned: false, stopped: true }, error: { message: '' } };
            clientChannel.triggerResponse(resp);
            await sagaTester.waitFor(types.GETH_RESET_BUSY);
            expect(sagaTester.numCalled(types.GETH_START_SUCCESS)).to.equal(0,
                'GETH_START_SUCCESS was called');
            expect(sagaTester.numCalled(types.GETH_START_ERROR)).to.equal(1,
                'GETH_START_ERROR was not called once');
            expect(sagaTester.numCalled(types.GETH_RESET_BUSY)).to.equal(1,
                'GETH_RESET_BUSY was not called once');
            expect(sagaTester.getLatestCalledActions(2)[0])
                .to.deep.equal(actions.gethStartError(resp.data, resp.error));
        });
    });
    describe(types.GETH_STOP, () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch GETH_STOP_SUCCESS', () => {
            sagaTester.dispatch(actions.gethStop());
            const clientChannel = global.Channel.client.geth.stopService;
            const resp = { data: { stopped: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_STOP_SUCCESS)).to.equal(1,
                'GETH_STOP_SUCCESS was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.gethStopSuccess(resp.data));
        });
        it('should not reset busy state', async () => {
            sagaTester.dispatch(actions.gethStop());
            const clientChannel = global.Channel.client.geth.stopService;
            const resp = { data: { stopped: true } };
            clientChannel.triggerResponse(resp);
            await Promise.race([sagaTester.waitFor(types.GETH_RESET_BUSY), timeout(30)]);
            expect(sagaTester.numCalled(types.GETH_RESET_BUSY)).to.equal(0,
                'GETH_RESET_BUSY was called');
        });
        it('should reset busy state', async () => {
            sagaTester.dispatch(actions.gethStop());
            const clientChannel = global.Channel.client.geth.stopService;
            const resp = { data: { api: false, spawned: false, stopped: true } };
            clientChannel.triggerResponse(resp);
            await sagaTester.waitFor(types.GETH_RESET_BUSY);
            expect(sagaTester.numCalled(types.GETH_RESET_BUSY)).to.equal(1,
                'GETH_RESET_BUSY was not called once');
        });
        it('should dispatch GETH_STOP_ERROR and GETH_RESET_BUSY', async () => {
            sagaTester.dispatch(actions.gethStop());
            const clientChannel = global.Channel.client.geth.stopService;
            const resp = { data: { }, error: { message: 'test' } };
            clientChannel.triggerResponse(resp);
            await sagaTester.waitFor(types.GETH_RESET_BUSY);
            expect(sagaTester.numCalled(types.GETH_STOP_SUCCESS)).to.equal(0,
                'GETH_STOP_SUCCESS was called');
            expect(sagaTester.numCalled(types.GETH_STOP_ERROR)).to.equal(1,
                'GETH_STOP_ERROR was not called once');
            expect(sagaTester.numCalled(types.GETH_RESET_BUSY)).to.equal(1,
                'GETH_RESET_BUSY was not called once');
            expect(sagaTester.getLatestCalledActions(2)[0])
                .to.deep.equal(actions.gethStopError(resp.error));
        });
    });
    describe(types.GETH_GET_STATUS, () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch GETH_GET_STATUS_SUCCESS', () => {
            sagaTester.dispatch(actions.gethGetStatus());
            const clientChannel = global.Channel.client.geth.status;
            const resp = { data: { api: true, spawned: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_GET_STATUS_SUCCESS)).to.equal(1,
                'GETH_GET_STATUS_SUCCESS was not called once');
        });
        it('should dispatch GETH_GET_STATUS_ERROR', () => {
            sagaTester.dispatch(actions.gethGetStatus());
            const clientChannel = global.Channel.client.geth.status;
            const resp = { data: { }, error: { message: '' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_GET_STATUS_ERROR)).to.equal(1,
                'GETH_GET_STATUS_ERROR was not called once');
        });
    });
    describe(types.GETH_GET_SYNC_STATUS, () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch GETH_GET_SYNC_STATUS_SUCCESS', () => {
            sagaTester.dispatch(actions.gethGetSyncStatus());
            const clientChannel = global.Channel.client.geth.syncStatus;
            const resp = { data: { synced: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_GET_SYNC_STATUS_SUCCESS)).to.equal(1,
                'GETH_GET_SYNC_STATUS_SUCCESS was not called once');
        });
        it('should dispatch GETH_GET_SYNC_STATUS_ERROR', () => {
            sagaTester.dispatch(actions.gethGetSyncStatus());
            const clientChannel = global.Channel.client.geth.syncStatus;
            const resp = { error: { message: '' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_GET_SYNC_STATUS_ERROR)).to.equal(1,
                'GETH_GET_SYNC_STATUS_ERROR was not called once');
        });
    });
    describe('GETH_GET_OPTIONS', () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch GETH_GET_OPTIONS_SUCCESS', () => {
            const clientChannel = global.Channel.client.geth.options;
            const resp = { data: { cache: 512, datadir: '/', ipcpath: '/' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_GET_OPTIONS_SUCCESS)).to.equal(1,
                'GETH_GET_OPTIONS_SUCCESS was not called once');
        });
        it('should dispatch GETH_GET_OPTIONS_ERROR', () => {
            const clientChannel = global.Channel.client.geth.options;
            const resp = { error: { message: '' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_GET_OPTIONS_ERROR)).to.equal(1,
                'GETH_GET_OPTIONS_ERROR was not called once');
        });
    });
    describe('GETH_LOGGER', () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should start geth logger', async () => {
            sagaTester.dispatch(actions.gethStartLogger());
            const clientChannel = global.Channel.client.geth.logs;
            const resp = {
                data: {
                    gethError: [],
                    gethInfo: [{
                        timestamp: 111,
                        message: 'should be first'
                    }]
                }
            };

            await sagaTester.waitFor(types.GETH_GET_LOGS);
            expect(global.Channel.server.geth.logs.send.callCount).to.equal(1,
                'server channel request was not sent once');
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.GETH_GET_LOGS_SUCCESS)).to.equal(1,
                'GETH_GET_LOGS_SUCCESS was not called once');

            await sagaTester.waitFor(types.GETH_GET_LOGS, true);
            const callCount = global.Channel.server.geth.logs.send.callCount;
            expect(callCount).to.be.above(1,
                'server channel request was not sent more than once');

            sagaTester.dispatch(actions.gethStopLogger());
            // wait 300ms and check if GETH_GET_LOGS was dispatched again
            await Promise.race([sagaTester.waitFor(types.GETH_GET_LOGS, true), timeout(30)]);
            expect(global.Channel.server.geth.logs.send.callCount).to.equal(callCount,
                'a request was sent after geth logger was stopped');
        });
        it('should filter and sort the logs', () => {
            // Set the timestamp used for filtering
            sagaTester.dispatch(appActions.setTimestamp(2222));
            const clientChannel = global.Channel.client.geth.logs;
            const resp = Object.assign({}, data.gethLogsResponse);
            clientChannel.triggerResponse(resp);
            expect(sagaTester.getLatestCalledAction()).to.deep.equal({
                type: types.GETH_GET_LOGS_SUCCESS,
                data: data.logsExpected
            }, 'GETH_GET_LOGS_SUCCESS was not dispatched with the correct payload');
        });
    });

    describe(types.IPFS_START, () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch IPFS_START_SUCCESS', () => {
            sagaTester.dispatch(actions.ipfsStart());
            const clientChannel = global.Channel.client.ipfs.startService;
            const resp = { data: { api: false, spawned: true, started: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_START_SUCCESS)).to.equal(1,
                'IPFS_START_SUCCESS was not called once');
            expect(global.Channel.server.ipfs.startService.send.calledWith({ storagePath: null }))
                .to.be.ok;
            // Last called action should be ipfsGetPorts
            expect(sagaTester.getLatestCalledActions(2)[0])
                .to.deep.equal(actions.ipfsStartSuccess(resp.data));
        });
        it('should reset busy state', async () => {
            sagaTester.dispatch(actions.ipfsStart());
            const clientChannel = global.Channel.client.ipfs.startService;
            const resp = { data: { api: true, spawned: true } };
            clientChannel.triggerResponse(resp);
            await sagaTester.waitFor(types.IPFS_RESET_BUSY);
            expect(sagaTester.numCalled(types.IPFS_RESET_BUSY)).to.equal(1,
                'IPFS_RESET_BUSY was not called once');
        });
        it('should request ipfs ports', async () => {
            sagaTester.dispatch(actions.ipfsStart());
            const clientChannel = global.Channel.client.ipfs.startService;
            const resp = { data: { api: true, spawned: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_PORTS)).to.equal(1,
                'IPFS_GET_PORTS was not called once');
            expect(global.Channel.server.ipfs.getPorts.send.calledWith({ }))
                .to.be.ok;
        });
        it('should not request ipfs ports', async () => {
            sagaTester.dispatch(actions.ipfsStart());
            const clientChannel = global.Channel.client.ipfs.startService;
            const resp = { data: { api: false, spawned: false } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_PORTS)).to.equal(0,
                'IPFS_GET_PORTS was called');
        });
        it('should dispatch IPFS_START_ERROR and IPFS_RESET_BUSY', async () => {
            sagaTester.dispatch(actions.ipfsStart());
            const clientChannel = global.Channel.client.ipfs.startService;
            const resp = { data: { spawned: false, stopped: true }, error: { message: '' } };
            clientChannel.triggerResponse(resp);
            await sagaTester.waitFor(types.IPFS_RESET_BUSY);
            expect(sagaTester.numCalled(types.IPFS_START_SUCCESS)).to.equal(0,
                'IPFS_START_SUCCESS was called');
            expect(sagaTester.numCalled(types.IPFS_START_ERROR)).to.equal(1,
                'IPFS_START_ERROR was not called once');
            expect(sagaTester.numCalled(types.IPFS_RESET_BUSY)).to.equal(1,
                'IPFS_RESET_BUSY was not called once');
            expect(sagaTester.getLatestCalledActions(2)[0])
                .to.deep.equal(actions.ipfsStartError(resp.data, resp.error));
        });
    });

    describe(types.IPFS_STOP, () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch IPFS_STOP_SUCCESS', async () => {
            sagaTester.dispatch(actions.ipfsStop());
            const clientChannel = global.Channel.client.ipfs.stopService;
            const resp = { data: { spawned: false, stopped: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_STOP_SUCCESS)).to.equal(1,
                'IPFS_STOP_SUCCESS was not called once');
            // Last called action should be ipfsResetPorts
            expect(sagaTester.getLatestCalledActions(2)[0])
                .to.deep.equal(actions.ipfsStopSuccess(resp.data));
            // wait for IPFS_RESET_BUSY action, otherwise it will be dispatched during the next test
            await sagaTester.waitFor(types.IPFS_RESET_BUSY);
        });
        it('should reset ports', async () => {
            sagaTester.dispatch(actions.ipfsStop());
            const clientChannel = global.Channel.client.ipfs.stopService;
            const resp = { data: { api: false, spawned: false, stopped: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_RESET_PORTS)).to.equal(1,
                'IPFS_RESET_PORTS was not called once');
            // wait for IPFS_RESET_BUSY action, otherwise it will be dispatched during the next test
            await sagaTester.waitFor(types.IPFS_RESET_BUSY);
        });
        it('should reset busy state', async () => {
            sagaTester.dispatch(actions.ipfsStop());
            const clientChannel = global.Channel.client.ipfs.stopService;
            const resp = { data: { api: false, spawned: false, stopped: true } };
            clientChannel.triggerResponse(resp);
            await sagaTester.waitFor(types.IPFS_RESET_BUSY);
            expect(sagaTester.numCalled(types.IPFS_RESET_BUSY)).to.equal(1,
                'IPFS_RESET_BUSY was not called once');
        });
        it('should dispatch IPFS_STOP_ERROR and IPFS_RESET_BUSY', async () => {
            expect(sagaTester.numCalled(types.IPFS_RESET_BUSY)).to.equal(0,
                'IPFS_RESET_BUSY was called before ipfsStop');
            sagaTester.dispatch(actions.ipfsStop());
            const clientChannel = global.Channel.client.ipfs.stopService;
            const resp = { data: { }, error: { message: 'test' } };
            clientChannel.triggerResponse(resp);
            await sagaTester.waitFor(types.IPFS_RESET_BUSY);
            expect(sagaTester.numCalled(types.IPFS_STOP_SUCCESS)).to.equal(0,
                'IPFS_STOP_SUCCESS was called');
            expect(sagaTester.numCalled(types.IPFS_RESET_PORTS)).to.equal(0,
                'IPFS_RESET_PORTS was called');
            expect(sagaTester.numCalled(types.IPFS_STOP_ERROR)).to.equal(1,
                'IPFS_STOP_ERROR was not called once');
            expect(sagaTester.numCalled(types.IPFS_RESET_BUSY)).to.equal(1,
                'IPFS_RESET_BUSY was not called once');
            expect(sagaTester.getLatestCalledActions(2)[0])
                .to.deep.equal(actions.ipfsStopError(resp.error));
        });
    });

    describe(types.IPFS_GET_STATUS, () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch IPFS_GET_STATUS_SUCCESS and IPFS_GET_PORTS', () => {
            sagaTester.dispatch(actions.ipfsGetStatus());
            const clientChannel = global.Channel.client.ipfs.status;
            const resp = { data: { api: true, spawned: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_STATUS_SUCCESS)).to.equal(1,
                'IPFS_GET_STATUS_SUCCESS was not called once');
            expect(sagaTester.numCalled(types.IPFS_GET_PORTS)).to.equal(1,
                'IPFS_GET_PORTS was not called once');
        });
        it('should not dispatch IPFS_GET_PORTS second time', () => {
            sagaTester.dispatch(actions.ipfsGetStatus());
            const clientChannel = global.Channel.client.ipfs.status;
            const resp = { data: { api: true, spawned: true } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_PORTS)).to.equal(0,
                'IPFS_GET_PORTS was called second time');
        });
        it('should dispatch IPFS_GET_STATUS_ERROR', () => {
            sagaTester.dispatch(actions.ipfsGetStatus());
            const clientChannel = global.Channel.client.ipfs.status;
            const resp = { data: { spawned: false }, error: { message: '' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_STATUS_SUCCESS)).to.equal(0,
                'IPFS_GET_STATUS_SUCCESS was called');
            expect(sagaTester.numCalled(types.IPFS_GET_STATUS_ERROR)).to.equal(1,
                'IPFS_GET_STATUS_ERROR was not called once');
        });
    });

    describe('IPFS_GET_CONFIG', () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch IPFS_GET_CONFIG_SUCCESS', () => {
            const clientChannel = global.Channel.client.ipfs.getConfig;
            const resp = { data: { api: true, storagePath: '' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_CONFIG_SUCCESS)).to.equal(1,
                'IPFS_GET_CONFIG_SUCCESS was not called once');
        });
        it('should dispatch IPFS_GET_CONFIG_ERROR', () => {
            const clientChannel = global.Channel.client.ipfs.getConfig;
            const resp = { error: { message: '' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_CONFIG_ERROR)).to.equal(1,
                'IPFS_GET_CONFIG_ERROR was not called once');
        });
    });

    describe('IPFS_GET_PORTS', () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch IPFS_GET_PORTS_SUCCESS', () => {
            const clientChannel = global.Channel.client.ipfs.getPorts;
            const resp = { data: { apiPort: '1111', gatewayPort: '2222', swarmPort: '3333' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_PORTS_SUCCESS)).to.equal(1,
                'IPFS_GET_PORTS_SUCCESS was not called once');
        });
        it('should dispatch IPFS_GET_PORTS_SUCCESS', () => {
            const clientChannel = global.Channel.client.ipfs.getPorts;
            const resp = { error: { message: '' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_PORTS_ERROR)).to.equal(1,
                'IPFS_GET_PORTS_ERROR was not called once');
        });
    });

    describe(types.IPFS_SET_PORTS, () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should dispatch IPFS_SET_PORTS_SUCCESS', () => {
            const ports = { apiPort: 1111, gatewayPort: 2222, swarmPort: 3333 };
            sagaTester.dispatch(actions.ipfsSetPorts(ports));
            const clientChannel = global.Channel.client.ipfs.setPorts;
            const resp = { data: { apiPort: '1111', gatewayPort: '2222', swarmPort: '3333' } };
            expect(global.Channel.server.ipfs.setPorts.send.calledWith({ ports })).to.be.ok;
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_SET_PORTS_SUCCESS)).to.equal(1,
                'IPFS_SET_PORTS_SUCCESS was not called once');
            expect(sagaTester.getLatestCalledAction()).to.deep.equal({
                type: 'SHOW_NOTIFICATION',
                notification: { id: 'setIpfsPortsSuccess' }
            }, 'notification action was not dispatched');
        });
        it('should dispatch IPFS_SET_PORTS_ERROR', () => {
            const ports = { apiPort: 1111, gatewayPort: 2222, swarmPort: 3333 };
            sagaTester.dispatch(actions.ipfsSetPorts(ports));
            const clientChannel = global.Channel.client.ipfs.setPorts;
            const resp = { error: { message: '' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_SET_PORTS_ERROR)).to.equal(1,
                'IPFS_SET_PORTS_ERROR was not called once');
        });
    });

    describe('IPFS_LOGGER', () => {
        afterEach(() => {
            sagaTester.reset(true);
        });
        it('should start ipfs logger', async () => {
            sagaTester.dispatch(actions.ipfsStartLogger());
            const clientChannel = global.Channel.client.ipfs.logs;
            const resp = {
                data: {
                    ipfsError: [],
                    ipfsInfo: [{
                        timestamp: 111,
                        message: 'should be first'
                    }]
                }
            };

            await sagaTester.waitFor(types.IPFS_GET_LOGS);
            expect(global.Channel.server.ipfs.logs.send.callCount).to.equal(1,
                'server channel request was not sent once');
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.IPFS_GET_LOGS_SUCCESS)).to.equal(1,
                'IPFS_GET_LOGS_SUCCESS was not called once');

            await sagaTester.waitFor(types.IPFS_GET_LOGS, true);
            const callCount = global.Channel.server.ipfs.logs.send.callCount;
            expect(callCount).to.be.above(1,
                'server channel request was not sent more than once');
            sagaTester.dispatch(actions.ipfsStopLogger());
            // wait 300ms and check if IPFS_GET_LOGS was dispatched again
            await Promise.race([sagaTester.waitFor(types.IPFS_GET_LOGS, true), timeout(30)]);
            expect(global.Channel.server.ipfs.logs.send.callCount).to.equal(callCount,
                'a request was sent after ipfs logger was stopped');
        });
        it('should filter and sort the logs', () => {
            // Set the timestamp used for filtering
            sagaTester.dispatch(appActions.setTimestamp(2222));
            const clientChannel = global.Channel.client.ipfs.logs;
            const resp = Object.assign({}, data.ipfsLogsResponse);
            clientChannel.triggerResponse(resp);
            expect(sagaTester.getLatestCalledAction()).to.deep.equal({
                type: types.IPFS_GET_LOGS_SUCCESS,
                data: data.logsExpected
            }, 'IPFS_GET_LOGS_SUCCESS was not dispatched with the correct payload');
        });
    });
});

/* eslint-enable no-unused-expressions, prefer-arrow-callback */
