import chai, { expect } from 'chai';
import chaiIM from 'chai-immutable';
import { call, take, put } from 'redux-saga/effects';
import SagaTester from 'redux-saga-tester';
import { tempProfileData } from '../response-data/temp-profile';
import { watchTempProfileActions, createTempProfile, createEthAddress } from '../../../app/local-flux/sagas/temp-profile-saga';
import tempProfileState from '../../../app/local-flux/reducers/temp-profile-state';
import * as types from '../../../app/local-flux/constants/temp-profile-constants';

chai.use(chaiIM);

const initialState = tempProfileState(undefined, {});

describe('temp-profile-saga', () => {
    const sagaTester = new SagaTester({
        initialState,
        reducers: tempProfileState
    });
    sagaTester.start(watchTempProfileActions);
    it('should start with initialState', () => {
        expect(sagaTester.getState()).to.eql(initialState);
    });
    it(`should listen for ${types.TEMP_PROFILE_CREATE} only once`, () => {
        sagaTester.dispatch({ type: types.TEMP_PROFILE_CREATE, data: tempProfileData });

        expect(sagaTester.numCalled(types.TEMP_PROFILE_CREATE)).to.equal(1);
        console.log(sagaTester.getState(), sagaTester, 'tester');
    });

})
