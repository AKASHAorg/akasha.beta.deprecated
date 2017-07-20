import * as Promise from 'bluebird';
import { stat } from 'fs';
import { GethConnector } from '@akashaproject/geth-connector';
import { getGenesisPath } from '../../config/genesis';

const statAsync = Promise.promisify(stat);
const execute = Promise.coroutine(function*(data: GethStartRequest) {
    if (GethConnector.getInstance().serviceStatus.process) {
        throw new Error('Geth is already running');
    }
    GethConnector.getInstance().setOptions(data);
    GethConnector.getInstance().enableDownloadEvents();
    const dataDir = GethConnector.getInstance().spawnOptions.get('datadir');
    let requiresGenesis = false;
    if (dataDir) {
        requiresGenesis = yield statAsync(dataDir).then((stats) => {
            return !stats.isDirectory();
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
    yield GethConnector.getInstance().start();
    return {};
});

export default { execute, name: 'startService' };
