import { Record, List, Map } from 'immutable';

export const TempProfileRecord = Record({
    localId: '',
    firstName: '',
    lastName: '',
    akashaId: '',
    donationsEnabled: true,
    ethAddress: '',
    avatar: null,
    backgroundImage: new Map(),
    baseUrl: '',
    about: '',
    links: new List(),
    crypto: new List()
});
