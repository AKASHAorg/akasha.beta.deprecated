import * as Promise from 'bluebird';
import { stat } from 'fs';
import { GethConnector } from '@akashaproject/geth-connector';
import { getGenesisPath } from '../../config/genesis';

const statAsync = Promise.promisify(stat);
const execute = Promise.coroutine(function*(data: GethStartRequest) {
    if (GethConnector.getInstance().serviceStatus.process) {
        throw new Error('Geth is already running');
    }
    const dataDir = GethConnector.getInstance().spawnOptions.get('datadir');
    let requiresGenesis = false;
    if (dataDir) {
        requiresGenesis = yield statAsync(dataDir).then((stats) => {
            if (stats.isDirectory()) {
                return false;
            }
        }).catch(() => {
            return true;
        });
    }
    // write genesis block if needed
    if (requiresGenesis) {
        yield Promise.fromCallback((cb) => {
            GethConnector.getInstance().writeGenesis(getGenesisPath(), cb);
        });
    }
    // start daemon
    yield GethConnector.getInstance().start(data);
    return {};
});

export default { execute, name: 'startService' };