import chai, { expect } from 'chai';
import chaiIM from 'chai-immutable';
import { Record } from 'immutable';
import TempProfileState from '../../../app/local-flux/reducers/temp-profile-state';
import { TempProfileModel } from '../../../app/local-flux/reducers/models';
import * as types from '../../../app/local-flux/constants';
import { tempProfileData } from '../response-data/temp-profile';

chai.use(chaiIM);

describe('TempProfileState', () => {
    const initialState = new TempProfileModel();
    let modifiedState;
    beforeEach(() => {
        modifiedState = initialState;
    });
    afterEach(() => {
        expect(modifiedState).to.have.all.keys('tempProfile', 'status');
        expect(modifiedState.get('tempProfile'))
            .to.be.an.instanceof(Record)
            .and.not.have.property('status');
        expect(modifiedState.get('status'))
            .to.be.an.instanceof(Record)
            .and.to.have.all.keys('faucetTx', 'faucetRequested', 'publishTx', 'publishRequested', 'currentAction');
    });
    it('should handle initial state', () => {
        modifiedState = TempProfileState(undefined, {});
        expect(modifiedState).to.eql(initialState);
    });
    it(`should handle ${types.TEMP_PROFILE_CREATE}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_CREATE,
            data: tempProfileData
        });
        expect(modifiedState).to.have.property('tempProfile')
            .that.is.instanceof(Record)
            .and.is.not.eql(initialState.get('tempProfile'));
    });
    it(`should handle ${types.TEMP_PROFILE_CREATE_SUCCESS} and populate temp profile`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_CREATE_SUCCESS
        });
        expect(modifiedState.get('status')).to.have.property('currentAction').that.is.eql(types.TEMP_PROFILE_CREATE_SUCCESS);
    });
    it(`should handle ${types.ETH_ADDRESS_CREATE}`, () => {
        tempProfileData.status.currentAction = types.ETH_ADDRESS_CREATE;
        modifiedState = TempProfileState(modifiedState, {
            type: types.ETH_ADDRESS_CREATE,
            data: tempProfileData
        });
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.ETH_ADDRESS_CREATE);
    });
    it(`should handle ${types.ETH_ADDRESS_CREATE_SUCCESS}`, () => {
        tempProfileData.address = '0x00asddsaabccba';
        tempProfileData.status.currentAction = types.ETH_ADDRESS_CREATE_SUCCESS;
        modifiedState = TempProfileState(modifiedState, {
            type: types.ETH_ADDRESS_CREATE_SUCCESS,
            data: tempProfileData
        });
        expect(modifiedState.getIn(['tempProfile', 'address'])).to.be.a('string');
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.ETH_ADDRESS_CREATE_SUCCESS);
    });
    it(`should handle ${types.FUND_FROM_FAUCET}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.FUND_FROM_FAUCET
        });
        expect(modifiedState.getIn(['status', 'faucetRequested'])).to.equal(true);
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.FUND_FROM_FAUCET);
    });
    it(`should handle ${types.FUND_FROM_FAUCET_SUCCESS}`, () => {
        tempProfileData.status.faucetTx = '0x0123FaucetTx';
        modifiedState = TempProfileState(modifiedState, {
            type: types.FUND_FROM_FAUCET_SUCCESS,
            data: tempProfileData
        });
        expect(modifiedState.getIn(['status', 'faucetTx'])).to.equal(tempProfileData.status.faucetTx);
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.FUND_FROM_FAUCET_SUCCESS);
    });

    it(`should handle ${types.TEMP_PROFILE_FAUCET_TX_MINED}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_FAUCET_TX_MINED
        });
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.TEMP_PROFILE_FAUCET_TX_MINED);
    });
    it(`should handle ${types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS
        });
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS);
    });
    it(`should handle ${types.TEMP_PROFILE_LOGIN}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_LOGIN
        });
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.TEMP_PROFILE_LOGIN);
    });
    it(`should handle ${types.TEMP_PROFILE_LOGIN_SUCCESS}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_LOGIN_SUCCESS
        });
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.TEMP_PROFILE_LOGIN_SUCCESS);
    });
    it(`should handle ${types.TEMP_PROFILE_PUBLISH}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_PUBLISH
        });
        expect(modifiedState.getIn(['status', 'publishRequested'])).to.equal(true);
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.TEMP_PROFILE_PUBLISH);
    });
    it(`should handle ${types.TEMP_PROFILE_PUBLISH_SUCCESS}`, () => {
        tempProfileData.status.publishTx = '0x0123PublishTx';
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_PUBLISH_SUCCESS,
            data: tempProfileData
        });
        expect(modifiedState.getIn(['status', 'publishTx'])).to.equal(tempProfileData.status.publishTx);
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.TEMP_PROFILE_PUBLISH_SUCCESS);
    });
    it(`should handle ${types.TEMP_PROFILE_PUBLISH_TX_MINED}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_PUBLISH_TX_MINED
        });
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.TEMP_PROFILE_PUBLISH_TX_MINED);
    });
    it(`should handle ${types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS
        });
        expect(modifiedState.getIn(['status', 'currentAction'])).to.equal(types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS);
    });
    it(`should handle ${types.TEMP_PROFILE_DELETE_SUCCESS}`, () => {
        modifiedState = TempProfileState(modifiedState, {
            type: types.TEMP_PROFILE_DELETE_SUCCESS
        });
        expect(modifiedState).to.equal(initialState);
    });
});
