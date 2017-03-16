import chai from 'chai';
import chaiIM from 'chai-immutable';
import * as types from '../../../app/local-flux/constants';
import { ErrorModel } from '../../../app/local-flux/reducers/models';
import ErrorReducer from '../../../app/local-flux/reducers/externalProcState';
import { gethStartError } from '../response-data/geth';

chai.use(chaiIM);
const { expect } = chai;

describe('should handle errors:', function () {
    const initialState = new ErrorModel();
    let modifiedState = null;
    beforeEach(() => {
        modifiedState = initialState;
    })
    it.skip(`should handle ${types.START_GETH_ERROR}`, () => {
        modifiedState = ErrorReducer(modifiedState, { type: types.START_GETH_ERROR, error: gethStartError });
        expect(modifiedState.get('errors')).to.not.be.empty;
    });
});
