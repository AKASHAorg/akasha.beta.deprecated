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
    firstName: '',
    lastName: '',
    akashaId: '',
    password: '',
    address: '',
    ethAddress: '',
    avatar: null,
    backgroundImage: [],
    about: '',
    links: new List(),
    crypto: new List()
});

export { TempProfileStatus };
export default TempProfile;
