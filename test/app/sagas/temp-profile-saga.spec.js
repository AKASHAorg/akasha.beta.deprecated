import chai from 'chai';
import { spy } from 'sinon';
import { apply, put } from 'redux-saga/effects';
import { watchTempProfileActions, createTempProfile, createEthAddress } from '../../../app/local-flux/sagas/temp-profile-saga';
import * as tempProfileActions from '../../../app/local-flux/actions/temp-profile-actions';
import * as registryService from '../../../app/local-flux/services/registry-service';
import { createActionChannels } from '../../../app/local-flux/sagas/helpers';
import { tempProfileData } from '../response-data/temp-profile';
import { Channel } from '../helpers/channels.js';

const { expect } = chai;
const getState = () => state;

describe('temp-profile-saga', () => {
    before('initialize helpers and stuff', () => {
        global.Channel = Channel;
        console.log(global.Channel);
    });
    beforeEach('create a fresh set of channels', () => {
        createActionChannels();
    })
    describe('createTempProfile saga', () => {
        const createTempProfileSaga = createTempProfile(tempProfileData);
        let next;
        it('should create temp profile in db', () => {
            next = createTempProfileSaga.next();
            expect(next.value).to.eql(apply(registryService, registryService.createTempProfile, [tempProfileData]))
        });
        it('should fire tempProfileCreateSuccess action', () => {
            const dbResult = { id: 1 }
            next = createTempProfileSaga.next(tempProfileData);
            expect(next.value).to.eql(put(tempProfileActions.tempProfileCreateSuccess(tempProfileData)));
        });
    });
    describe('createEthAddress saga', () => {
        const createEthAddressSaga = createEthAddress(tempProfileData);
        let next;
        it('should do something', () => {
            next = createEthAddressSaga.next(tempProfileData);
            next = createEthAddressSaga.next(tempProfileData);
            console.log(next.value.CALL.args, 'createEthAddress next');
        });
    });
});
