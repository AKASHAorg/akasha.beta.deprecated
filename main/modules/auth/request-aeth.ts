import * as Promise from 'bluebird';
import { post as POST } from 'request';
import { FAUCET_TOKEN, FAUCET_URL } from '../../config/settings';

const execute = Promise.coroutine(function*(data: RequestEtherRequest) {
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
                return resolve(body);
            }
        );
    });
});

export default { execute, name: 'requestEther' };
