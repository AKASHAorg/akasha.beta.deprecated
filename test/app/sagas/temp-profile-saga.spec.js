import chai, { expect } from 'chai';
import chaiIM from 'chai-immutable';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import SagaTester from 'redux-saga-tester';
import * as tempProfileActions from '../../../app/local-flux/actions/temp-profile-actions';
import { tempProfileData } from '../response-data/temp-profile';
import tempProfileState from '../../../app/local-flux/reducers/temp-profile-state';
import * as types from '../../../app/local-flux/constants/temp-profile-constants';

chai.use(chaiIM);

const initialState = tempProfileState(undefined, {});

describe('temp-profile-saga', () => {
    let sagaTester;
    let createTempProfileService;
    before(() => {
        createTempProfileService = sinon.spy(profileData => profileData);
        const watchTempProfileActions = proxyquire('../../../app/local-flux/sagas/temp-profile-saga', {
            '../services/registry-service': {
                createTempProfile: createTempProfileService
            }
        });
        sagaTester = new SagaTester({
            initialState,
            reducers: tempProfileState
        });
        sagaTester.start(watchTempProfileActions.watchTempProfileActions);
    });
    it('should start with initialState', () => {
        expect(sagaTester.getState()).to.eql(initialState);
    });
    it(`should listen for ${types.TEMP_PROFILE_CREATE} only once`, () => {
        sagaTester.dispatch(tempProfileActions.tempProfileCreate(tempProfileData));
        expect(sagaTester.numCalled(types.TEMP_PROFILE_CREATE)).to.equal(1);
    });
    it(`createTempProfile should fire ${types.TEMP_PROFILE_CREATE_SUCCESS}`, () => {
        sagaTester.dispatch(tempProfileActions.tempProfileCreate(tempProfileData));
        const calledActions = sagaTester.getCalledActions();
        const successAction = calledActions.find(ac =>
            ac.type === types.TEMP_PROFILE_CREATE_SUCCESS
        );
        expect(successAction.type).to.equal(types.TEMP_PROFILE_CREATE_SUCCESS);
        sagaTester.reset(true);
    });
    it(`createTempProfile should fire ${types.TEMP_PROFILE_CREATE_SUCCESS} with profileData payload`, () => {
        sagaTester.dispatch(tempProfileActions.tempProfileCreate(tempProfileData));
        const calledActions = sagaTester.getCalledActions();
        const successAction = calledActions.find(ac =>
            ac.type === types.TEMP_PROFILE_CREATE_SUCCESS
        );
        expect(successAction.data).to.eql(tempProfileData);
        sagaTester.reset(true);
    });
    it('createEthAddress', () => {
        sagaTester.dispatch(tempProfileActions.tempProfileCreateSuccess(tempProfileData));
        const managerChannel = global.Channel.client.auth.manager;
        const generateKeyChannel = global.Channel.client.auth.generateEthKey;
        managerChannel.triggerResponse({ enabled: true });
        generateKeyChannel.triggerResponse({ address: '0x02233112455352asdasd4134123' });
        // console.log(sagaTester, 'the tester');
    });
});
