import chai, { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import SagaTester from 'redux-saga-tester';
import * as sagas from '../../../app/local-flux/sagas/settings-saga';
import * as types from '../../../app/local-flux/constants';
import * as appActions from '../../../app/local-flux/actions/app-actions';
import * as actions from '../../../app/local-flux/actions/settings-actions';
import * as service from '../../../app/local-flux/services/settings-service'
import rootReducer from '../../../app/local-flux/reducers';

const initialState = rootReducer(undefined, {});

const successStub = payload => new Promise(resolve => resolve(payload));
const userSuccessStub = (akashaId, payload) =>
    new Promise(resolve => resolve({ akashaId, ...payload }));
const errorStub = () => new Promise((resolve, reject) => reject({}));

describe('settings saga', function test () {
    let sagaTester;
    let stub;

    before(() => {
        sagaTester = new SagaTester({
            null,
            reducers: state => state
        });
        sagaTester.start(sagas.watchSettingsActions);
    });
    afterEach(() => {
        sagaTester.reset(true);
        if (stub) {
            stub.restore();
        }
    });

    describe('gethSettingsRequest', () => {
        let tester;
        before(() => {
            tester = new SagaTester({
                null,
                reducers: state => state
            });
        });
        it('should dispatch GETH_SETTINGS_SUCCESS', async () => {
            const resp = { cache: 512, datadir: 'test/path' };
            stub = sinon.stub(service, 'gethSettingsRequest', () =>
                new Promise(resolve => resolve(resp))
            );
            tester.start(sagas.gethSettingsRequest);
            await tester.waitFor(types.GETH_SETTINGS_SUCCESS);
            expect(tester.numCalled(types.GETH_SETTINGS_SUCCESS)).to.equal(1);
            expect(tester.getLatestCalledAction())
                .to.deep.equal(actions.gethSettingsSuccess(resp));
        });
        it('should dispatch GETH_SETTINGS_ERROR', async () => {
            stub = sinon.stub(service, 'gethSettingsRequest', () =>
                new Promise((resolve, reject) => reject({}))
            );
            tester.start(sagas.gethSettingsRequest);
            await tester.waitFor(types.GETH_SETTINGS_ERROR);
            expect(tester.numCalled(types.GETH_SETTINGS_ERROR)).to.equal(1);
        });
    });
    describe(types.GETH_SAVE_SETTINGS, () => {
        it('should dispatch GETH_SAVE_SETTINGS_SUCCESS', async () => {
            const payload = { cache: 512 };
            stub = sinon.stub(service, 'gethSettingsSave', successStub);
            sagaTester.dispatch(actions.gethSaveSettings(payload));
            await sagaTester.waitFor(types.GETH_SAVE_SETTINGS_SUCCESS);
            expect(sagaTester.numCalled(types.GETH_SAVE_SETTINGS_SUCCESS)).to.equal(1);
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.gethSaveSettingsSuccess(payload));
        });
        it('should dispatch SHOW_NOTIFICATION', async () => {
            const payload = { cache: 512 };
            stub = sinon.stub(service, 'gethSettingsSave', successStub);
            sagaTester.dispatch(actions.gethSaveSettings(payload, true));
            await sagaTester.waitFor(types.SHOW_NOTIFICATION);
            expect(sagaTester.numCalled(types.SHOW_NOTIFICATION)).to.equal(1);
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(appActions.showNotification({ id: 'saveGethSettingsSuccess' }));
        });
        it('should dispatch GETH_SAVE_SETTINGS_ERROR', async () => {
            stub = sinon.stub(service, 'gethSettingsSave', errorStub);
            sagaTester.dispatch(actions.gethSaveSettings({}));
            await sagaTester.waitFor(types.GETH_SAVE_SETTINGS_ERROR);
            expect(sagaTester.numCalled(types.GETH_SAVE_SETTINGS_ERROR)).to.equal(1);
        });
    });
    describe('ipfsSettingsRequest', () => {
        let tester;
        before(() => {
            tester = new SagaTester({
                null,
                reducers: state => state
            });
        });
        it('should dispatch IPFS_SETTINGS_SUCCESS', async () => {
            const resp = { ports: { api: 8080 }, storagePath: 'test' };
            stub = sinon.stub(service, 'ipfsSettingsRequest', () =>
                new Promise(resolve => resolve(resp))
            );
            tester.start(sagas.ipfsSettingsRequest);
            await tester.waitFor(types.IPFS_SETTINGS_SUCCESS);
            expect(tester.numCalled(types.IPFS_SETTINGS_SUCCESS)).to.equal(1);
            expect(tester.getLatestCalledAction())
                .to.deep.equal(actions.ipfsSettingsSuccess(resp));
        });
        it('should dispatch IPFS_SETTINGS_ERROR', async () => {
            stub = sinon.stub(service, 'ipfsSettingsRequest', () =>
                new Promise((resolve, reject) => reject({}))
            );
            tester.start(sagas.ipfsSettingsRequest);
            await tester.waitFor(types.IPFS_SETTINGS_ERROR);
            expect(tester.numCalled(types.IPFS_SETTINGS_ERROR)).to.equal(1);
        });
    });
    describe(types.IPFS_SAVE_SETTINGS, () => {
        it('should dispatch IPFS_SAVE_SETTINGS_SUCCESS', async () => {
            const payload = { ports: { api: 8080 }, storagePath: 'test' };
            stub = sinon.stub(service, 'ipfsSettingsSave', successStub);
            sagaTester.dispatch(actions.ipfsSaveSettings(payload));
            await sagaTester.waitFor(types.IPFS_SAVE_SETTINGS_SUCCESS);
            expect(sagaTester.numCalled(types.IPFS_SAVE_SETTINGS_SUCCESS)).to.equal(1);
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.ipfsSaveSettingsSuccess({ storagePath: 'test' }));
        });
        it('should dispatch SHOW_NOTIFICATION', async () => {
            stub = sinon.stub(service, 'ipfsSettingsSave', successStub);
            sagaTester.dispatch(actions.ipfsSaveSettings({}, true));
            await sagaTester.waitFor(types.SHOW_NOTIFICATION);
            expect(sagaTester.numCalled(types.SHOW_NOTIFICATION)).to.equal(1);
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(appActions.showNotification({ id: 'saveIpfsSettingsSuccess' }));
        });
        it('should dispatch IPFS_SAVE_SETTINGS_ERROR', async () => {
            stub = sinon.stub(service, 'ipfsSettingsSave', errorStub);
            sagaTester.dispatch(actions.ipfsSaveSettings({}));
            await sagaTester.waitFor(types.IPFS_SAVE_SETTINGS_ERROR);
            expect(sagaTester.numCalled(types.IPFS_SAVE_SETTINGS_ERROR)).to.equal(1);
        });
    });
    describe('generalSettingsRequest', () => {
        let tester;
        before(() => {
            tester = new SagaTester({
                null,
                reducers: state => state
            });
        });
        it('should dispatch GENERAL_SETTINGS_SUCCESS', async () => {
            const resp = { configurationSaved: true };
            stub = sinon.stub(service, 'generalSettingsRequest', () =>
                new Promise(resolve => resolve(resp))
            );
            tester.start(sagas.generalSettingsRequest);
            await tester.waitFor(types.GENERAL_SETTINGS_SUCCESS);
            expect(tester.numCalled(types.GENERAL_SETTINGS_SUCCESS)).to.equal(1);
            expect(tester.getLatestCalledAction())
                .to.deep.equal(actions.generalSettingsSuccess(resp));
        });
        it('should dispatch GENERAL_SETTINGS_ERROR', async () => {
            stub = sinon.stub(service, 'generalSettingsRequest', () =>
                new Promise((resolve, reject) => reject({}))
            );
            tester.start(sagas.generalSettingsRequest);
            await tester.waitFor(types.GENERAL_SETTINGS_ERROR);
            expect(tester.numCalled(types.GENERAL_SETTINGS_ERROR)).to.equal(1);
        });
    });
    describe(types.GENERAL_SETTINGS_SAVE, () => {
        it('should dispatch GENERAL_SETTINGS_SAVE_SUCCESS', async () => {
            const payload = { configurationSaved: true };
            stub = sinon.stub(service, 'generalSettingsSave', successStub);
            sagaTester.dispatch(actions.saveGeneralSettings(payload));
            await sagaTester.waitFor(types.GENERAL_SETTINGS_SAVE_SUCCESS);
            expect(sagaTester.numCalled(types.GENERAL_SETTINGS_SAVE_SUCCESS)).to.equal(1);
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.saveGeneralSettingsSuccess(payload));
        });
        it('should dispatch GENERAL_SETTINGS_SAVE_ERROR', async () => {
            stub = sinon.stub(service, 'generalSettingsSave', errorStub);
            sagaTester.dispatch(actions.saveGeneralSettings({}));
            await sagaTester.waitFor(types.GENERAL_SETTINGS_SAVE_ERROR);
            expect(sagaTester.numCalled(types.GENERAL_SETTINGS_SAVE_ERROR)).to.equal(1);
        });
    });
    describe(types.USER_SETTINGS_REQUEST, () => {
        it('should dispatch USER_SETTINGS_SUCCESS', async () => {
            const resp = { akashaId: 'test', passwordPreference: { remember: true, time: 30 } };
            stub = sinon.stub(service, 'userSettingsRequest', akashaId =>
                new Promise(resolve => resolve(resp))
            );
            sagaTester.dispatch(actions.userSettingsRequest('test'));
            await sagaTester.waitFor(types.USER_SETTINGS_SUCCESS);
            expect(sagaTester.numCalled(types.USER_SETTINGS_SUCCESS)).to.equal(1);
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.userSettingsSuccess(resp));
        });
        it('should dispatch USER_SETTINGS_ERROR', async () => {
            stub = sinon.stub(service, 'userSettingsRequest', () =>
                new Promise((resolve, reject) => reject({}))
            );
            sagaTester.dispatch(actions.userSettingsRequest('test'));
            await sagaTester.waitFor(types.USER_SETTINGS_ERROR);
            expect(sagaTester.numCalled(types.USER_SETTINGS_ERROR)).to.equal(1);
        });
    });
    describe(types.USER_SETTINGS_SAVE, () => {
        it('should dispatch USER_SETTINGS_SAVE_SUCCESS', async () => {
            const payload = { passwordPreference: { remember: true, time: 30 } };
            stub = sinon.stub(service, 'userSettingsSave', (akashaId, payload) =>
                new Promise(resolve => resolve({ akashaId, ...payload }))
            );
            sagaTester.dispatch(actions.userSettingsSave('test', payload));
            await sagaTester.waitFor(types.USER_SETTINGS_SAVE_SUCCESS);
            expect(sagaTester.numCalled(types.USER_SETTINGS_SAVE_SUCCESS)).to.equal(1);
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.userSettingsSaveSuccess({ akashaId: 'test', ...payload }));
        });
        it('should dispatch USER_SETTINGS_SAVE_ERROR', async () => {
            stub = sinon.stub(service, 'userSettingsSave', errorStub);
            sagaTester.dispatch(actions.userSettingsSave('test', {}));
            await sagaTester.waitFor(types.USER_SETTINGS_SAVE_ERROR);
            expect(sagaTester.numCalled(types.USER_SETTINGS_SAVE_ERROR)).to.equal(1);
        });
    });
});
