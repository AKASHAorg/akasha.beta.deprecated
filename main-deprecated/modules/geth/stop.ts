import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import contracts from '../../contracts';

const execute = Promise.coroutine(function* () {
    yield contracts.stopAllWatchers();
    yield GethConnector.getInstance().stop();
    contracts.reset();
    return {};
});

export default { execute, name: 'stopService' };
