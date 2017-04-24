import chai, { expect } from 'chai';
import { Record } from 'immutable';
import SagaTester from 'redux-saga-tester';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as types from '../../../app/local-flux/constants';
import * as actions from '../../../app/local-flux/actions/profile-actions';
import * as service from '../../../app/local-flux/services/profile-service';
import rootReducer from '../../../app/local-flux/reducers';
import { ProfileState } from '../../../app/local-flux/reducers/records';

describe('profile saga', function test () {
    const sagas = proxyquire('../../../app/local-flux/sagas/profile-saga', {
        './helpers': {
            enableChannel: () => {}
        }
    });
    let sagaTester;
    before(() => {
        const initialState = rootReducer(undefined, {});
        sagaTester = new SagaTester({
            initialState,
            reducers: rootReducer
        });
        sagaTester.start(sagas.registerWatchers);
    });
    afterEach(() => {
        sagaTester.reset(true);
    });
    describe(types.PROFILE_GET_CURRENT, () => {
        let spy;
        let stub;
        before(() => {
            spy = sinon.spy();
        });
        afterEach(() => {
            spy.reset();
            if (stub) {
                stub.restore();
            }
        });
        it('should make the request to getCurrentProfile', () => {
            stub = sinon.stub(service, 'profileSaveLogged');
            sagaTester.dispatch(actions.profileGetCurrent());
            const channel = global.Channel.server.registry.getCurrentProfile;
            expect(channel.send.calledOnce).to.be.true;
        });
        it('should dispatch PROFILE_GET_CURRENT_SUCCESS', () => {
            stub = sinon.stub(service, 'profileSaveLogged', spy);
            sagaTester.dispatch(actions.profileGetCurrent());
            const clientChannel = global.Channel.client.registry.getCurrentProfile;
            const resp = { data: { akashaId: 'test', profileAddress: '0xtest' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_GET_CURRENT_SUCCESS)).to.equal(1,
                'PROFILE_GET_CURRENT_SUCCESS was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.profileGetCurrentSuccess(resp.data));
        });
        it('should call profileSaveLogged', () => {
            stub = sinon.stub(service, 'profileSaveLogged', spy);
            sagaTester.dispatch(actions.profileGetCurrent());
            const clientChannel = global.Channel.client.registry.getCurrentProfile;
            const resp = { data: { akashaId: 'test', profileAddress: '0xtest' } };
            clientChannel.triggerResponse(resp);
            expect(spy.callCount).to.be.equal(1, 'profileSaveLogged was not called once');
            const expected = {
                account: null,
                akashaId: 'test',
                expiration: null,
                profile: '0xtest',
                token: null
            };
            expect(spy.calledWith(expected)).to.be.true;
        });
        it('should dispatch PROFILE_SAVE_LOGGED_ERROR', () => {
            stub = sinon.stub(service, 'profileSaveLogged').throws(new Error());
            sagaTester.dispatch(actions.profileGetCurrent());
            const clientChannel = global.Channel.client.registry.getCurrentProfile;
            const resp = { data: { akashaId: 'test', profileAddress: '0xtest' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_SAVE_LOGGED_ERROR)).to.equal(1,
                'PROFILE_SAVE_LOGGED_ERROR was not called once');
        });
        it('should dispatch PROFILE_GET_CURRENT_ERROR', () => {
            stub = sinon.stub(service, 'profileSaveLogged', spy);
            sagaTester.dispatch(actions.profileGetCurrent());
            const clientChannel = global.Channel.client.registry.getCurrentProfile;
            const resp = { error: { message: 'test error' }, data: {} };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_GET_CURRENT_ERROR)).to.equal(1,
                'PROFILE_GET_CURRENT_ERROR was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.profileGetCurrentError(resp.error));
        });
    });

    describe(types.PROFILE_GET_LOCAL, () => {
        it('should make the request to getLocalIdentities', () => {
            sagaTester.dispatch(actions.profileGetLocal());
            const channel = global.Channel.server.auth.getLocalIdentities;
            expect(channel.send.calledOnce).to.be.true;
        });
        describe('with no local profiles', () => {
            it('should dispatch PROFILE_GET_LOCAL_SUCCESS', () => {
                sagaTester.dispatch(actions.profileGetLocal());
                const clientChannel = global.Channel.client.auth.getLocalIdentities;
                const resp = { data: [] };
                clientChannel.triggerResponse(resp);
                expect(sagaTester.numCalled(types.PROFILE_GET_LOCAL_SUCCESS)).to.equal(1,
                    'PROFILE_GET_LOCAL_SUCCESS was not called once');
                expect(sagaTester.getLatestCalledAction())
                    .to.deep.equal(actions.profileGetLocalSuccess(resp.data));
            });
            it('should dispatch PROFILE_GET_LIST', () => {
                sagaTester.dispatch(actions.profileGetLocal());
                const clientChannel = global.Channel.client.auth.getLocalIdentities;
                const resp = { data: [] };
                clientChannel.triggerResponse(resp);
                expect(sagaTester.numCalled(types.PROFILE_GET_LIST)).to.equal(1,
                    'PROFILE_GET_LIST was not called once');
                expect(sagaTester.getLatestCalledActions(2)[0])
                    .to.deep.equal(actions.profileGetList([]));
            });
        });
        describe('with local profiles', () => {
            const resp = {
                data: [{
                    key: '0xethkey',
                    profile: '0xprofile'
                }, {
                    key: '0xethkey2',
                    profile: '0xprofile2'
                }]
            };
            it('should dispatch PROFILE_GET_LOCAL_SUCCESS', () => {
                sagaTester.dispatch(actions.profileGetLocal());
                const clientChannel = global.Channel.client.auth.getLocalIdentities;
                clientChannel.triggerResponse(resp);
                expect(sagaTester.numCalled(types.PROFILE_GET_LOCAL_SUCCESS)).to.equal(1,
                    'PROFILE_GET_LOCAL_SUCCESS was not called once');
                expect(sagaTester.getLatestCalledAction())
                    .to.deep.equal(actions.profileGetLocalSuccess(resp.data));
            });
            it('should dispatch PROFILE_GET_LIST', () => {
                sagaTester.dispatch(actions.profileGetLocal());
                const clientChannel = global.Channel.client.auth.getLocalIdentities;
                clientChannel.triggerResponse(resp);
                expect(sagaTester.numCalled(types.PROFILE_GET_LIST)).to.equal(1,
                    'PROFILE_GET_LIST was not called once');
                const expected = [{ profile: '0xprofile' }, { profile: '0xprofile2' }];
                expect(sagaTester.getLatestCalledActions(2)[0])
                    .to.deep.equal(actions.profileGetList(expected));
            });
        });
        it('should dispatch PROFILE_GET_LOCAL_ERROR', () => {
            sagaTester.dispatch(actions.profileGetLocal());
            const clientChannel = global.Channel.client.auth.getLocalIdentities;
            const resp = { error: { message: 'test' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_GET_LOCAL_ERROR)).to.equal(1,
                'PROFILE_GET_LOCAL_ERROR was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.profileGetLocalError(resp.error));
        });
    });
    describe(types.PROFILE_GET_LIST, () => {
        const payload = [{ profile: '0xprofile' }];
        it('should make the request to getProfileList', () => {
            const channel = global.Channel.server.profile.getProfileList;
            channel.send.reset();
            sagaTester.dispatch(actions.profileGetList(payload));
            expect(channel.send.callCount).to.be.equal(1, 'getProfileList was not called once');
            expect(channel.send.calledWith(payload)).to.be.true;
        });
        it('should dispatch PROFILE_GET_LIST_SUCCESS', () => {
            sagaTester.dispatch(actions.profileGetList(payload));
            const clientChannel = global.Channel.client.profile.getProfileList;
            const resp = { data: { collection: [{ akashaId: 'test', profile: '0xprofile' }] } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_GET_LIST_SUCCESS)).to.equal(1,
                'PROFILE_GET_LIST_SUCCESS was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.profileGetListSuccess(resp.data));
        });
        it('should dispatch PROFILE_GET_LIST_ERROR', () => {
            sagaTester.dispatch(actions.profileGetList(payload));
            const clientChannel = global.Channel.client.profile.getProfileList;
            const resp = { error: { message: 'test error' }, data: {} };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_GET_LIST_ERROR)).to.equal(1,
                'PROFILE_GET_LIST_ERROR was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.profileGetListError(resp.error));
        });
    });
    describe(types.PROFILE_LOGIN, () => {
        const payload = {
            account: '0xethaccount',
            akashaId: 'test',
            password: 'password',
            rememberTime: 5,
        };
        // mock TextEncoder and its encode method
        global.TextEncoder = function TextEncoder (format) {
            this.encode = () => payload.password;
        };
        it('should make the request to login channel', () => {
            const channel = global.Channel.server.auth.login;
            sagaTester.dispatch(actions.profileLogin(payload));
            expect(channel.send.callCount).to.be.equal(1, 'login was not called once');
            expect(channel.send.calledWith(payload)).to.be.true;
        });
        it('should dispatch PROFILE_LOGIN_SUCCESS', () => {
            sagaTester.dispatch(actions.profileLogin(payload));
            const clientChannel = global.Channel.client.auth.login;
            const resp = { data: { account: '0xeth', expiration: '01/01/90', token: 'abcd' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_LOGIN_SUCCESS)).to.equal(1,
                'PROFILE_LOGIN_SUCCESS was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.profileLoginSuccess(resp.data));
        });
        it('should dispatch PROFILE_GET_CURRENT', () => {
            sagaTester.dispatch(actions.profileLogin(payload));
            const clientChannel = global.Channel.client.auth.login;
            const resp = { data: { account: '0xeth', expiration: '01/01/90', token: 'abcd' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_GET_CURRENT)).to.equal(1,
                'PROFILE_GET_CURRENT was not called once');
            expect(sagaTester.getLatestCalledActions(2)[0])
                .to.deep.equal(actions.profileGetCurrent());
        });
        it('should dispatch PROFILE_LOGIN_ERROR', () => {
            sagaTester.dispatch(actions.profileLogin(payload));
            const clientChannel = global.Channel.client.auth.login;
            const resp = { error: { message: 'test error' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.PROFILE_LOGIN_ERROR)).to.equal(1,
                'PROFILE_LOGIN_ERROR was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.profileLoginError(resp.error));
        });
    });
});
