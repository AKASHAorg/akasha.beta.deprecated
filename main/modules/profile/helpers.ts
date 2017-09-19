import contracts from '../../contracts/index';

export const profileAddress = async function(data) {
    let profileAddress;
    if (data.akashaId) {
        profileAddress = await contracts.instance.ProfileResolver.addr(data.akashaId);
    } else if (data.ethAddress) {
        profileAddress = data.ethAddress;
    }
    if (!profileAddress) {
        throw new Error('Must provide an akasha ID or ethereum address');
    }
    return profileAddress;
};
