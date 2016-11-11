import { GethConnector } from '@akashaproject/geth-connector';
import resolveEthAddress from './resolve-ethaddress';

const execute = () => resolveEthAddress.execute(
    { ethAddress: GethConnector.getInstance().web3.eth.defaultAccount }
);
export default { execute, name: 'getCurrentProfile' };
