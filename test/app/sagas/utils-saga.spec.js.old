import chai, { expect } from 'chai';
import SagaTester from 'redux-saga-tester';
import proxyquire from 'proxyquire';
import * as types from '../../../app/local-flux/constants';
import * as actions from '../../../app/local-flux/actions/utils-actions';
import * as appActions from '../../../app/local-flux/actions/app-actions';

const sagas = proxyquire('../../../app/local-flux/sagas/utils-saga', {
    './helpers': {
        enableChannel: () => {}
    }
});

describe('utils saga', function test () {
    let sagaTester;
    before(() => {
        sagaTester = new SagaTester({
            null,
            reducers: state => state
        });
        sagaTester.start(sagas.registerWatchers);
    });
    afterEach(() => {
        sagaTester.reset(true);
    });
    describe(types.BACKUP_KEYS_REQUEST, () => {
        it('should dispatch BACKUP_KEYS_SUCCESS', () => {
            sagaTester.dispatch(actions.backupKeysRequest());
            const clientChannel = global.Channel.client.utils.backupKeys;
            const resp = { data: { target: 'text/path' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.BACKUP_KEYS_SUCCESS)).to.equal(1,
                'BACKUP_KEYS_SUCCESS was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.backupKeysSuccess(resp.data));
        });
        it('should dispatch SHOW_NOTIFICATION', () => {
            sagaTester.dispatch(actions.backupKeysRequest());
            const clientChannel = global.Channel.client.utils.backupKeys;
            const resp = { data: { target: 'text/path' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.SHOW_NOTIFICATION)).to.equal(1,
                'SHOW_NOTIFICATION was not called once');
            expect(sagaTester.getLatestCalledActions(2)[0])
                .to.deep.equal(appActions.showNotification({
                    id: 'backupSuccess',
                    values: { path: resp.data.target }
                }));
        });
        it('should dispatch BACKUP_KEYS_ERROR', () => {
            sagaTester.dispatch(actions.backupKeysRequest());
            const clientChannel = global.Channel.client.utils.backupKeys;
            const resp = { data: { }, error: { message: 'error' } };
            clientChannel.triggerResponse(resp);
            expect(sagaTester.numCalled(types.BACKUP_KEYS_ERROR)).to.equal(1,
                'BACKUP_KEYS_ERROR was not called once');
            expect(sagaTester.getLatestCalledAction())
                .to.deep.equal(actions.backupKeysError(resp.error));
        });
    });
});
