import chai from 'chai';
import chaiIM from 'chai-immutable';
import * as errorActions from '../../../app/local-flux/actions/error-actions';
import * as externalProcActions from '../../../app/local-flux/actions/external-process-actions';
import { ErrorModel } from '../../../app/local-flux/reducers/models';
import { ErrorRecord } from '../../../app/local-flux/reducers/records';
import ErrorReducer from '../../../app/local-flux/reducers/errorState';

chai.use(chaiIM);
const { expect } = chai;

/* eslint-disable no-unused-expressions */

describe('error reducer tests:', () => {
    const initialState = new ErrorModel();
    let modifiedState = null;

    it('should delete non fatal error', () => {
        const id = '1234';
        const state = initialState.merge({
            allIds: [id],
            byId: {
                [id]: {
                    code: 'GSE01',
                    from: {},
                    message: 'error starting geth service',
                    messageId: 'gethStart',
                    fatal: false
                }
            },
            fatalErrors: [],
            nonFatalErrors: [id]
        });
        modifiedState = ErrorReducer(state, errorActions.errorDeleteNonFatal(id));
        expect(modifiedState.get('nonFatalErrors').size).to.equal(0,
            'did not delete non fatal error');
        expect(modifiedState.get('allIds').size).to.equal(1, 'it modified all ids list');
        expect(modifiedState.getIn(['byId', id])).to.be.ok;
    });
    it('should delete fatal error', () => {
        const id = '1234';
        const state = initialState.merge({
            allIds: [id],
            byId: {
                [id]: {
                    code: 'GSE01',
                    from: {},
                    message: 'error starting geth service',
                    messageId: 'gethStart',
                    fatal: false
                }
            },
            fatalErrors: [id],
            nonFatalErrors: []
        });
        modifiedState = ErrorReducer(state, errorActions.errorDeleteFatal(id));
        expect(modifiedState.get('fatalErrors').size).to.equal(0,
            'did not delete fatal error');
        expect(modifiedState.get('allIds').size).to.equal(1, 'it modified all ids list');
        expect(modifiedState.getIn(['byId', id])).to.be.ok;
    });
    it('should handle fatal error', () => {
        const errorObj = {
            code: 'GSE01',
            from: {},
            message: 'error starting geth service',
            messageId: 'gethStart',
            fatal: true
        };
        const err = new ErrorRecord(errorObj);
        const errorRecord = err.set('id', err.hashCode());
        const action = externalProcActions.gethStartError({}, errorObj);
        modifiedState = ErrorReducer(initialState, action);
        expect(modifiedState.get('fatalErrors').size).to.equal(1, 'did not add fatal error');
        expect(modifiedState.get('nonFatalErrors').size).to.equal(0,
            'added fatal error to non fatal errors list');
        expect(modifiedState.get('allIds').size).to.equal(1, 'did not add error in all ids list');
        expect(modifiedState.getIn(['byId', errorRecord.id]).equals(errorRecord)).to.be.true;
    });
    it('should handle non fatal error', () => {
        const errorObj = {
            code: 'GSE01',
            from: {},
            message: 'error starting geth service',
            messageId: 'gethStart',
            fatal: false
        };
        const err = new ErrorRecord(errorObj)
        const errorRecord = err.set('id', err.hashCode());
        const action = externalProcActions.gethStartError({}, errorObj);
        modifiedState = ErrorReducer(initialState, action);
        expect(modifiedState.get('nonFatalErrors').size).to.equal(1, 'did not add non fatal error');
        expect(modifiedState.get('fatalErrors').size).to.equal(0,
            'added non fatal error to fatal errors list');
        expect(modifiedState.get('allIds').size).to.equal(1, 'did not add error in all ids list');
        expect(modifiedState.getIn(['byId', errorRecord.id]).equals(errorRecord)).to.be.true;
    });
});

/* eslint-enable no-unused-expressions */
