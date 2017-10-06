import { Record, List } from 'immutable';

const TempProfileStatus = Record({
    faucetRequested: false,
    publishRequested: false,
    faucetTx: null,
    publishTx: null,
    currentAction: null,
    token: null
});

const TempProfile = Record({
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

export { TempProfileStatus };
export default TempProfile;
