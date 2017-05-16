import { Record, Map, List } from 'immutable';
import { TempProfileRecord, TempProfileStatus } from '../records';

const TempProfileModelRecord = Record({
    tempProfile: new TempProfileRecord(),
    status: new TempProfileStatus()
});

export default class TempProfileModel extends TempProfileModelRecord {
    static createTempProfile (profileData) {
        const { links = [], crypto = [], ...others } = profileData;
        const tLinks = new List(links.map(link => new Map(link)));
        const tCrypto = new List(crypto.map(currency => new Map(currency)));
        return new TempProfileRecord({ links: tLinks, crpto: tCrypto, ...others });
    }
    static profileToTempProfile (profileData) {
        const {
            about = '',
            akashaId,
            avatar,
            backgroundImage,
            crypto,
            ethAddress,
            firstName,
            lastName,
            links
        } = profileData;
        return TempProfileModel.createTempProfile({
            about, akashaId, avatar, backgroundImage, ethAddress, firstName, lastName, links, crypto
        });
    }
    static createStatus (status) {
        return new TempProfileStatus(status);
    }
}
