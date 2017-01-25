import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getFollowingList from '../profile/following-list';
import currentProfile from '../registry/current-profile';
import { wild } from '../models/records';
import { FOLLOWING_LIST, BLOCK_INTERVAL } from '../../config/settings';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function*(data: { limit?: number, toBlock?: number, purgeCache?: boolean }) {
    if (data.purgeCache) {
        wild.removeFull(FOLLOWING_LIST);
    }
    if (!wild.hasFull(FOLLOWING_LIST)) {
        const myProfile = yield currentProfile.execute();
        const following = yield getFollowingList.execute({ akashaId: myProfile.akashaId });
        wild.setFull(FOLLOWING_LIST, following.collection);
    }
    const toBlock = (data.toBlock) ? data.toBlock :
        yield GethConnector.getInstance()
            .web3
            .eth
            .getBlockNumberAsync();

    const fromBlock = toBlock - BLOCK_INTERVAL;
    const filter = { fromBlock: (fromBlock > 0) ? fromBlock : 0, toBlock: data.toBlock };
    const following = wild.getFull(FOLLOWING_LIST);
    //const entries = [];
    const events = yield contracts.instance.entries.getPublished(filter);
    console.log(events);
    return { events, following };
});

export default { execute, name: 'followingStreamIterator' };
