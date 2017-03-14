import chai, { expect } from 'chai';
import chaiIM from 'chai-immutable';
import sinon from 'sinon';
import SagaTester from 'redux-saga-tester';
import * as tempProfileActions from '../../../app/local-flux/actions/temp-profile-actions';
import { tempProfileData } from '../response-data/temp-profile';
import tempProfileState from '../../../app/local-flux/reducers/temp-profile-state';
import * as types from '../../../app/local-flux/constants/temp-profile-constants';
import * as registryService from '../../../app/local-flux/services/registry-service';
import { watchTempProfileActions } from '../../../app/local-flux/sagas/temp-profile-saga';

chai.use(chaiIM);

const initialState = tempProfileState(undefined, {});

describe('temp-profile-saga', () => {
    let sagaTester;
    let createProfileStub;
    let updateProfileStub;
    let deleteProfileStub;
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
    });
    it('should start with initialState', () => {
        expect(sagaTester.getState()).to.eql(initialState);
    });
    it(`should listen for ${types.TEMP_PROFILE_CREATE} only once`, () => {
        sagaTester.dispatch(tempProfileActions.tempProfileCreate(tempProfileData));
        expect(sagaTester.numCalled(types.TEMP_PROFILE_CREATE)).to.equal(1);
    });
    it(`createTempProfile should fire ${types.TEMP_PROFILE_CREATE_SUCCESS}`, () => {
        const calledActions = sagaTester.getCalledActions();
        const successAction = calledActions.find(ac =>
            ac.type === types.TEMP_PROFILE_CREATE_SUCCESS
        );
        expect(successAction.type).to.equal(types.TEMP_PROFILE_CREATE_SUCCESS);
    });
    it(`createTempProfile should fire ${types.TEMP_PROFILE_CREATE_SUCCESS} with profileData payload`, () => {
        const calledActions = sagaTester.getCalledActions();
        const successAction = calledActions.find(ac =>
            ac.type === types.TEMP_PROFILE_CREATE_SUCCESS
        );
        expect(successAction.data).to.eql(tempProfileData);
    });
    it(`createEthAddress should trigger ${types.ETH_ADDRESS_CREATE_SUCCESS}`, () => {
        const managerChannel = global.Channel.client.auth.manager;
        const generateKeyChannel = global.Channel.client.auth.generateEthKey;
        managerChannel.triggerResponse({ data: { enabled: true } });
        generateKeyChannel.triggerResponse({ data: { address: '0x02233112455352asdasd4134123' } });
        const expectedAction = sagaTester.getCalledActions().find(ac => ac.type === types.ETH_ADDRESS_CREATE_SUCCESS);
        expect(expectedAction).to.have.property('data');
    });
    it('createEthAddress => tempProfileData should have property address', () => {
        const expectedAction = sagaTester.getCalledActions().find(ac => ac.type === types.ETH_ADDRESS_CREATE_SUCCESS);
        expect(expectedAction.data).to.have.property('address').and.to.be.a('string');
    });
    it('requestEther saga', () => {
        const requestEthChannel = global.Channel.client.auth.requestEther;
        requestEthChannel.triggerResponse({ data: { tx: '0X0FaucetRequestTransaction' } });
        const expectedAction = sagaTester.getCalledActions().find(ac => ac.type === types.FUND_FROM_FAUCET_SUCCESS);
        expect(expectedAction).to.not.be.undefined;
        expect(expectedAction).to.have.property('data');
        expect(expectedAction).to.have.deep.property('data.currentStatus.faucetTx').and.to.be.a('string');
        expect(expectedAction).to.have.deep.property('data.currentStatus.faucetRequested').and.to.be.true;
    });
    it.skip('tempProfileUpdate should be called 4 times', () => {
        expect(updateProfileStub.callCount).to.equal(4);
    });
});
