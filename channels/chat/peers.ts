// import * as Promise from 'bluebird';
// import { roomFactory } from './join';
// import IpfsConnector from '@akashaproject/ipfs-js-connector';
//
// const execute = Promise.coroutine(function* (data: { roomName: string }) {
//     const room = roomFactory.getChanPrefix() + data.roomName;
//     return Promise.fromCallback( cb =>
//         IpfsConnector.getInstance().api.apiClient.pubsub.peers(room, (err, resp: string[]) => {
//             if (err) {
//                return cb(err);
//             }
//             cb('', { count: resp.length });
//         })
//     );
// });
//
// export default { execute, name: 'peerCount' };
