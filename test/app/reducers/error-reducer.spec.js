


describe('should handle errors:', function () {
    it(`should handle ${types.START_GETH_ERROR}`, () => {
        modifiedState = EProcReducer(modifiedState, { type: types.START_GETH_ERROR, error: gethStartError });
        expect(modifiedState.getIn(['geth', 'errors'])).to.not.be.empty;
        expect(modifiedState.getIn(['geth', 'errors', 0])).to.have.keys(['code', 'message', 'fatal', 'from']);
        expect(modifiedState.getIn(['geth', 'errors']).first()).to.be.instanceof(ErrorRecord)
    });
});
