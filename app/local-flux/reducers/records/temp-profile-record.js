import { Record, List } from 'immutable';

export const TempProfileStatus = Record({
    faucetRequested: false,
    publishRequested: false,
    faucetTx: null,
    publishTx: null,
    currentAction: null,
    token: null
});

export const TempProfileRecord = Record({
    localId: '',
    firstName: '',
    lastName: '',
    akashaId: '',
    password: '',
    password2: '',
    address: '',
    ethAddress: '',
    avatar: null,
    backgroundImage: new Map(),
    baseUrl: '',
    about: '',
    links: new List(),
    crypto: new List()
});
