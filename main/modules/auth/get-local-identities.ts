import * as Promise from 'bluebird';
import { constructed } from '../../contracts/index';

const execute = Promise.coroutine(function*() {
    return constructed.instance.registry.getLocalProfiles();
});

export default { execute, name: 'getLocalIdentities' };