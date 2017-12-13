import * as Promise from 'bluebird';
import { post as POST } from 'request';
import { FAUCET_TOKEN, FAUCET_URL } from '../../config/settings';
import { Contracts } from '../../contracts/index';
const execute = Promise.coroutine(function* (data: RequestEtherRequest, cb) {
    return new Promise((resolve, reject) => {
        POST({
                url: FAUCET_URL,
                json: { address: data.address, token: FAUCET_TOKEN },
                agentOptions: { rejectUnauthorized: false }
            },
            (error: Error, response: any, body: { tx: string }) => {
                if (error) {
                    return reject(error);
                }
                resolve(body);
                Contracts.watchTx(body.tx).then(success => cb('', success)).catch(err => cb(err));
            }
        );
    });
});

export default { execute, name: 'requestEther', hasStream: true };
