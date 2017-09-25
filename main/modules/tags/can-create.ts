import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

const execute = Promise.coroutine(function* (data: {ethAddress: string}) {
    const can = yield contracts.instance.Tags.canCreate(data.ethAddress);
    return { can };
});

export default { execute, name: 'canCreate' };
