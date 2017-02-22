import { expect } from 'chai';
import EProcReducer from '../../../app/local-flux/reducers/externalProcState';
import { GethStatusModel, IpfsStatusModel } from '../../../app/local-flux/reducers/models';
import * as types from '../../../app/local-flux/constants/external-process-constants';
import { fromJS } from 'immutable';

// EProcReducer(<initialState>, <)
const initialState = fromJS({
    geth: new GethStatusModel(),
    ipfs: new IpfsStatusModel()
});
describe('reducers', () => {
  describe('ExternalProcState Reducer', () => {
    it('should handle initial state', () => {
      const testState = EProcReducer(undefined, {});
      expect(testState.equals(initialState)).to.be.true;
    });
    it('should handle START_GETH_SUCCESS', () => {
        const state = EProcReducer(initialState, {type: 'START_GETH'});
        expect(state.equals(initialState)).to.be.false;
    })
    // it('should handle INCREMENT_COUNTER', () => {
    //   expect(counter(1, { type: INCREMENT_COUNTER })).to.equal(2);
    // });
    //
    // it('should handle DECREMENT_COUNTER', () => {
    //   expect(counter(1, { type: DECREMENT_COUNTER })).to.equal(0);
    // });
    //
    // it('should handle unknown action type', () => {
    //   expect(counter(1, { type: 'unknown' })).to.equal(1);
    // });
  });
});
