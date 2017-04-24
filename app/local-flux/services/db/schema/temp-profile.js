import MultiResImage from './multi-res-image';

const TempProfileSchema = {
    firstName: String,
    lastName: String,
    akashaId: String,
    password: Uint8Array,
    address: String,
    avatar: Uint8Array,
    backgroundImage: [[MultiResImage]],
    about: String,
    links: Array,
    status: [{
        currentAction: String,
        faucetRequested: Boolean,
        publishRequested: Boolean,
        faucetTx: null,
        publishTx: null
    }]
};
export default TempProfileSchema;
