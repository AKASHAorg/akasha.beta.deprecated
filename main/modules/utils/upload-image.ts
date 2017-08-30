import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function*(data: { source: Buffer, size?: string }[]) {

    const uploads = data.map((value, index) => {
        return IpfsConnector
            .getInstance()
            .api
            .addFile(value.source)
            .then((result) => {
                delete data[index].source;
                return { hash: result.hash, size: value.size };
            });
    });
    const collection = yield Promise.all(uploads);
    return { collection };
});

export default { execute, name: 'uploadImage' };
