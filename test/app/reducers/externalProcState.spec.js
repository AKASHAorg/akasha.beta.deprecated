import chai from 'chai';
import chaiIM from 'chai-immutable';
import EProcReducer from '../../../app/local-flux/reducers/externalProcState';
import { GethStatusModel, IpfsStatusModel } from '../../../app/local-flux/reducers/models';
import * as types from '../../../app/local-flux/constants/external-process-constants';
import { fromJS, Map } from 'immutable';

chai.use(chaiIM);
const { expect } = chai;
// EProcReducer(<initialState>, <)


describe('reducers', () => {
  describe('ExternalProcState Reducer', () => {
    let initialState = fromJS({
        geth: new GethStatusModel(),
        ipfs: new IpfsStatusModel()
    });
    let modifiedState = null;
    afterEach(() => {
      describe('test', () => {
        expect(true).to.be.true;
      })
      expect(modifiedState).to.have.property('geth').that.is.an.instanceOf(GethStatusModel);
    });
    it('should handle initial state', () => {
      modifiedState = EProcReducer(undefined, {});
      expect(modifiedState.equals(initialState)).to.be.true;
    });
    it('should handle START_GETH_SUCCESS', () => {
        modifiedState = EProcReducer(initialState, {type: 'START_GETH'});
        expect(modifiedState.equals(initialState)).to.be.false;
    });
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
