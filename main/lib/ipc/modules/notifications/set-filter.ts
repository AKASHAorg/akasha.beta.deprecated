import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Set which profiles to watch for changes
 * @param data
 * @returns {Bluebird<{done: boolean, watching: any}>}
 */
const execute = Promise.coroutine(function*(data: { profiles: string[], blockNr?: number} ) {
    const blockNr = (data.blockNr) ? data.blockNr: yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    global['profilesFilter'] = { profiles: data.profiles, blockNr: blockNr };
    return {done: true, watching: global['profilesFilter']};
});

export default { execute, name: 'setFilter' };
