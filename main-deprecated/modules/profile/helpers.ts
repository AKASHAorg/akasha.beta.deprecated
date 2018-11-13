import * as uts46 from 'idna-uts46';
import contracts from '../../contracts/index';
import * as Promise from 'bluebird';
import { unpad } from 'ethereumjs-util';
import { GethConnector } from '@akashaproject/geth-connector';


export const normaliseId = function(name: string) {
    return uts46.toAscii(name, { useStd3ASCII: true, transitional: false });
};

export const profileAddress = Promise.coroutine(function* (data) {
    let profileAddress;
    if (data.akashaId) {
        const nameHash = yield contracts.instance.ProfileRegistrar.hash(normaliseId(data.akashaId));
        profileAddress = yield contracts.instance.ProfileResolver.addr(nameHash);
    } else if (data.ethAddress) {
        profileAddress = data.ethAddress;
    }

    if (profileAddress && !!unpad(profileAddress)) {
        return Promise.resolve(profileAddress);
    }
    return Promise.resolve(null);
});

export const resolveEthAddress = Promise.coroutine(function* (ethAddress: string) {
    const nameHash = yield contracts.instance.ProfileResolver.reverse(ethAddress);
    if (!!unpad(nameHash)) {
        const [akashaId, , , , ,] = yield contracts.instance.ProfileResolver.resolve(nameHash);
        return { akashaId: normaliseId(GethConnector.getInstance().web3.toUtf8(akashaId)), ethAddress };
    }
    return { ethAddress };
});
