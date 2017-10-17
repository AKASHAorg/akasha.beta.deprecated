import { Record, Map, List, fromJS } from 'immutable';
import { TempProfileRecord } from '../records';

const TempProfileModelRecord = Record({
    tempProfile: TempProfileRecord()
});

export default class TempProfileModel extends TempProfileModelRecord {
    static createTempProfile (profileData) {
        const { links = [], crypto = [], backgroundImage, ...others } = profileData;
        const tLinks = new List(links.map(link => new Map(link)));
        const tCrypto = new List(crypto.map(currency => new Map(currency)));
        const tBackgroundImage = fromJS(backgroundImage);
        return new TempProfileRecord({ links: tLinks, crpto: tCrypto, backgroundImage: tBackgroundImage, ...others });
    }
    static profileToTempProfile (profileData) {
        const {
            localId,
            about = '',
            akashaId,
            avatar,
            backgroundImage,
            baseUrl,
            crypto,
            ethAddress,
            firstName,
            lastName,
            links
        } = profileData;
        return TempProfileModel.createTempProfile({
            localId,
            about,
            akashaId,
            avatar,
            backgroundImage,
            baseUrl,
            ethAddress,
            firstName,
            lastName,
            links,
            crypto
        });
    }
}
