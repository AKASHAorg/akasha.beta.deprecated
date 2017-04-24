import { Record } from 'immutable';

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
    address: null,
    avatar: null,
    backgroundImage: [],
    about: null,
    links: []
});

export { TempProfileStatus };
export default TempProfile;
