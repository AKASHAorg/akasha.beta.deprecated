import chai, { expect } from 'chai';
import chaiIM from 'chai-immutable';
import sinon from 'sinon';
import SagaTester from 'redux-saga-tester';
import * as tempProfileActions from '../../../app/local-flux/actions/temp-profile-actions';
import { tempProfileData } from '../response-data/temp-profile';
import tempProfileState from '../../../app/local-flux/reducers/temp-profile-state';
import * as registryService from '../../../app/local-flux/services/registry-service';
import { watchTempProfileActions } from '../../../app/local-flux/sagas/temp-profile-saga';

chai.use(chaiIM);

const initialState = tempProfileState(undefined, {});

describe('In `temp-profile-saga`,', () => {
    describe('when no errors are thrown,', () => { // eslint-disable-line max-statements
        let sagaTester;
        let createProfileStub;
        let updateProfileStub;
        let deleteProfileStub;
        const profileData = Object.assign({}, tempProfileData);
        before(() => {
            createProfileStub = sinon.stub(registryService, 'createTempProfile', prof => prof);
            updateProfileStub = sinon.stub(registryService, 'updateTempProfile', profile => profile);
            deleteProfileStub = sinon.stub(registryService, 'deleteTempProfile', profile => profile);
            sagaTester = new SagaTester({
                initialState,
                reducers: tempProfileState
            });
            sagaTester.start(watchTempProfileActions);
        });
        after(() => {
            createProfileStub.restore();
            updateProfileStub.restore();
            deleteProfileStub.restore();
            sagaTester.reset(true);
        });
        it('should start with initialState', () => {
            expect(sagaTester.getState()).to.eql(initialState);
        });
        it(`should listen for ${tempProfileActions.tempProfileCreate().type} only once`, () => {
            sagaTester.dispatch(tempProfileActions.tempProfileCreate(profileData));
            expect(sagaTester.numCalled(tempProfileActions.tempProfileCreate().type)).to.equal(1);
        });
        it(`createTempProfile should fire ${tempProfileActions.tempProfileCreateSuccess().type}`, () => {
            const calledActions = sagaTester.getCalledActions();
            const action = tempProfileActions.tempProfileCreateSuccess();
            const successAction = calledActions.find(ac =>
                ac.type === action.type
            );
            expect(successAction.type).to.equal(action.type);
        });
        it(`createTempProfile should fire ${tempProfileActions.tempProfileCreateSuccess().type} with profileData payload`, () => {
            const calledActions = sagaTester.getCalledActions();
            const successAction = calledActions.find(ac =>
                ac.type === tempProfileActions.tempProfileCreateSuccess().type
            );
            expect(successAction.data).to.eql(profileData);
        });
        it(`createEthAddress should trigger ${tempProfileActions.ethAddressCreateSuccess().type}`, () => {
            const managerChannel = global.Channel.client.auth.manager;
            const generateKeyChannel = global.Channel.client.auth.generateEthKey;
            managerChannel.triggerResponse({ data: { enabled: true } });
            generateKeyChannel.triggerResponse({ data: { address: '0x02233112455352asdasd4134123' } });
            const expectedAction = sagaTester.getCalledActions().find(ac =>
                ac.type === tempProfileActions.ethAddressCreateSuccess().type
            );
            expect(expectedAction).to.have.property('data');
            expect(expectedAction.data).to.have.property('address').and.to.be.a('string');
        });
        it(`faucetRequest should trigger ${tempProfileActions.faucetRequest().type}`, () => {
            const expectedAction = sagaTester.getLatestCalledAction();
            expect(expectedAction).to.be.a('object');
            expect(expectedAction).to.have.property('type').that.is.equal(tempProfileActions.faucetRequest().type);
        });
        it(`faucetRequestListener should trigger ${tempProfileActions.faucetRequestSuccess().type}`, () => {
            const requestEthChannel = global.Channel.client.auth.requestEther;
            requestEthChannel.triggerResponse({ data: { tx: '0X0FaucetRequestTransaction' } });
            const expectedAction = sagaTester.getCalledActions().find(ac =>
                ac.type === tempProfileActions.faucetRequestSuccess().type
            );
            expect(expectedAction).to.be.a('object');
            expect(expectedAction).to.have.property('data');
            expect(expectedAction).to.have.deep.property('data.currentStatus.faucetTx').and.to.be.a('string');
            expect(expectedAction).to.have.deep.property('data.currentStatus.faucetRequested').and.to.equal(true);
        });
        it(`addToQueue should trigger ${tempProfileActions.tempProfileFaucetTxMined().type} once`, () => {
            const expectedAction = sagaTester.getLatestCalledAction();
            expect(expectedAction).to.have.property('type').that.is.equal(tempProfileActions.tempProfileFaucetTxMined().type);
        });
        it(`listenFaucetTx should fire ${tempProfileActions.tempProfileFaucetTxMinedSuccess().type} saga tests`, () => {
            const emitMinedCh = global.Channel.client.tx.emitMined;
            emitMinedCh.triggerResponse({ data: { tx: '0X0FaucetRequestTransaction', mined: true } });
            const expectedActionType = tempProfileActions.tempProfileFaucetTxMinedSuccess().type;
            const expectedAction = sagaTester.getCalledActions().find(ac =>
                ac.type === expectedActionType
            );
            expect(expectedAction).to.be.a('object');
            expect(expectedAction).to.have.property('type').that.is.equal(expectedActionType);
        });
        it(`tempProfileLoginRequest should fire ${tempProfileActions.tempProfileLogin().type} action`, () => {
            const expectedAction = sagaTester.getLatestCalledAction();
            const expectedActionType = tempProfileActions.tempProfileLogin().type;
            expect(expectedAction).to.be.a('object');
            expect(expectedAction).to.have.property('type').that.is.equal(expectedActionType);
        });
        it(`tempProfileLoginListener should fire ${tempProfileActions.tempProfileLoginSuccess().type}`, () => {
            const loginChannel = global.Channel.client.auth.login;
            loginChannel.triggerResponse({ data: { address: '0X0FaucetRequestTransaction', token: 'abcSomeToken' } });
            const expectedActionType = tempProfileActions.tempProfileLoginSuccess().type;
            const expectedAction = sagaTester.getCalledActions().find(ac =>
                ac.type === expectedActionType
            );
            expect(expectedAction).to.be.a('object');
            expect(expectedAction).to.have.property('type').that.is.equal(expectedActionType);
        });
        it(`tempProfilePublishRequest should fire ${tempProfileActions.tempProfilePublish().type}`, () => {
            const expectedActionType = tempProfileActions.tempProfilePublish().type;
            const expectedAction = sagaTester.getLatestCalledAction();
            expect(expectedAction).to.be.a('object');
            expect(expectedAction).to.have.property('type').that.is.equal(expectedActionType);
        });
        it(`tempProfilePublishListener should fire ${tempProfileActions.tempProfilePublishSuccess().type}`, () => {
            const registryManagerChannel = global.Channel.client.registry.manager;
            const registerProfileChannel = global.Channel.client.registry.registerProfile;
            registryManagerChannel.triggerResponse({ data: { enabled: true } });
            registerProfileChannel.triggerResponse({ data: { tx: '0x0profileRegisteredTx' } });
            const expectedAction = sagaTester.getCalledActions().find(ac =>
                ac.type === tempProfileActions.tempProfilePublishSuccess().type
            );
            expect(expectedAction).to.be.a('object');
            expect(expectedAction).to.have.deep.property('data.currentStatus.publishTx').and.to.be.a('string');
        });
        it('should add publish transaction to queue once', () => {
            const expectedActionType = tempProfileActions.tempProfilePublishTxMined().type;
            const expectedAction = sagaTester.getLatestCalledAction();
            expect(expectedAction).to.have.property('type').that.is.equal(expectedActionType);
        });
        it('should listen for mined event and fire tempProfilePublishTxMinedSuccess() action creator', () => {
            const emitMinedCh = global.Channel.client.tx.emitMined;
            emitMinedCh.triggerResponse({ data: { tx: '0x0profileRegisteredTx' } });
            const expectedActionType = tempProfileActions.tempProfilePublishTxMinedSuccess().type;
            const expectedAction = sagaTester.getCalledActions().find(ac =>
                ac.type === expectedActionType
            );
            expect(expectedAction).to.be.an('object');
            expect(expectedAction).to.have.property('type').that.is.equal(expectedActionType);
        });

        it(`should attempt to remove tempProfile from database and call ${tempProfileActions.tempProfileDelete().type}`, () => {
            const expectedActionType = tempProfileActions.tempProfileDelete().type;
            const expectedAction = sagaTester.getCalledActions().find(ac =>
                ac.type === expectedActionType
            );
            expect(expectedAction).to.be.an('object');
            expect(expectedAction).to.have.property('type').that.is.equal(expectedActionType);
        });

        it('should call tempProfileCreate service method at least 1 times', () => {
            expect(createProfileStub.callCount).to.be.above(0);
        });
        it('should call deleteProfile service method at least 1 times', () => {
            expect(createProfileStub.callCount).to.be.above(0);
        });
        it('tempProfileUpdate should be called 3 times (createEthAddressListener, faucetListener, tempProfilePublishListener)', () => {
            expect(updateProfileStub.callCount).to.equal(3);
        });
    });
    describe('when errors are thrown', () => {
        let sagaTester;
        let createProfileStub;
        let updateProfileStub;
        let deleteProfileStub;
        const profileData = Object.assign({}, tempProfileData);
        before(() => {
            createProfileStub = sinon.stub(
                registryService,
                'createTempProfile'
            ).throws(new TypeError('cannot read property "toJS()" of undefined :D', 'registry-service.js', 101));

            updateProfileStub = sinon.stub(
                registryService,
                'updateTempProfile',
            ).throws(new ReferenceError('id is undefined', 'registry-service.js', 45));

            deleteProfileStub = sinon.stub(
                registryService,
                'deleteTempProfile',
             ).throws(new RangeError('id must be between -1 and 1'));

            sagaTester = new SagaTester({
                initialState,
                reducers: tempProfileState
            });
            sagaTester.start(watchTempProfileActions);
        });
        after(() => {
            createProfileStub.restore();
            updateProfileStub.restore();
            deleteProfileStub.restore();
            sagaTester.reset(true);
        });
        it(`should fire ${tempProfileActions.tempProfileCreateError().type} if cannot create profile in database`, () => {
            sagaTester.dispatch(tempProfileActions.tempProfileCreate(profileData));
            const expectedAction = sagaTester.getLatestCalledAction();
            expect(expectedAction).to.be.an('object');
            expect(expectedAction).to.have.property('type').that.is.equal(tempProfileActions.tempProfileCreateError().type);
            expect(expectedAction).to.have.property('error').that.is.instanceof(Error);
        });
        it(`createEthAddressListener should fire ${tempProfileActions.ethAddressCreateError().type} when error atribute is present in payload`, () => {
            sagaTester.dispatch(tempProfileActions.tempProfileCreateSuccess(profileData));
            const managerChannel = global.Channel.client.auth.manager;
            const generateKeyChannel = global.Channel.client.auth.generateEthKey;
            managerChannel.triggerResponse({ data: { enabled: true } });
            generateKeyChannel.triggerResponse({ error: { message: 'something broken' } });
            const expectedActionType = tempProfileActions.ethAddressCreateError().type;
            const expectedAction = sagaTester.getLatestCalledAction();
            expect(expectedAction).to.be.an('object');
            expect(expectedAction).to.have.property('type').and.to.equal(expectedActionType);
            expect(expectedAction).to.have.property('error').and.to.be.an('object');
        });
        it.skip(`faucetRequestListener should fire ${tempProfileActions.faucetRequestError().type} if an error returned from channel`, () => {

        });
        it.skip(`faucetRequestListener should fire ${tempProfileActions.faucetRequestError().type} if cannot update temp profile in database`, () => {

        });
        it.skip(`listenFaucetTx should fire ${tempProfileActions.faucetRequestError().type} if an error returned from emitMined channel`, () => {

        });
        it.skip(`tempProfileLoginListener should fire ${tempProfileActions.tempProfileLoginError().type} if an error ocured during login`, () => {

        });
        it.skip(`tempProfilePublishListener should fire ${tempProfileActions.tempProfilePublishError().type} when an error returned from channel`, () => {

        });
        it.skip(`publishTxListener should fire ${tempProfileActions.tempProfilePublishError().type} when an error returned from emitMined channel 
            and error.from.tx is equal to publishTx`, () => {

        });
        it.skip(`tempProfileDelete should fire ${tempProfileActions.tempProfileDeleteError().type} when an error returned from database service`, () => {
            
        });
        it('shows the saga tester in console and should be deleted when done!', () => {
            console.log(sagaTester.getCalledActions());
        });
    });
});
